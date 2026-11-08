import { defineStore } from "pinia";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  deleteField,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "@/firebase";

export const ORDER_STATUSES = ["Pending", "Processing", "Dispatched", "Delivered", "Cancelled"];
export const ENQUIRY_STATUSES = ["New", "Contacted", "Quoted", "Won", "Lost"];
export const LOW_STOCK_THRESHOLD = 8;

// Booking dates are stored as local "YYYY-MM-DD" keys so they compare as strings
// and don't shift across time zones.
export function toDateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function todayKey(offsetDays = 0) {
  return toDateKey(Date.now() + offsetDays * 86400000);
}

export function formatDateKey(key, opts = { weekday: "short", day: "numeric", month: "short", year: "numeric" }) {
  if (!key) return "";
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", opts);
}

// Payment state shown to admins: Paid, Unpaid (pay later, not yet due), Overdue,
// Awaiting (pay-now checkout not completed) or Void (cancelled before payment).
export function paymentState(order) {
  if (order.paymentStatus === "Paid") return "Paid";
  if (order.status === "Cancelled") return "Void";
  if (order.paymentOption !== "later") return "Awaiting";
  return order.scheduledFor && order.scheduledFor < todayKey() ? "Overdue" : "Unpaid";
}

// Firestore timestamps become ISO strings so the dashboard can treat them like before.
// A just-written serverTimestamp() reads back as null until the server confirms it.
const toIso = (ts) => (ts?.toDate ? ts.toDate().toISOString() : ts || new Date().toISOString());

function fromOrderDoc(d) {
  const o = d.data();
  return {
    scheduledFor: null,
    scheduledTime: "",
    paymentOption: "now",
    ...o,
    orderNumber: d.id,
    createdAt: toIso(o.createdAt),
    paidAt: o.paidAt ? toIso(o.paidAt) : null,
  };
}

let unsubscribers = [];

export const useAdminStore = defineStore("admin", {
  state: () => ({
    orders: [],
    enquiries: [],
    loaded: false,
    error: null,
  }),

  actions: {
    subscribe() {
      if (unsubscribers.length) return;
      const onError = (err) => {
        console.error("Admin listener failed", err);
        this.error = err.message;
        this.loaded = true;
      };
      unsubscribers = [
        onSnapshot(
          query(collection(db, "orders"), orderBy("createdAt", "desc")),
          (snap) => {
            this.orders = snap.docs.map(fromOrderDoc);
            this.loaded = true;
          },
          onError
        ),
        onSnapshot(
          query(collection(db, "enquiries"), orderBy("createdAt", "desc")),
          (snap) => {
            this.enquiries = snap.docs.map((d) => ({ ...d.data(), id: d.id, createdAt: toIso(d.data().createdAt) }));
          },
          onError
        ),
      ];
    },

    unsubscribe() {
      unsubscribers.forEach((u) => u());
      unsubscribers = [];
      this.$reset();
    },

    markPaid(orderNumber, method) {
      return updateDoc(doc(db, "orders", orderNumber), {
        paymentStatus: "Paid",
        paymentMethod: method,
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },

    markUnpaid(orderNumber) {
      return updateDoc(doc(db, "orders", orderNumber), {
        paymentStatus: "Unpaid",
        paymentMethod: "Pay later",
        paidAt: deleteField(),
        updatedAt: serverTimestamp(),
      });
    },

    // Runs on the server so stock is released or retaken together with the status change.
    setOrderStatus(orderNumber, status) {
      return httpsCallable(functions, "setOrderStatus")({ orderNumber, status });
    },

    setEnquiryStatus(id, status) {
      return updateDoc(doc(db, "enquiries", id), { status, updatedAt: serverTimestamp() });
    },

    // Public: used by the corporate enquiry form. Field checks live in firestore.rules.
    recordEnquiry(enquiry) {
      return addDoc(collection(db, "enquiries"), {
        ...enquiry,
        status: "New",
        createdAt: serverTimestamp(),
      });
    },
  },
});
