import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

const routes = [
  { path: "/", name: "landing", component: () => import("@/views/Landing.vue") },
  { path: "/products/:theme", name: "products", component: () => import("@/views/Products.vue"), props: true },
  { path: "/product/:id", name: "product-detail", component: () => import("@/views/ProductDetail.vue"), props: true },
  { path: "/cart", name: "cart", component: () => import("@/views/Cart.vue") },
  { path: "/checkout", name: "checkout", component: () => import("@/views/Checkout.vue") },
  { path: "/order-complete", name: "order-complete", component: () => import("@/views/OrderComplete.vue") },
  { path: "/pay/:orderNumber", name: "pay-order", component: () => import("@/views/PayOrder.vue") },
  { path: "/corporate", name: "corporate", component: () => import("@/views/Corporate.vue") },
  { path: "/catalogue", name: "catalogue", component: () => import("@/views/Catalogue.vue") },
  { path: "/price-list", name: "price-list", component: () => import("@/views/PriceList.vue") },
  { path: "/design-hub", name: "design-hub", component: () => import("@/views/DesignHub.vue") },
  { path: "/admin", name: "admin", component: () => import("@/views/AdminDashboard.vue"), meta: { requiresAdmin: true } },
  { path: "/admin/login", name: "admin-login", component: () => import("@/views/AdminLogin.vue") },
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("@/views/NotFound.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Back/forward restores where the user was.
    if (savedPosition) return savedPosition;
    // In-page anchors like /#themes scroll to that section, clearing the sticky header.
    if (to.hash) return { el: to.hash, top: 88, behavior: "smooth" };
    return { top: 0 };
  },
});

// Convenience only: the real protection is the admin check in firestore.rules and storage.rules.
router.beforeEach(async (to) => {
  if (!to.meta.requiresAdmin && to.name !== "admin-login") return true;
  const auth = useAuthStore();
  await auth.init();
  if (to.meta.requiresAdmin && !auth.isAdmin) return { name: "admin-login", query: { redirect: to.fullPath } };
  if (to.name === "admin-login" && auth.isAdmin) return { name: "admin" };
  return true;
});

export default router;
