import crypto from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret, defineString } from "firebase-functions/params";
import { setGlobalOptions, logger } from "firebase-functions/v2";
import * as paystack from "./paystack.js";
import * as mail from "./email.js";

initializeApp();
const db = getFirestore();

setGlobalOptions({ region: "us-central1", maxInstances: 10 });

const PAYSTACK_SECRET_KEY = defineSecret("PAYSTACK_SECRET_KEY");
const SITE_URL = defineString("SITE_URL", {
  default: "https://vio-gift.web.app",
  description: "Public URL of the shop, used in payment links and Paystack redirects.",
});

// Must match GIFT_EXTRAS in src/store/cart.js, which only displays them.
const GIFT_EXTRAS = { bag: 5, wrap: 3 };
const PICKUP_TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const ORDER_STATUSES = ["Pending", "Processing", "Dispatched", "Delivered", "Cancelled"];
const TIME_ZONE = "Africa/Lagos";
// Pay-now orders that are still unpaid after this long are cancelled and their stock released.
const ABANDONED_AFTER_MINUTES = 60;
const MAX_LINES = 30;
const MAX_QTY = 100;

// ── Helpers ──

// "YYYY-MM-DD" in Lagos time, matching the date keys the shop stores.
function dateKey(offsetDays = 0) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(Date.now() + offsetDays * 86400000)
  );
}

function text(value, label, { max = 200, required = false } = {}) {
  const s = typeof value === "string" ? value.trim() : "";
  if (required && !s) throw new HttpsError("invalid-argument", `${label} is required.`);
  if (s.length > max) throw new HttpsError("invalid-argument", `${label} is too long (max ${max} characters).`);
  return s;
}

const isDateKey = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const roundMoney = (v) => Math.round(v * 100) / 100;
const payUrl = (orderNumber, payToken) => `${SITE_URL.value()}/pay/${orderNumber}?t=${payToken}`;

function tokensMatch(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

async function loadOrderWithToken(orderNumber, token) {
  if (typeof orderNumber !== "string" || !/^VGS-[A-Z0-9]{6,12}$/.test(orderNumber)) {
    throw new HttpsError("not-found", "Order not found.");
  }
  const ref = db.collection("orders").doc(orderNumber);
  const snap = await ref.get();
  // Same error for wrong token and missing order, so order numbers can't be probed.
  if (!snap.exists || !tokensMatch(snap.data().payToken, token)) throw new HttpsError("not-found", "Order not found.");
  return { ref, order: { ...snap.data(), orderNumber } };
}

// What the customer is allowed to see about their own order.
function publicOrder(order) {
  const { name, email, phone, address, city, state } = order.customer;
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentOption: order.paymentOption,
    paymentMethod: order.paymentMethod || "",
    items: order.items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
    subtotal: order.subtotal,
    giftExtra: order.giftExtra || 0,
    giftOption: order.giftOption || "",
    total: order.total,
    customer: { name, email, phone, address, city, state },
    fulfillmentMethod: order.fulfillmentMethod,
    scheduledFor: order.scheduledFor,
    scheduledTime: order.scheduledTime,
    createdAt: order.createdAt?.toDate?.().toISOString() ?? null,
  };
}

