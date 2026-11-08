// End-to-end check of rules + Cloud Functions against the local emulators.
// Run:  firebase emulators:exec --only auth,firestore,functions,storage "node scripts/emulator-test.js"
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  getFirestore, connectFirestoreEmulator, collection, query, where, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, serverTimestamp,
} from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";

// firebase-admin is installed in functions/, not the frontend.
const requireFromFunctions = createRequire(new URL("../functions/package.json", import.meta.url));
const { initializeApp: initAdmin } = requireFromFunctions("firebase-admin/app");
const { getFirestore: adminDb } = requireFromFunctions("firebase-admin/firestore");
const { getAuth: adminAuth } = requireFromFunctions("firebase-admin/auth");

const PROJECT = "vio-gift";
const secret = readFileSync(new URL("../functions/.secret.local", import.meta.url), "utf8").match(/PAYSTACK_SECRET_KEY=(.+)/)[1].trim();

initAdmin({ projectId: PROJECT });
const adb = adminDb();
const app = initializeApp({ projectId: PROJECT, apiKey: "fake-key", authDomain: `${PROJECT}.firebaseapp.com` });
const auth = getAuth(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
const db = getFirestore(app);
connectFirestoreEmulator(db, "127.0.0.1", 8080);
const fns = getFunctions(app, "us-central1");
connectFunctionsEmulator(fns, "127.0.0.1", 5001);
const call = (name, data) => httpsCallable(fns, name)(data).then((r) => r.data);

let failures = 0;
async function check(name, fn) {
  try {
    await fn();
    console.log(`  PASS  ${name}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${name}\n        ${err.message}`);
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
async function denied(promise, codeMatch = /permission|denied/i) {
  try {
    await promise;
  } catch (err) {
    assert(codeMatch.test(err.code || err.message), `expected denial, got ${err.code}: ${err.message}`);
    return;
  }
  throw new Error("expected this to be rejected, but it succeeded");
}
const stockOf = async (id) => (await adb.doc(`products/${id}`).get()).data().stock;
const tomorrow = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date(Date.now() + 2 * 86400000));

// ── Fixtures ──
await adb.doc("products/test-box").set({ name: "Test Box", price: 85, stock: 5, visible: true, theme: "mum", category: "health", image: "x" });
await adb.doc("products/hidden-box").set({ name: "Hidden Box", price: 50, stock: 5, visible: false, theme: "mum", category: "health", image: "x" });

const customer = { name: "Ada Test", email: "ada@example.com", phone: "08031234567", address: "1 Test St", city: "Lekki", state: "Lagos" };
const baseOrder = { customer, fulfillment: "delivery", scheduledFor: tomorrow, paymentOption: "later", giftOption: "bag" };

console.log("\nSecurity rules (signed out):");
await check("can list visible products", async () => {
  const snap = await getDocs(query(collection(db, "products"), where("visible", "==", true)));
  assert(snap.docs.some((d) => d.id === "test-box"), "test-box not returned");
});
await check("cannot read a hidden product", () => denied(getDoc(doc(db, "products/hidden-box"))));
await check("cannot edit products", () => denied(updateDoc(doc(db, "products/test-box"), { price: 1 })));
await check("cannot read orders", () => denied(getDocs(collection(db, "orders"))));
await check("cannot create orders directly", () => denied(setDoc(doc(db, "orders/VGS-HACK0001"), { total: 1 })));
await check("can submit a valid corporate enquiry", () =>
  addDoc(collection(db, "enquiries"), {
    companyName: "Acme", contactName: "Ada", email: "ada@acme.ng", phone: "", quantity: 20, budget: "", occasion: "", requirements: "", tier: "",
    status: "New", createdAt: serverTimestamp(),
  })
);
await check("cannot submit an enquiry with extra fields", () =>
  denied(addDoc(collection(db, "enquiries"), { companyName: "Acme", contactName: "Ada", email: "ada@acme.ng", quantity: 1, status: "Won", createdAt: serverTimestamp(), admin: true }))
);
await check("cannot read enquiries", () => denied(getDocs(collection(db, "enquiries"))));

console.log("\ncreateOrder:");
let later;
await check("pay-later order uses server prices and reserves stock", async () => {
  later = await call("createOrder", { ...baseOrder, items: [{ id: "test-box", quantity: 2, price: 1 }] });
  assert(later.total === 175, `total should be 2 x 85 + 5 gift bag = 175, got ${later.total}`);
  assert((await stockOf("test-box")) === 3, "stock should drop from 5 to 3");
  const saved = (await adb.doc(`orders/${later.orderNumber}`).get()).data();
  assert(saved.paymentStatus === "Unpaid" && saved.status === "Pending", "order should be Pending/Unpaid");
});
await check("rejects hidden products", () => denied(call("createOrder", { ...baseOrder, items: [{ id: "hidden-box", quantity: 1 }] }), /failed-precondition/));
await check("rejects more than is in stock", () => denied(call("createOrder", { ...baseOrder, items: [{ id: "test-box", quantity: 4 }] }), /failed-precondition/));
await check("rejects pay later without a date", () =>
  denied(call("createOrder", { ...baseOrder, scheduledFor: null, items: [{ id: "test-box", quantity: 1 }] }), /invalid-argument/)
);
await check("queues the pay-later email", async () => {
  const mail = await adb.collection("mail").where("to", "==", "ada@example.com").get();
  assert(!mail.empty, "no email queued");
});

let now;
await check("pay-now order starts a real Paystack test transaction", async () => {
  now = await call("createOrder", { ...baseOrder, paymentOption: "now", giftOption: "", items: [{ id: "test-box", quantity: 1 }] });
  assert(now.accessCode && now.reference, "no Paystack access code returned");
  assert((await stockOf("test-box")) === 2, "stock should now be 2");
});

console.log("\ngetOrder:");
await check("wrong token is rejected", () => denied(call("getOrder", { orderNumber: later.orderNumber, token: "nope" }), /not-found/));
await check("right token returns the order without private fields", async () => {
  const o = await call("getOrder", { orderNumber: later.orderNumber, token: later.payToken });
  assert(o.orderNumber === later.orderNumber && o.total === 175, "wrong order returned");
  assert(!("payToken" in o) && !("stockReserved" in o), "private fields leaked");
});

console.log("\nPaystack webhook:");
const hookUrl = `http://127.0.0.1:5001/${PROJECT}/us-central1/paystackWebhook`;
const sendHook = (payload, signature) =>
  fetch(hookUrl, { method: "POST", headers: { "Content-Type": "application/json", "x-paystack-signature": signature }, body: payload });
await check("rejects a bad signature", async () => {
  const res = await sendHook(JSON.stringify({ event: "charge.success", data: {} }), "bad");
  assert(res.status === 401, `expected 401, got ${res.status}`);
});
await check("ignores an underpayment", async () => {
  const body = JSON.stringify({ event: "charge.success", data: { reference: now.reference, amount: 100, currency: "NGN", channel: "card", metadata: { orderNumber: now.orderNumber } } });
  const res = await sendHook(body, crypto.createHmac("sha512", secret).update(body).digest("hex"));
  assert(res.status === 200, `expected 200, got ${res.status}`);
  const o = (await adb.doc(`orders/${now.orderNumber}`).get()).data();
  assert(o.paymentStatus === "Awaiting" && o.paymentIssue, "underpayment should not mark paid");
});
await check("marks the order paid on a valid signed charge", async () => {
  const body = JSON.stringify({ event: "charge.success", data: { reference: now.reference, amount: 8500, currency: "NGN", channel: "bank_transfer", paid_at: new Date().toISOString(), metadata: { orderNumber: now.orderNumber } } });
  const res = await sendHook(body, crypto.createHmac("sha512", secret).update(body).digest("hex"));
  assert(res.status === 200, `expected 200, got ${res.status}`);
  const o = (await adb.doc(`orders/${now.orderNumber}`).get()).data();
  assert(o.paymentStatus === "Paid" && o.paymentMethod === "Bank Transfer", `got ${o.paymentStatus} / ${o.paymentMethod}`);
});

console.log("\nAdmin:");
await check("non-admin cannot change order status", () => denied(call("setOrderStatus", { orderNumber: later.orderNumber, status: "Cancelled" })));
const adminUser = await adminAuth().createUser({ email: "admin@example.com", password: "test-password-123" });
await adminAuth().setCustomUserClaims(adminUser.uid, { admin: true });
const staffUser = await adminAuth().createUser({ email: "staff@example.com", password: "test-password-123" });
await check("signed-in non-admin still cannot read orders", async () => {
  await signInWithEmailAndPassword(auth, "staff@example.com", "test-password-123");
  await denied(getDocs(collection(db, "orders")));
  await signOut(auth);
});
await signInWithEmailAndPassword(auth, "admin@example.com", "test-password-123");
await check("admin can read orders and hidden products", async () => {
  await getDocs(collection(db, "orders"));
  await getDoc(doc(db, "products/hidden-box"));
});
await check("admin can edit a product", () => updateDoc(doc(db, "products/test-box"), { price: 90, updatedAt: serverTimestamp() }));
await check("admin cannot save an invalid product", () => denied(updateDoc(doc(db, "products/test-box"), { price: -5 })));
await check("admin cannot rewrite order totals", () => denied(updateDoc(doc(db, `orders/${later.orderNumber}`), { total: 1 })));
await check("admin can record a manual payment", () =>
  updateDoc(doc(db, `orders/${later.orderNumber}`), { paymentStatus: "Paid", paymentMethod: "Bank Transfer", paidAt: serverTimestamp(), updatedAt: serverTimestamp() })
);
await check("cancelling returns stock; reopening takes it again", async () => {
  const before = await stockOf("test-box");
  await call("setOrderStatus", { orderNumber: later.orderNumber, status: "Cancelled" });
  assert((await stockOf("test-box")) === before + 2, "stock not returned on cancel");
  await call("setOrderStatus", { orderNumber: later.orderNumber, status: "Cancelled" });
  assert((await stockOf("test-box")) === before + 2, "double cancel returned stock twice");
  await call("setOrderStatus", { orderNumber: later.orderNumber, status: "Processing" });
  assert((await stockOf("test-box")) === before, "stock not retaken on reopen");
});
await signOut(auth);

console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
