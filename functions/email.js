import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Emails are queued in the "mail" collection, which the Firebase "Trigger Email from
// Firestore" extension watches and sends. Without the extension they simply wait there.

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const naira = (v) => `₦${Number(v || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function formatDateKey(key) {
  if (!key) return "";
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

function layout(title, body) {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#2e1b30">
  <div style="background:#5b2a6e;color:#faf7f0;padding:20px 24px;border-radius:12px 12px 0 0">
    <h2 style="margin:0;font-weight:normal">${esc(title)}</h2>
  </div>
  <div style="border:1px solid #eadff0;border-top:none;padding:24px;border-radius:0 0 12px 12px">${body}
    <p style="color:#7a6a80;font-size:12px;margin-top:32px">VioGiftStore — premium sustainable gifting</p>
  </div>
</div>`;
}

function itemsTable(order) {
  const rows = order.items
    .map((i) => `<tr><td style="padding:6px 0">${i.quantity} × ${esc(i.name)}</td><td style="text-align:right">${naira(i.price * i.quantity)}</td></tr>`)
    .join("");
  const extra = order.giftExtra
    ? `<tr><td style="padding:6px 0">Gift ${order.giftOption === "bag" ? "bag" : "wrap"}</td><td style="text-align:right">${naira(order.giftExtra)}</td></tr>`
    : "";
  return `<table style="width:100%;border-collapse:collapse;margin:16px 0">${rows}${extra}
    <tr><td style="padding-top:10px;border-top:1px solid #eadff0"><strong>Total</strong></td>
    <td style="padding-top:10px;border-top:1px solid #eadff0;text-align:right"><strong>${naira(order.total)}</strong></td></tr></table>`;
}

function when(order) {
  if (order.fulfillmentMethod === "Pickup") return `Pickup on ${formatDateKey(order.scheduledFor)} at ${esc(order.scheduledTime)}.`;
  if (order.scheduledFor) return `Delivery booked for ${formatDateKey(order.scheduledFor)}.`;
  return "We'll deliver as soon as possible.";
}

function queue(to, subject, html) {
  return getFirestore().collection("mail").add({ to, message: { subject, html }, createdAt: FieldValue.serverTimestamp() });
}

export function sendPaymentReceived(order) {
  return queue(
    order.customer.email,
    `Order ${order.orderNumber} confirmed`,
    layout(
      "Thank you — payment received",
      `<p>Hi ${esc(order.customer.name)},</p>
       <p>We've received your payment for order <strong>${esc(order.orderNumber)}</strong>. ${when(order)}</p>
       ${itemsTable(order)}`
    )
  );
}

export function sendPayLaterBooked(order, payUrl) {
  return queue(
    order.customer.email,
    `Your gift is reserved — order ${order.orderNumber}`,
    layout(
      "Your gift is reserved",
      `<p>Hi ${esc(order.customer.name)},</p>
       <p>Order <strong>${esc(order.orderNumber)}</strong> is reserved. ${when(order)}</p>
       ${itemsTable(order)}
       <p>Please pay before ${formatDateKey(order.scheduledFor)}. Unpaid bookings may be released on the booked date.</p>
       <p><a href="${esc(payUrl)}" style="display:inline-block;background:#5b2a6e;color:#faf7f0;padding:12px 24px;border-radius:10px;text-decoration:none">Pay securely with Paystack</a></p>`
    )
  );
}

export function sendPaymentReminder(order, payUrl) {
  return queue(
    order.customer.email,
    `Reminder: payment due for order ${order.orderNumber}`,
    layout(
      "Payment reminder",
      `<p>Hi ${esc(order.customer.name)},</p>
       <p>Your booking <strong>${esc(order.orderNumber)}</strong> is due on ${formatDateKey(order.scheduledFor)} and hasn't been paid yet.</p>
       <p><a href="${esc(payUrl)}" style="display:inline-block;background:#5b2a6e;color:#faf7f0;padding:12px 24px;border-radius:10px;text-decoration:none">Pay ${naira(order.total)} now</a></p>`
    )
  );
}

export function sendBookingReleased(order) {
  return queue(
    order.customer.email,
    `Booking ${order.orderNumber} released`,
    layout(
      "Your booking has been released",
      `<p>Hi ${esc(order.customer.name)},</p>
       <p>We didn't receive payment for order <strong>${esc(order.orderNumber)}</strong> by its booked date, so it has been released.
       If this is a mistake, reply to this email or message us on WhatsApp and we'll help.</p>`
    )
  );
}