// Moves stock back to products when an order is cancelled, or takes it again if a
// cancelled order is revived. Must run inside a transaction; reads happen first.
async function applyStatusChange(tx, ref, order, newStatus, extra = {}) {
  const releasing = newStatus === "Cancelled" && order.status !== "Cancelled" && order.stockReserved;
  const reserving = newStatus !== "Cancelled" && order.status === "Cancelled" && !order.stockReserved;
  let productSnaps = [];
  if (releasing || reserving) {
    productSnaps = await tx.getAll(...order.items.map((i) => db.collection("products").doc(i.id)));
  }
  productSnaps.forEach((snap, idx) => {
    if (!snap.exists) return; // Deleted products have nothing to restock.
    const qty = order.items[idx].quantity;
    tx.update(snap.ref, { stock: FieldValue.increment(releasing ? qty : -qty), updatedAt: FieldValue.serverTimestamp() });
  });
  tx.update(ref, {
    status: newStatus,
    ...(releasing ? { stockReserved: false } : {}),
    ...(reserving ? { stockReserved: true } : {}),
    ...extra,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

async function startPaystack(ref, order) {
  const reference = `${order.orderNumber}-${Date.now().toString(36).toUpperCase()}`;
  const data = await paystack.initializeTransaction(PAYSTACK_SECRET_KEY.value(), {
    email: order.customer.email,
    amountNaira: order.total,
    reference,
    callbackUrl: `${SITE_URL.value()}/order-complete?order=${order.orderNumber}&t=${order.payToken}`,
    metadata: { orderNumber: order.orderNumber },
  });
  await ref.update({
    paystackReference: reference,
    paystackReferences: FieldValue.arrayUnion(reference),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { accessCode: data.access_code, reference };
}

// Records a successful Paystack charge. Safe to call more than once for the same payment.
async function markOrderPaid(orderNumber, charge) {
  const ref = db.collection("orders").doc(orderNumber);
  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      logger.error("Payment for unknown order", { orderNumber, reference: charge.reference });
      return null;
    }
    const order = { ...snap.data(), orderNumber };
    if (order.paymentStatus === "Paid") return null;

    if (charge.currency !== "NGN" || charge.amount < paystack.toKobo(order.total)) {
      logger.error("Payment amount mismatch", { orderNumber, charge, expectedKobo: paystack.toKobo(order.total) });
      tx.update(ref, {
        paymentIssue: `Paystack charge ${charge.reference} was ${charge.currency} ${charge.amount / 100}, expected NGN ${order.total}`,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return null;
    }

    const paidFields = {
      paymentStatus: "Paid",
      paymentMethod: paystack.channelLabel(charge.channel),
      paidAt: charge.paidAt ? Timestamp.fromDate(new Date(charge.paidAt)) : FieldValue.serverTimestamp(),
      paystackReference: charge.reference,
    };
    if (order.status === "Cancelled") {
      // Paid after we released it (e.g. very late transfer): revive it and take the stock again.
      logger.warn("Payment received for cancelled order; reviving", { orderNumber });
      await applyStatusChange(tx, ref, order, "Pending", { ...paidFields, paidAfterCancel: true });
    } else {
      tx.update(ref, { ...paidFields, updatedAt: FieldValue.serverTimestamp() });
    }
    return order;
  });
  if (result) await mail.sendPaymentReceived(result);
  return Boolean(result);
}

const chargeFromPaystack = (data) => ({
  reference: data.reference,
  amount: data.amount,
  currency: data.currency,
  channel: data.channel,
  paidAt: data.paid_at || data.paidAt,
});

// ── Customer-facing functions ──

export const createOrder = onCall({ secrets: [PAYSTACK_SECRET_KEY] }, async (req) => {
  const d = req.data || {};

  const fulfillment = d.fulfillment;
  if (fulfillment !== "delivery" && fulfillment !== "pickup") throw new HttpsError("invalid-argument", "Choose delivery or pickup.");
  const isDelivery = fulfillment === "delivery";

  const customer = {
    name: text(d.customer?.name, "Full name", { required: true, max: 120 }),
    email: text(d.customer?.email, "Email", { required: true, max: 200 }).toLowerCase(),
    phone: text(d.customer?.phone, "Phone", { required: true, max: 40 }),
    address: isDelivery ? text(d.customer?.address, "Street address", { required: true, max: 300 }) : "",
    city: isDelivery ? text(d.customer?.city, "City", { required: true, max: 100 }) : "",
    state: isDelivery ? text(d.customer?.state, "State", { required: true, max: 60 }) : "",
    landmark: isDelivery ? text(d.customer?.landmark, "Landmark", { max: 200 }) : "",
  };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email)) throw new HttpsError("invalid-argument", "Enter a valid email address.");

  let scheduledFor = null;
  let scheduledTime = "";
  if (!isDelivery) {
    if (!isDateKey(d.scheduledFor) || d.scheduledFor < dateKey(0)) throw new HttpsError("invalid-argument", "Choose a pickup date from today onwards.");
    if (!PICKUP_TIMES.includes(d.scheduledTime)) throw new HttpsError("invalid-argument", "Choose a pickup time.");
    scheduledFor = d.scheduledFor;
    scheduledTime = d.scheduledTime;
  } else if (d.scheduledFor) {
    if (!isDateKey(d.scheduledFor) || d.scheduledFor < dateKey(1)) throw new HttpsError("invalid-argument", "Choose a delivery date from tomorrow onwards.");
    scheduledFor = d.scheduledFor;
  }

  const paymentOption = d.paymentOption === "later" ? "later" : "now";
  if (paymentOption === "later" && !scheduledFor) throw new HttpsError("invalid-argument", "Pay later needs a booked date.");

  const giftOption = GIFT_EXTRAS[d.giftOption] ? d.giftOption : "";
  const gifting = {
    from: text(d.gifting?.from, "Gift from", { max: 80 }),
    to: text(d.gifting?.to, "Gift to", { max: 80 }),
    note: text(d.gifting?.note, "Gift message", { max: 500 }),
  };
  const orderNote = text(d.orderNote, "Order note", { max: 1000 });

  // Only ids and quantities are trusted from the browser; prices come from Firestore.
  const lines = new Map();
  for (const line of Array.isArray(d.items) ? d.items : []) {
    const qty = Number(line?.quantity);
    if (typeof line?.id !== "string" || !line.id || line.id.includes("/") || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      throw new HttpsError("invalid-argument", "Your cart has an invalid item. Please refresh and try again.");
    }
    lines.set(line.id, (lines.get(line.id) || 0) + qty);
  }
  if (!lines.size) throw new HttpsError("invalid-argument", "Your cart is empty.");
  if (lines.size > MAX_LINES) throw new HttpsError("invalid-argument", "Too many different items in one order.");

  const orderNumber = `VGS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const ref = db.collection("orders").doc(orderNumber);
  const payToken = crypto.randomBytes(16).toString("hex");

  const order = await db.runTransaction(async (tx) => {
    const ids = [...lines.keys()];
    const snaps = await tx.getAll(...ids.map((id) => db.collection("products").doc(id)));
    const items = snaps.map((snap) => {
      const p = snap.data();
      const quantity = lines.get(snap.id);
      if (!snap.exists || p.visible === false) {
        throw new HttpsError("failed-precondition", "An item in your cart is no longer available. Please remove it and try again.");
      }
      if ((p.stock ?? 0) < quantity) {
        throw new HttpsError(
          "failed-precondition",
          p.stock > 0 ? `Only ${p.stock} of "${p.name}" left. Please lower the quantity.` : `"${p.name}" is out of stock.`
        );
      }
      return { id: snap.id, name: p.name, price: p.price, quantity, image: p.image || "", category: p.category || "", theme: p.theme || "" };
    });

    const subtotal = roundMoney(items.reduce((s, i) => s + i.price * i.quantity, 0));
    const giftExtra = GIFT_EXTRAS[giftOption] || 0;
    const data = {
      customer,
      items,
      subtotal,
      giftOption,
      giftExtra,
      total: roundMoney(subtotal + giftExtra),
      gifting,
      orderNote,
      fulfillmentMethod: isDelivery ? "Delivery" : "Pickup",
      scheduledFor,
      scheduledTime,
      paymentOption,
      paymentStatus: paymentOption === "later" ? "Unpaid" : "Awaiting",
      paymentMethod: paymentOption === "later" ? "Pay later" : "",
      status: "Pending",
      stockReserved: true,
      payToken,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    snaps.forEach((snap) => tx.update(snap.ref, { stock: FieldValue.increment(-lines.get(snap.id)), updatedAt: FieldValue.serverTimestamp() }));
    tx.create(ref, data);
    return { ...data, orderNumber };
  });

  if (paymentOption === "later") {
    await mail.sendPayLaterBooked(order, payUrl(orderNumber, payToken));
    return { orderNumber, payToken, paymentOption, total: order.total };
  }

  try {
    const { accessCode, reference } = await startPaystack(ref, order);
    return { orderNumber, payToken, paymentOption, total: order.total, accessCode, reference };
  } catch (err) {
    logger.error("Could not start Paystack transaction", { orderNumber, err: err.message });
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      await applyStatusChange(tx, ref, snap.data(), "Cancelled", { cancelReason: "Payment could not be started" });
    });
    throw new HttpsError("unavailable", "We couldn't start the payment. Please try again in a moment.");
  }
});

// Opens a fresh Paystack payment for an existing order (pay-later link, or retry after closing the popup).
export const startPayment = onCall({ secrets: [PAYSTACK_SECRET_KEY] }, async (req) => {
  const { ref, order } = await loadOrderWithToken(req.data?.orderNumber, req.data?.token);
  if (order.paymentStatus === "Paid") return { alreadyPaid: true, order: publicOrder(order) };
  if (order.status === "Cancelled") {
    throw new HttpsError("failed-precondition", "This order has been cancelled. Please place a new order or contact us.");
  }
  const { accessCode, reference } = await startPaystack(ref, order);
  return { alreadyPaid: false, accessCode, reference, order: publicOrder(order) };
});

// Lets the order page confirm payment straight away instead of waiting for the webhook.
export const getOrder = onCall({ secrets: [PAYSTACK_SECRET_KEY] }, async (req) => {
  let { ref, order } = await loadOrderWithToken(req.data?.orderNumber, req.data?.token);
  if (order.paymentStatus !== "Paid" && order.paystackReference && req.data?.verify) {
    try {
      const data = await paystack.verifyTransaction(PAYSTACK_SECRET_KEY.value(), order.paystackReference);
      if (data.status === "success" && (await markOrderPaid(order.orderNumber, chargeFromPaystack(data)))) {
        order = { ...(await ref.get()).data(), orderNumber: order.orderNumber };
      }
    } catch (err) {
      logger.warn("Verify on order page failed", { orderNumber: order.orderNumber, err: err.message });
    }
  }
  return publicOrder(order);
});

// Paystack calls this after every charge. Set the URL in Paystack > Settings > API Keys & Webhooks.
export const paystackWebhook = onRequest({ secrets: [PAYSTACK_SECRET_KEY], cors: false }, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }
  if (!paystack.isValidSignature(PAYSTACK_SECRET_KEY.value(), req.rawBody, req.get("x-paystack-signature"))) {
    logger.warn("Rejected webhook with bad signature");
    res.status(401).send("Invalid signature");
    return;
  }
  const { event, data } = req.body || {};
  try {
    if (event === "charge.success") {
      const orderNumber = data?.metadata?.orderNumber || String(data?.reference || "").split("-").slice(0, 2).join("-");
      await markOrderPaid(orderNumber, chargeFromPaystack(data));
    }
    res.status(200).send("ok");
  } catch (err) {
    // A 500 makes Paystack retry later.
    logger.error("Webhook handling failed", { event, reference: data?.reference, err: err.message });
    res.status(500).send("error");
  }
});

// ── Admin functions ──

// Status changes go through here so stock is released or retaken in the same transaction.
export const setOrderStatus = onCall(async (req) => {
  if (req.auth?.token?.admin !== true) throw new HttpsError("permission-denied", "Admins only.");
  const { orderNumber, status } = req.data || {};
  if (!ORDER_STATUSES.includes(status)) throw new HttpsError("invalid-argument", "Unknown status.");
  if (typeof orderNumber !== "string" || !orderNumber || orderNumber.includes("/")) throw new HttpsError("invalid-argument", "Missing order.");
  const ref = db.collection("orders").doc(orderNumber);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Order not found.");
    await applyStatusChange(tx, ref, snap.data(), status, { statusChangedBy: req.auth.token.email || req.auth.uid });
  });
  return { ok: true };
});

// ── Scheduled jobs ──

// Pay-now checkouts that never completed: confirm with Paystack, otherwise cancel and restock.
export const releaseAbandonedCheckouts = onSchedule(
  { schedule: "every 30 minutes", timeZone: TIME_ZONE, secrets: [PAYSTACK_SECRET_KEY] },
  async () => {
    const cutoff = Timestamp.fromMillis(Date.now() - ABANDONED_AFTER_MINUTES * 60000);
    const snap = await db.collection("orders").where("paymentStatus", "==", "Awaiting").where("createdAt", "<", cutoff).limit(200).get();
    for (const doc of snap.docs) {
      const order = { ...doc.data(), orderNumber: doc.id };
      if (order.status === "Cancelled") continue;
      try {
        if (order.paystackReference) {
          const data = await paystack.verifyTransaction(PAYSTACK_SECRET_KEY.value(), order.paystackReference).catch(() => null);
          if (data?.status === "success") {
            await markOrderPaid(doc.id, chargeFromPaystack(data));
            continue;
          }
        }
        await db.runTransaction(async (tx) => {
          const fresh = await tx.get(doc.ref);
          const f = fresh.data();
          if (f.paymentStatus !== "Awaiting" || f.status === "Cancelled") return;
          await applyStatusChange(tx, doc.ref, f, "Cancelled", { cancelReason: "Checkout not completed" });
        });
      } catch (err) {
        logger.error("Could not release abandoned checkout", { orderNumber: doc.id, err: err.message });
      }
    }
  }
);

// Every morning: remind pay-later customers due today or tomorrow, release bookings whose date has passed.
export const payLaterDaily = onSchedule({ schedule: "every day 08:00", timeZone: TIME_ZONE }, async () => {
  const today = dateKey(0);
  const snap = await db.collection("orders").where("paymentStatus", "==", "Unpaid").where("scheduledFor", "<=", dateKey(1)).get();
  for (const doc of snap.docs) {
    const order = { ...doc.data(), orderNumber: doc.id };
    if (order.status === "Cancelled") continue;
    try {
      if (order.scheduledFor < today) {
        await db.runTransaction(async (tx) => {
          const fresh = (await tx.get(doc.ref)).data();
          if (fresh.paymentStatus !== "Unpaid" || fresh.status === "Cancelled") return;
          await applyStatusChange(tx, doc.ref, fresh, "Cancelled", { cancelReason: "Pay-later booking not paid by its date" });
        });
        await mail.sendBookingReleased(order);
      } else if (order.lastReminderOn !== today) {
        await mail.sendPaymentReminder(order, payUrl(doc.id, order.payToken));
        await doc.ref.update({ lastReminderOn: today });
      }
    } catch (err) {
      logger.error("Pay-later job failed for order", { orderNumber: doc.id, err: err.message });
    }
  }
});
