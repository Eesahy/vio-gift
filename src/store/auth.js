import { defineStore } from "pinia";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { useProductsStore } from "@/store/products";

let ready = null;

async function readAdminClaim(user, forceRefresh = false) {
  if (!user) return false;
  const token = await user.getIdTokenResult(forceRefresh);
  return token.claims.admin === true;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAdmin: false,
    initialized: false,
  }),

  actions: {
    // Resolves once Firebase has restored any saved session.
    init() {
      if (ready) return ready;
      ready = new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          this.user = user ? { uid: user.uid, email: user.email } : null;
          this.isAdmin = await readAdminClaim(user);
          // Admins see hidden products too; everyone else only gets the public catalogue.
          useProductsStore().subscribe({ includeHidden: this.isAdmin });
          this.initialized = true;
          resolve();
        });
      });
      return ready;
    },

    async signIn(email, password) {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = await readAdminClaim(user, true);
      if (!isAdmin) {
        await signOut(auth);
        throw new Error("This account does not have admin access.");
      }
      this.user = { uid: user.uid, email: user.email };
      this.isAdmin = true;
      useProductsStore().subscribe({ includeHidden: true });
    },

    async signOut() {
      await signOut(auth);
      this.user = null;
      this.isAdmin = false;
    },

    resetPassword(email) {
      return sendPasswordResetEmail(auth, email);
    },
  },
});
