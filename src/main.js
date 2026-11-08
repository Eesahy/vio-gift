import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { useProductsStore } from "./store/products";
import { useAuthStore } from "./store/auth";
import "./assets/styles/theme.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

useProductsStore().subscribe();
useAuthStore().init();

app.mount("#app");
