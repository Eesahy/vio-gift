import { defineStore } from "pinia";

// Must match GIFT_EXTRAS in functions/index.js, which is what customers are actually charged.
export const GIFT_EXTRAS = { bag: 5, wrap: 3 };

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
    // "YYYY-MM-DD" chosen via "Book a Gift for Later"; prefills the checkout date.
    bookingDate: sessionStorage.getItem("bookingDate") || "",
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
        const { id, name, price, image, description } = product;
        this.items.push({ id, name, price, image, description, quantity: qty });
      }
      this.persist();
    },
    refreshPrices(priceOf) {
      let changed = false;
      this.items.forEach((i) => {
        const price = priceOf(i);
        if (price !== i.price) {
          i.price = price;
          changed = true;
        }
      });
      if (changed) this.persist();
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
    setBookingDate(date) {
      this.bookingDate = date || "";
      if (date) sessionStorage.setItem("bookingDate", date);
      else sessionStorage.removeItem("bookingDate");
    },
    clearAfterOrder() {
      this.items = [];
      this.cartTotal = 0;
      this.giftingOptions = null;
      this.orderNote = "";
      ["cart", "cartTotal", "giftingOptions", "orderNote"].forEach((k) => sessionStorage.removeItem(k));
      this.setBookingDate("");
    },
  },
});
