import { defineStore } from "pinia";

function readCart() {
  try {
    return JSON.parse(sessionStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: readCart(),
    orderNote: sessionStorage.getItem("orderNote") || "",
    cartTotal: Number(sessionStorage.getItem("cartTotal") || 0),
    giftingOptions: JSON.parse(sessionStorage.getItem("giftingOptions") || "null"),
    orderDetails: JSON.parse(sessionStorage.getItem("orderDetails") || "null"),
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  },

  actions: {
    persist() {
      sessionStorage.setItem("cart", JSON.stringify(this.items));
    },
    reload() {
      this.items = readCart();
    },
    addToCart(product, qty = 1) {
      const existing = this.items.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        this.items.push({ ...product, quantity: qty });
      }
      this.persist();
    },
    updateQty(id, delta) {
      this.items = this.items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);
      this.persist();
    },
    removeItem(id) {
      this.items = this.items.filter((i) => i.id !== id);
      this.persist();
    },
    setOrderNote(note) {
      this.orderNote = note;
      sessionStorage.setItem("orderNote", note);
    },
    saveGiftingOptions(options) {
      this.giftingOptions = options;
      sessionStorage.setItem("giftingOptions", JSON.stringify(options));
    },
    setCartTotal(total) {
      this.cartTotal = total;
      sessionStorage.setItem("cartTotal", String(total));
    },
    setOrderDetails(details) {
      this.orderDetails = details;
      sessionStorage.setItem("orderDetails", JSON.stringify(details));
    },
    clearAfterOrder() {
      this.items = [];
      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("cartTotal");
    },
  },
});
