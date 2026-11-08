import { defineStore } from "pinia";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";

let unsubscribe = null;

export const PRODUCT_CATEGORIES = [
  { id: "health", label: "Health & Wellbeing" },
  { id: "events", label: "Events & Occasions" },
  { id: "corporate", label: "Corporate" },
  { id: "kids", label: "Kids" },
  { id: "edibles", label: "Edibles" },
  { id: "household", label: "Household" },
  { id: "garden", label: "Garden" },
];

export const useProductsStore = defineStore("products", {
  state: () => ({
    items: [],
    loaded: false,
    error: null,
    // True while subscribed to every product (admin), not just visible ones (shop).
    includeHidden: false,
  }),

  getters: {
    visible: (state) => state.items.filter((p) => p.visible !== false),
    byId: (state) => (id) => state.items.find((p) => p.id === id),
    byTheme: (state) => (theme) => state.items.filter((p) => p.visible !== false && p.theme === theme),
  },

  actions: {
    subscribe({ includeHidden = false } = {}) {
      if (unsubscribe && this.includeHidden === includeHidden) return;
      unsubscribe?.();
      this.includeHidden = includeHidden;
      const products = collection(db, "products");
      // Shop visitors can only query visible products; the security rules reject anything wider.
      const q = includeHidden ? products : query(products, where("visible", "==", true));
      unsubscribe = onSnapshot(
        q,
        (snap) => {
          this.items = snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999) || a.name.localeCompare(b.name));
          this.loaded = true;
          this.error = null;
        },
        (err) => {
          console.error("Products listener failed", err);
          this.error = err.message;
          this.loaded = true;
        }
      );
    },

    async save(id, data) {
      const payload = { ...data, updatedAt: serverTimestamp() };
      if (id) {
        await updateDoc(doc(db, "products", id), payload);
        return id;
      }
      const ref = doc(collection(db, "products"));
      await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      return ref.id;
    },

    async setVisible(id, visible) {
      await updateDoc(doc(db, "products", id), { visible, updatedAt: serverTimestamp() });
    },

    async setStock(id, stock) {
      await updateDoc(doc(db, "products", id), { stock, updatedAt: serverTimestamp() });
    },

    async remove(id) {
      await deleteDoc(doc(db, "products", id));
    },

    async uploadImage(file) {
      const safeName = file.name.replace(/[^a-z0-9.]+/gi, "-").toLowerCase();
      const ref = storageRef(storage, `products/${Date.now()}-${safeName}`);
      await uploadBytes(ref, file, { contentType: file.type });
      return getDownloadURL(ref);
    },
  },
});
