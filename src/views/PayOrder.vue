<template>
  <div class="min-h-screen bg-white">
    <SimpleHeader back-to="/" back-label="Home">
      <template #right>
        <v-icon icon="mdi-lock-outline" size="16" style="color: var(--vio-purple)" />
        <span class="text-caption" style="color: var(--vio-purple)">Secure Payment</span>
      </template>
    </SimpleHeader>

    <v-container class="py-16" style="max-width: 560px">
      <div v-if="loading" class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="48" />
      </div>

      <div v-else-if="loadError" class="text-center py-16">
        <v-icon icon="mdi-alert-circle-outline" size="48" color="error" class="mb-4" />
        <p class="mb-6" style="color: var(--vio-purple-dark)">{{ loadError }}</p>
        <router-link to="/" class="pill-btn">Back to Home</router-link>
      </div>

      <v-card v-else-if="order" rounded="xl" class="pa-8" flat style="border: 1px solid rgba(46,27,48,0.15)">
        <p class="text-caption text-uppercase mb-1" style="color: var(--vio-text-muted)">Order {{ order.orderNumber }}</p>
        <h2 class="font-display mb-2" style="color: var(--vio-purple); font-size: 1.8rem">Pay for your gift</h2>
        <p v-if="order.scheduledFor" class="text-body-2 mb-6" style="color: var(--vio-purple-dark)">
          {{ order.fulfillmentMethod }} booked for <strong>{{ formatDateKey(order.scheduledFor, { weekday: "long", day: "numeric", month: "long" }) }}</strong>
        </p>

        <div class="d-flex flex-column ga-2 mb-6">
          <div v-for="item in order.items" :key="item.id" class="d-flex justify-space-between text-body-2">
            <span style="color: var(--vio-purple-dark)">{{ item.quantity }} x {{ item.name }}</span>
            <span style="color: var(--vio-purple)">₦{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div v-if="order.giftExtra" class="d-flex justify-space-between text-body-2">
            <span style="color: var(--vio-purple-dark)">Gift {{ order.giftOption === "bag" ? "bag" : "wrap" }}</span>
            <span style="color: var(--vio-purple)">₦{{ order.giftExtra.toFixed(2) }}</span>
          </div>
          <div class="d-flex justify-space-between pt-3" style="border-top: 1px solid rgba(46,27,48,0.15)">
            <span class="font-display" style="color: var(--vio-purple)">Total</span>
            <span class="font-display" style="color: var(--vio-purple); font-size: 1.4rem">₦{{ order.total.toFixed(2) }}</span>
          </div>
        </div>

        <v-alert v-if="payError" type="warning" variant="tonal" density="compact" class="mb-4">{{ payError }}</v-alert>

        <v-btn block size="x-large" color="primary" rounded="lg" class="text-none" prepend-icon="mdi-lock-outline" :loading="paying" @click="pay">
          Pay ₦{{ order.total.toFixed(2) }} with Paystack
        </v-btn>
        <p class="text-caption text-center mt-4 mb-0" style="color: var(--vio-text-muted)">
          Card, bank transfer or USSD. Your details go straight to Paystack and never touch our site.
        </p>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { httpsCallable } from "firebase/functions";
import SimpleHeader from "@/components/SimpleHeader.vue";
import { functions } from "@/firebase";
import { formatDateKey } from "@/store/admin";
import { payWithPaystack, friendlyError } from "@/lib/paystack";

const route = useRoute();
const router = useRouter();
const orderNumber = String(route.params.orderNumber || "");
const token = String(route.query.t || "");

const order = ref(null);
const loading = ref(true);
const loadError = ref("");
const paying = ref(false);
const payError = ref("");

const confirmation = () => router.replace({ path: "/order-complete", query: { order: orderNumber, t: token } });

onMounted(async () => {
  try {
    const { data } = await httpsCallable(functions, "getOrder")({ orderNumber, token });
    if (data.paymentStatus === "Paid") return confirmation();
    if (data.status === "Cancelled") {
      loadError.value = "This order has been cancelled. Please place a new order or contact us on WhatsApp.";
      return;
    }
    order.value = data;
  } catch (err) {
    loadError.value = friendlyError(err);
  } finally {
    loading.value = false;
  }
});

async function pay() {
  paying.value = true;
  payError.value = "";
  try {
    const { data } = await httpsCallable(functions, "startPayment")({ orderNumber, token });
    if (data.alreadyPaid) return confirmation();
    paying.value = false;
    await payWithPaystack(data.accessCode);
    confirmation();
  } catch (err) {
    payError.value = err.cancelled ? "Payment wasn't completed. You can try again any time before your gift date." : friendlyError(err);
  } finally {
    paying.value = false;
  }
}
</script>

<style scoped>
.pill-btn {
  display: inline-flex; align-items: center; padding: 12px 32px; border-radius: 16px;
  background-color: var(--vio-purple); color: var(--vio-cream);
}
</style>
