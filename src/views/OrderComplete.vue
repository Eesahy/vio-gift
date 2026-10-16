<template>
  <div class="min-h-screen bg-white">
    <header class="py-5" style="border-bottom: 1px solid rgba(46,27,48,0.15)">
      <v-container class="d-flex">
        <router-link to="/" aria-label="VioGiftStore — home">
          <span class="logo-badge">
            <img src="/logo.jpg" alt="VioGiftStore" />
          </span>
        </router-link>
      </v-container>
    </header>

    <v-container class="py-16" style="max-width: 780px">
      <div class="text-center mb-12 vio-fade-in">
        <div class="success-circle mx-auto mb-6">
          <v-icon icon="mdi-check-circle-outline" size="48" color="white" />
        </div>
        <div class="d-flex align-center justify-center ga-2 mb-3">
          <v-icon icon="mdi-creation" size="20" color="secondary" />
          <span class="text-caption text-uppercase" style="letter-spacing: 0.15em; color: var(--vio-gold)">Order Confirmed</span>
          <v-icon icon="mdi-creation" size="20" color="secondary" />
        </div>
        <h2 class="font-display mb-3" style="color: var(--vio-purple); font-size: 2.5rem">Thank You!</h2>
        <p style="color: var(--vio-purple-dark); font-size: 1.1rem">
          Your gift is on its way to becoming a beautiful memory.
        </p>
      </div>

      <v-card rounded="xl" class="overflow-hidden elevation-2">
        <div class="pa-6" style="background-color: var(--vio-purple)">
          <div class="d-flex justify-space-between align-start">
            <div>
              <h3 class="font-display" style="color: #faf7f0; font-size: 1.5rem">Order Invoice</h3>
              <p class="text-body-2 mt-1" style="color: rgba(250,247,240,0.8)">{{ today }}</p>
            </div>
            <div class="text-right">
              <p class="text-caption text-uppercase mb-1" style="color: rgba(250,247,240,0.7)">Order Number</p>
              <p class="font-display" style="color: var(--vio-gold)">{{ orderNumber }}</p>
            </div>
          </div>
        </div>

        <div class="pa-6" style="background-color: #fff">
          <v-row v-if="order">
            <v-col cols="12" sm="6">
              <p class="text-caption text-uppercase mb-2" style="color: var(--vio-text-muted)">Customer Details</p>
              <p class="font-display mb-0" style="color: var(--vio-purple)">{{ order.fullName }}</p>
              <p class="text-body-2" style="color: var(--vio-purple-dark)">{{ order.email }}</p>
              <p class="text-body-2" style="color: var(--vio-purple-dark)">{{ order.phone }}</p>
            </v-col>
            <v-col cols="12" sm="6">
              <p class="text-caption text-uppercase mb-2" style="color: var(--vio-text-muted)">
                {{ order.tab === "pickup" ? "Pickup Details" : "Delivery Address" }}
              </p>
              <template v-if="order.tab === 'pickup'">
                <p class="text-body-2" style="color: var(--vio-purple-dark)">Date: <strong style="color: var(--vio-purple)">{{ order.pickupDate }}</strong></p>
                <p class="text-body-2" style="color: var(--vio-purple-dark)">Time: <strong style="color: var(--vio-purple)">{{ order.pickupTime }}</strong></p>
                <p class="text-body-2" style="color: var(--vio-purple-dark)">VioGiftStore Collection Point</p>
              </template>
              <template v-else>
                <p class="text-body-2" style="color: var(--vio-purple-dark)">{{ order.address }}</p>
                <p class="text-body-2" style="color: var(--vio-purple-dark)">{{ order.city }}{{ order.postcode ? `, ${order.postcode}` : "" }}</p>
              </template>
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <p class="text-caption text-uppercase mb-3" style="color: var(--vio-text-muted)">
            Items Ordered ({{ order?.itemCount || 0 }} {{ order?.itemCount === 1 ? "item" : "items" }})
          </p>
          <div class="rounded-lg overflow-hidden" style="border: 1px solid rgba(46,27,48,0.12)">
            <div v-for="(item, index) in order?.items || []" :key="item.id" class="px-5 py-3" :style="{ backgroundColor: index % 2 === 0 ? 'var(--vio-cream)' : '#fff' }">
              <div class="d-flex justify-space-between text-body-2" style="color: var(--vio-purple)">
                <span>{{ item.quantity }} x {{ item.name }}</span>
                <span class="font-display">₦{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column ga-2 mt-6">
            <div class="d-flex justify-space-between text-body-2">
              <span style="color: var(--vio-purple-dark)">Subtotal</span>
              <span style="color: var(--vio-purple)">₦{{ order?.subtotal?.toFixed(2) || cartTotal.toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-space-between text-body-2">
              <span style="color: var(--vio-purple-dark)">{{ order?.fulfillmentMethod || "Delivery" }}</span>
              <span style="color: var(--vio-success)">Included</span>
            </div>
            <div class="d-flex justify-space-between pt-3" style="border-top: 1px solid rgba(46,27,48,0.15)">
              <span class="font-display" style="color: var(--vio-purple); font-size: 1.2rem">Total Paid</span>
              <span class="font-display" style="color: var(--vio-purple); font-size: 1.5rem">₦{{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="pa-6 d-flex align-center ga-3" style="background-color: var(--vio-cream)">
          <v-icon icon="mdi-email-outline" size="20" color="primary" />
          <p class="text-body-2 ma-0" style="color: var(--vio-purple-dark)">
            A confirmation email with your invoice has been sent to
            <strong style="color: var(--vio-purple)">{{ order?.email || "your email" }}</strong>.
          </p>
        </div>
      </v-card>

      <div class="d-flex flex-column flex-sm-row justify-center ga-4 mt-10 no-print">
        <v-btn variant="outlined" color="primary" rounded="lg" size="large" prepend-icon="mdi-download-outline" @click="window.print()">
          Download Invoice
        </v-btn>
        <router-link to="/catalogue" class="continue-btn">
          <v-icon icon="mdi-package-variant-closed" size="18" class="mr-2" />
          Continue Shopping
        </router-link>
      </div>

      <div class="text-center mt-8">
        <router-link to="/" class="back-home-link">
          Back to Home <v-icon icon="mdi-arrow-right" size="16" />
        </router-link>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "@/store/cart";

const cart = useCartStore();
const order = ref(cart.orderDetails);
const cartTotal = ref(cart.cartTotal);
const orderNumber = order.value?.orderNumber || `VGS-${Date.now().toString().slice(-6)}`;

const today = new Date().toLocaleDateString("en-GB", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

onMounted(() => {
  cart.clearAfterOrder();
});
</script>

<style scoped>
.logo-badge {
  display: flex; align-items: center; justify-content: center;
  width: 52px; height: 52px; border-radius: 999px; background: #fff;
  box-shadow: 0 2px 10px rgba(46, 27, 48, 0.18); overflow: hidden;
}
.logo-badge img { width: 84%; height: 84%; object-fit: contain; }
.success-circle {
  width: 96px; height: 96px; border-radius: 999px; display: flex; align-items: center; justify-content: center;
  background-color: var(--vio-purple); box-shadow: 0 8px 24px rgba(46,27,48,0.4);
}
.continue-btn {
  display: inline-flex; align-items: center; justify-content: center; padding: 12px 28px;
  border-radius: 12px; background-color: var(--vio-purple); color: var(--vio-cream); font-size: 0.9rem;
}
.back-home-link {
  display: inline-flex; align-items: center; gap: 4px; color: var(--vio-gold); font-size: 0.9rem;
}
</style>
