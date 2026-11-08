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
      <div v-if="loading" class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
        <p style="color: var(--vio-purple-dark)">{{ checkingPayment ? "Confirming your payment with Paystack…" : "Loading your order…" }}</p>
      </div>

      <div v-else-if="loadError" class="text-center py-16">
        <v-icon icon="mdi-alert-circle-outline" size="48" color="error" class="mb-4" />
        <p class="mb-6" style="color: var(--vio-purple-dark)">{{ loadError }}</p>
        <router-link to="/" class="continue-btn">Back to Home</router-link>
      </div>

      <template v-else-if="order">
        <div class="text-center mb-12 vio-fade-in">
          <div class="success-circle mx-auto mb-6" :class="{ waiting: awaiting }">
            <v-icon :icon="awaiting ? 'mdi-timer-sand' : 'mdi-check-circle-outline'" size="48" color="white" />
          </div>
          <div class="d-flex align-center justify-center ga-2 mb-3">
            <v-icon icon="mdi-creation" size="20" color="secondary" />
            <span class="text-caption text-uppercase" style="letter-spacing: 0.15em; color: var(--vio-gold)">{{ headline }}</span>
            <v-icon icon="mdi-creation" size="20" color="secondary" />
          </div>
          <h2 class="font-display mb-3" style="color: var(--vio-purple); font-size: 2.5rem">{{ awaiting ? "Almost there" : "Thank You!" }}</h2>
          <p style="color: var(--vio-purple-dark); font-size: 1.1rem">
            <template v-if="awaiting">We haven't received confirmation from Paystack yet. If you completed payment, this page will update shortly.</template>
            <template v-else-if="order.scheduledFor">Your gift is booked for <strong style="color: var(--vio-purple)">{{ formatDateKey(order.scheduledFor, { weekday: "long", day: "numeric", month: "long" }) }}</strong>.</template>
            <template v-else>Your gift is on its way to becoming a beautiful memory.</template>
          </p>
          <div v-if="awaiting" class="d-flex justify-center ga-3 mt-4">
            <v-btn variant="outlined" color="primary" rounded="lg" class="text-none" :loading="checkingPayment" @click="load(true)">Check again</v-btn>
            <v-btn color="primary" rounded="lg" class="text-none" :to="`/pay/${order.orderNumber}?t=${token}`">Pay now</v-btn>
          </div>
        </div>

        <v-card rounded="xl" class="overflow-hidden elevation-2">
          <div class="pa-6" style="background-color: var(--vio-purple)">
            <div class="d-flex justify-space-between align-start">
              <div>
                <h3 class="font-display" style="color: #faf7f0; font-size: 1.5rem">Order Invoice</h3>
                <p class="text-body-2 mt-1" style="color: rgba(250,247,240,0.8)">{{ placedOn }}</p>
              </div>
              <div class="text-right">
                <p class="text-caption text-uppercase mb-1" style="color: rgba(250,247,240,0.7)">Order Number</p>
                <p class="font-display" style="color: var(--vio-gold)">{{ order.orderNumber }}</p>
              </div>
            </div>
          </div>

          <div class="pa-6" style="background-color: #fff">
            <v-row>
              <v-col cols="12" sm="6">
                <p class="text-caption text-uppercase mb-2" style="color: var(--vio-text-muted)">Customer Details</p>
                <p class="font-display mb-0" style="color: var(--vio-purple)">{{ order.customer.name }}</p>
                <p class="text-body-2" style="color: var(--vio-purple-dark)">{{ order.customer.email }}</p>
                <p class="text-body-2" style="color: var(--vio-purple-dark)">{{ order.customer.phone }}</p>
              </v-col>
              <v-col cols="12" sm="6">
                <p class="text-caption text-uppercase mb-2" style="color: var(--vio-text-muted)">
                  {{ isPickup ? "Pickup Details" : "Delivery Address" }}
                </p>
                <template v-if="isPickup">
                  <p class="text-body-2" style="color: var(--vio-purple-dark)">Date: <strong style="color: var(--vio-purple)">{{ formatDateKey(order.scheduledFor) }}</strong></p>
                  <p class="text-body-2" style="color: var(--vio-purple-dark)">Time: <strong style="color: var(--vio-purple)">{{ order.scheduledTime }}</strong></p>
                  <p class="text-body-2" style="color: var(--vio-purple-dark)">VioGiftStore Collection Point</p>
                </template>
                <template v-else>
                  <p class="text-body-2" style="color: var(--vio-purple-dark)">{{ order.customer.address }}</p>
                  <p class="text-body-2" style="color: var(--vio-purple-dark)">{{ order.customer.city }}{{ order.customer.state ? `, ${order.customer.state}` : "" }}</p>
                  <p v-if="order.scheduledFor" class="text-body-2" style="color: var(--vio-purple-dark)">Delivery date: <strong style="color: var(--vio-purple)">{{ formatDateKey(order.scheduledFor) }}</strong></p>
                </template>
              </v-col>
            </v-row>

            <v-divider class="my-6" />

            <p class="text-caption text-uppercase mb-3" style="color: var(--vio-text-muted)">
              Items Ordered ({{ itemCount }} {{ itemCount === 1 ? "item" : "items" }})
            </p>
            <div class="rounded-lg overflow-hidden" style="border: 1px solid rgba(46,27,48,0.12)">
              <div v-for="(item, index) in order.items" :key="item.id" class="px-5 py-3" :style="{ backgroundColor: index % 2 === 0 ? 'var(--vio-cream)' : '#fff' }">
                <div class="d-flex justify-space-between text-body-2" style="color: var(--vio-purple)">
                  <span>{{ item.quantity }} x {{ item.name }}</span>
                  <span class="font-display">₦{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="d-flex flex-column ga-2 mt-6">
              <div class="d-flex justify-space-between text-body-2">
                <span style="color: var(--vio-purple-dark)">Subtotal</span>
                <span style="color: var(--vio-purple)">₦{{ order.subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="order.giftExtra" class="d-flex justify-space-between text-body-2">
                <span style="color: var(--vio-purple-dark)">Gift {{ order.giftOption === "bag" ? "bag" : "wrap" }}</span>
                <span style="color: var(--vio-purple)">₦{{ order.giftExtra.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-space-between text-body-2">
                <span style="color: var(--vio-purple-dark)">{{ order.fulfillmentMethod }}</span>
                <span style="color: var(--vio-success)">{{ isPickup ? "Free" : "We'll confirm the fee" }}</span>
              </div>
              <div class="d-flex justify-space-between pt-3" style="border-top: 1px solid rgba(46,27,48,0.15)">
                <span class="font-display" style="color: var(--vio-purple); font-size: 1.2rem">{{ totalLabel }}</span>
                <span class="font-display" style="color: var(--vio-purple); font-size: 1.5rem">₦{{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="pa-6 d-flex align-center ga-3" style="background-color: var(--vio-cream)">
            <v-icon icon="mdi-email-outline" size="20" color="primary" />
            <p class="text-body-2 ma-0" style="color: var(--vio-purple-dark)">
              <template v-if="payLater">A confirmation email with your secure payment link has been sent to</template>
              <template v-else-if="awaiting">We'll email a confirmation once payment is received to</template>
              <template v-else>A confirmation email with your invoice has been sent to</template>
              <strong style="color: var(--vio-purple)">{{ order.customer.email }}</strong>.
            </p>
          </div>
        </v-card>

        <div class="d-flex flex-column flex-sm-row justify-center ga-4 mt-10 no-print">
          <v-btn variant="outlined" color="primary" rounded="lg" size="large" prepend-icon="mdi-download-outline" @click="printInvoice">
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
      </template>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase";
import { useCartStore } from "@/store/cart";
import { formatDateKey } from "@/store/admin";
import { friendlyError } from "@/lib/paystack";

const route = useRoute();
const cart = useCartStore();

const orderNumber = String(route.query.order || "");
const token = String(route.query.t || "");
const order = ref(null);
const loading = ref(true);
const checkingPayment = ref(false);
const loadError = ref("");
let retryTimer = null;
let retries = 0;

const isPickup = computed(() => order.value?.fulfillmentMethod === "Pickup");
const payLater = computed(() => order.value?.paymentOption === "later" && order.value?.paymentStatus === "Unpaid");
const awaiting = computed(() => order.value?.paymentStatus === "Awaiting");
const itemCount = computed(() => (order.value?.items || []).reduce((s, i) => s + i.quantity, 0));
const headline = computed(() => (awaiting.value ? "Payment pending" : payLater.value ? "Booking Confirmed" : "Order Confirmed"));
const totalLabel = computed(() => {
  if (payLater.value) return `Amount Due by ${formatDateKey(order.value.scheduledFor, { day: "numeric", month: "short" })}`;
  return order.value?.paymentStatus === "Paid" ? "Total Paid" : "Total";
});
const placedOn = computed(() =>
  new Date(order.value?.createdAt || Date.now()).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
);

async function load(verify = false) {
  checkingPayment.value = verify;
  try {
    const { data } = await httpsCallable(functions, "getOrder")({ orderNumber, token, verify });
    order.value = data;
    loadError.value = "";
    if (data.paymentStatus !== "Awaiting") cart.clearAfterOrder();
  } catch (err) {
    if (!order.value) loadError.value = friendlyError(err);
  } finally {
    loading.value = false;
    checkingPayment.value = false;
  }
  // Paystack's confirmation can lag a few seconds behind the popup closing.
  if (awaiting.value && retries < 5) {
    retries++;
    retryTimer = setTimeout(() => load(true), 3000);
  }
}

function printInvoice() {
  window.print();
}

onMounted(() => {
  if (!orderNumber || !token) {
    loading.value = false;
    loadError.value = "We couldn't find that order. Check the link in your confirmation email.";
    return;
  }
  load(true);
});
onUnmounted(() => clearTimeout(retryTimer));
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
.success-circle.waiting { background-color: var(--vio-gold); }
.continue-btn {
  display: inline-flex; align-items: center; justify-content: center; padding: 12px 28px;
  border-radius: 12px; background-color: var(--vio-purple); color: var(--vio-cream); font-size: 0.9rem;
}
.back-home-link {
  display: inline-flex; align-items: center; gap: 4px; color: var(--vio-gold); font-size: 0.9rem;
}
</style>
