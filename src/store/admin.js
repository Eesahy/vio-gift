import { defineStore } from "pinia";
import { allProducts } from "@/data/products";

// There is no backend yet, so the admin store persists orders and corporate
// enquiries in localStorage. When an API exists, swap read/write for fetch calls.
const ORDERS_KEY = "vio-admin-orders";
const ENQUIRIES_KEY = "vio-admin-enquiries";
// Bump when the sample data shape changes so stale sample orders get regenerated.
const SAMPLE_VERSION_KEY = "vio-admin-sample-version";
const SAMPLE_VERSION = 2;

export const ORDER_STATUSES = ["Pending", "Processing", "Dispatched", "Delivered", "Cancelled"];
export const ENQUIRY_STATUSES = ["New", "Contacted", "Quoted", "Won", "Lost"];
export const LOW_STOCK_THRESHOLD = 8;

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — the dashboard still works for this session.
  }
}

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

// Payment state shown to admins: Paid, Unpaid (pay later, not yet due) or Overdue.
export function paymentState(order) {
  if (order.paymentStatus !== "Unpaid") return "Paid";
  if (order.status === "Cancelled") return "Void";
  return order.scheduledFor && order.scheduledFor < todayKey() ? "Overdue" : "Unpaid";
}

// Orders saved before bookings existed have no payment fields — treat them as paid now.
function normalizeOrder(o) {
  return { scheduledFor: null, scheduledTime: "", paymentOption: "now", paymentStatus: "Paid", ...o };
}

export function makeOrderNumber() {
  return `VGS-${Date.now().toString().slice(-6)}`;
}

// Deterministic pseudo-random generator so sample data is stable between reloads.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const SAMPLE_NAMES = ["Aisha Bello", "Chinedu Okafor", "Fatima Yusuf", "Tunde Adeyemi", "Ngozi Eze", "Ibrahim Musa", "Kemi Balogun", "Emeka Nwosu", "Zainab Abdullahi", "Segun Ojo", "Amaka Obi", "Yusuf Garba"];
const SAMPLE_CITIES = ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Kaduna", "Enugu"];
const SAMPLE_STATUSES = ["Delivered", "Delivered", "Delivered", "Dispatched", "Processing", "Pending", "Cancelled"];

