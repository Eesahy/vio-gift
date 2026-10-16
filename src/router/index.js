import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "landing", component: () => import("@/views/Landing.vue") },
  { path: "/products/:theme", name: "products", component: () => import("@/views/Products.vue"), props: true },
  { path: "/product/:id", name: "product-detail", component: () => import("@/views/ProductDetail.vue"), props: true },
  { path: "/cart", name: "cart", component: () => import("@/views/Cart.vue") },
  { path: "/checkout", name: "checkout", component: () => import("@/views/Checkout.vue") },
  { path: "/order-complete", name: "order-complete", component: () => import("@/views/OrderComplete.vue") },
  { path: "/corporate", name: "corporate", component: () => import("@/views/Corporate.vue") },
  { path: "/catalogue", name: "catalogue", component: () => import("@/views/Catalogue.vue") },
  { path: "/price-list", name: "price-list", component: () => import("@/views/PriceList.vue") },
  { path: "/design-hub", name: "design-hub", component: () => import("@/views/DesignHub.vue") },
  { path: "/admin", name: "admin", component: () => import("@/views/AdminDashboard.vue") },
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("@/views/NotFound.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
