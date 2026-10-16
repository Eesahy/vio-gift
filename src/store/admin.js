import { defineStore } from "pinia";
import { allProducts } from "@/data/products";

// There is no backend yet, so the admin store persists orders and corporate
// enquiries in localStorage. When an API exists, swap read/write for fetch calls.
const ORDERS_KEY = "vio-admin-orders";
const ENQUIRIES_KEY = "vio-admin-enquiries";

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
    const recent = daysAgo < 3;
    orders.push({
      orderNumber: `VGS-${String(100000 + n * 137).slice(-6)}`,
      createdAt,
      customer: {
        name,
        email: `${name.split(" ")[0].toLowerCase()}@example.com`,
        phone: "",
        city: pick(SAMPLE_CITIES),
      },
      items,
      subtotal,
      total: subtotal + extra,
      fulfillmentMethod: rand() < 0.72 ? "Delivery" : "Pickup",
      paymentMethod: rand() < 0.65 ? "Card" : "Bank Transfer",
      status: recent ? pick(["Pending", "Processing"]) : pick(SAMPLE_STATUSES),
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
  state: () => ({
    orders: read(ORDERS_KEY) ?? buildSampleOrders(),
    enquiries: read(ENQUIRIES_KEY) ?? buildSampleEnquiries(),
  }),

  getters: {
    hasSampleData: (state) => state.orders.some((o) => o.sample) || state.enquiries.some((e) => e.sample),
  },

  actions: {
    persist() {
      write(ORDERS_KEY, this.orders);
      write(ENQUIRIES_KEY, this.enquiries);
    },
    recordOrder(order) {
      this.orders.unshift({ ...order, status: "Pending", createdAt: new Date().toISOString() });
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