function buildSampleOrders() {
  const rand = seeded(42);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const now = Date.now();
  const orders = [];

  for (let n = 0; n < 64; n++) {
    const daysAgo = Math.floor(rand() * 45);
    const createdAt = new Date(now - daysAgo * 86400000 - Math.floor(rand() * 86400000)).toISOString();
    const lineCount = 1 + Math.floor(rand() * 3);
    const items = [];
    for (let l = 0; l < lineCount; l++) {
      const p = pick(allProducts);
      if (items.some((i) => i.id === p.id)) continue;
      items.push({ id: p.id, name: p.name, price: p.price, quantity: 1 + Math.floor(rand() * 3) });
    }
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const extra = rand() < 0.3 ? 5 : 0;
    const name = pick(SAMPLE_NAMES);
    const fulfillmentMethod = rand() < 0.72 ? "Delivery" : "Pickup";
    const paidMethod = rand() < 0.65 ? "Card" : "Bank Transfer";

    // Pickups always have a date; roughly 40% of deliveries are booked for a date.
    const booked = fulfillmentMethod === "Pickup" || rand() < 0.4;
    const scheduledFor = booked ? toDateKey(new Date(Date.parse(createdAt) + (2 + Math.floor(rand() * 20)) * 86400000)) : null;
    const upcoming = scheduledFor && scheduledFor >= todayKey();
    const paymentOption = booked && rand() < 0.45 ? "later" : "now";
    // Past pay-later bookings were mostly settled; a few are left overdue.
    const paid = paymentOption === "now" || (!upcoming && rand() < 0.75);

    let status;
    if (upcoming) status = pick(["Pending", "Pending", "Processing"]);
    else if (!paid) status = "Pending";
    else status = daysAgo < 3 ? pick(["Pending", "Processing"]) : pick(SAMPLE_STATUSES);

    orders.push({
      orderNumber: `VGS-${String(100000 + n * 137).slice(-6)}`,
      createdAt,
      customer: {
        name,
        email: `${name.split(" ")[0].toLowerCase()}@example.com`,
        phone: "",
        city: fulfillmentMethod === "Pickup" ? "" : pick(SAMPLE_CITIES),
      },
      items,
      subtotal,
      total: subtotal + extra,
      fulfillmentMethod,
      scheduledFor,
      scheduledTime: fulfillmentMethod === "Pickup" ? pick(["10:00", "12:00", "14:00", "16:00"]) : "",
      paymentOption,
      paymentMethod: paid ? paidMethod : "Pay later",
      paymentStatus: paid ? "Paid" : "Unpaid",
      status,
      sample: true,
    });
  }
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function buildSampleEnquiries() {
  const now = Date.now();
  return [
    { companyName: "Zenith Partners", contactName: "Bola Martins", email: "bola@example.com", phone: "", quantity: 120, budget: "₦12,000", occasion: "Client Appreciation", tier: "Premium", status: "Quoted", daysAgo: 2 },
    { companyName: "Greenfield Tech", contactName: "Hauwa Sani", email: "hauwa@example.com", phone: "", quantity: 45, budget: "₦4,500", occasion: "Staff Gifts", tier: "Standard", status: "New", daysAgo: 1 },
    { companyName: "Atlas Logistics", contactName: "David Okon", email: "david@example.com", phone: "", quantity: 300, budget: "₦35,000", occasion: "Eid / Ramadan", tier: "Luxury", status: "Contacted", daysAgo: 6 },
    { companyName: "Bloom Agency", contactName: "Tolu Ade", email: "tolu@example.com", phone: "", quantity: 25, budget: "₦2,400", occasion: "Product Launch", tier: "Premium", status: "Won", daysAgo: 14 },
  ].map(({ daysAgo, ...e }, i) => ({
    ...e,
    id: `ENQ-S${i + 1}`,
    requirements: "",
    createdAt: new Date(now - daysAgo * 86400000).toISOString(),
    sample: true,
  }));
}

export const useAdminStore = defineStore("admin", {
  state: () => {
    let orders = read(ORDERS_KEY);
    if (!orders) {
      orders = buildSampleOrders();
    } else if (read(SAMPLE_VERSION_KEY) !== SAMPLE_VERSION && orders.some((o) => o.sample)) {
      orders = [...orders.filter((o) => !o.sample), ...buildSampleOrders()];
    }
    write(SAMPLE_VERSION_KEY, SAMPLE_VERSION);
    return {
      orders: orders.map(normalizeOrder),
      enquiries: read(ENQUIRIES_KEY) ?? buildSampleEnquiries(),
    };
  },

  getters: {
    hasSampleData: (state) => state.orders.some((o) => o.sample) || state.enquiries.some((e) => e.sample),
  },

  actions: {
    persist() {
      write(ORDERS_KEY, this.orders);
      write(ENQUIRIES_KEY, this.enquiries);
    },
    recordOrder(order) {
      this.orders.unshift(normalizeOrder({ ...order, status: "Pending", createdAt: new Date().toISOString() }));
      this.persist();
    },
    markPaid(orderNumber, method) {
      const order = this.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) return;
      order.paymentStatus = "Paid";
      order.paymentMethod = method;
      order.paidAt = new Date().toISOString();
      this.persist();
    },
    markUnpaid(orderNumber) {
      const order = this.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) return;
      order.paymentStatus = "Unpaid";
      order.paymentMethod = "Pay later";
      delete order.paidAt;
      this.persist();
    },
    recordEnquiry(enquiry) {
      this.enquiries.unshift({
        ...enquiry,
        id: `ENQ-${Date.now().toString().slice(-6)}`,
        status: "New",
        createdAt: new Date().toISOString(),
      });
      this.persist();
    },
    setOrderStatus(orderNumber, status) {
      const order = this.orders.find((o) => o.orderNumber === orderNumber);
      if (order) order.status = status;
      this.persist();
    },
    setEnquiryStatus(id, status) {
      const enquiry = this.enquiries.find((e) => e.id === id);
      if (enquiry) enquiry.status = status;
      this.persist();
    },
    clearSampleData() {
      this.orders = this.orders.filter((o) => !o.sample);
      this.enquiries = this.enquiries.filter((e) => !e.sample);
      this.persist();
    },
    restoreSampleData() {
      this.orders = [...this.orders.filter((o) => !o.sample), ...buildSampleOrders()];
      this.enquiries = [...this.enquiries.filter((e) => !e.sample), ...buildSampleEnquiries()];
      this.persist();
    },
  },
});
