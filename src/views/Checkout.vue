<template>
  <div class="min-h-screen bg-white">
    <SimpleHeader back-to="/cart" back-label="Back to Cart">
      <template #right>
        <v-icon icon="mdi-lock-outline" size="16" style="color: var(--vio-purple)" />
        <span class="text-caption" style="color: var(--vio-purple)">Secure Checkout</span>
      </template>
    </SimpleHeader>

    <!-- Progress -->
    <div class="py-4" style="border-bottom: 1px solid rgba(46,27,48,0.1)">
      <v-container class="d-flex justify-center align-center ga-2">
        <div v-for="(step, i) in ['Cart', 'Checkout', 'Order Confirmed']" :key="step" class="d-flex align-center ga-2">
          <div class="step-circle" :style="{ backgroundColor: i <= 1 ? 'var(--vio-purple)' : 'rgba(185,156,194,0.4)', color: i <= 1 ? '#faf7f0' : 'var(--vio-purple)' }">
            <v-icon v-if="i < 1" icon="mdi-check" size="12" />
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="text-caption" :style="{ color: i <= 1 ? 'var(--vio-purple)' : 'var(--vio-text-muted)' }">{{ step }}</span>
          <div v-if="i < 2" style="width: 32px; height: 1px; background-color: rgba(46,27,48,0.25)" />
        </div>
      </v-container>
    </div>

    <v-container class="py-10" style="max-width: 1100px">
      <v-row>
        <!-- LEFT: Form -->
        <v-col cols="12" lg="8" class="d-flex flex-column ga-8">
          <div>
            <h3 class="font-display mb-4" style="color: var(--vio-purple)">Fulfilment Method</h3>
            <div class="tab-toggle">
              <button v-for="t in ['delivery', 'pickup']" :key="t" class="tab-btn" :class="{ active: tab === t }" @click="tab = t">
                {{ t === "delivery" ? "🚚 Delivery" : "🏪 Pickup" }}
              </button>
            </div>
          </div>

          <div v-if="tab === 'delivery'">
            <h3 class="font-display mb-1" style="color: var(--vio-purple)">When should it arrive?</h3>
            <p class="text-body-2 mb-4" style="color: var(--vio-text-muted)">Book your gift for a birthday, anniversary or any day that matters.</p>
            <div class="tab-toggle mb-4">
              <button class="tab-btn" :class="{ active: when === 'asap' }" @click="when = 'asap'">⚡ As soon as possible</button>
              <button class="tab-btn" :class="{ active: when === 'date' }" @click="when = 'date'">📅 Book a date</button>
            </div>
            <v-text-field
              v-if="when === 'date'"
              v-model="form.deliveryDate"
              type="date"
              :min="todayKey(1)"
              label="Delivery Date *"
              prepend-inner-icon="mdi-calendar-heart"
              :error-messages="errors.deliveryDate"
              :hint="form.deliveryDate ? `We'll deliver on ${formatDateKey(form.deliveryDate)}` : ''"
              persistent-hint
            />
          </div>

          <div>
            <h3 class="font-display mb-4" style="color: var(--vio-purple)">Contact Information</h3>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.fullName" label="Full Name *" placeholder="Your full name" prepend-inner-icon="mdi-account-outline" :error-messages="errors.fullName" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.email" type="email" label="Email *" placeholder="you@email.com" prepend-inner-icon="mdi-email-outline" :error-messages="errors.email" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="form.phone" type="tel" label="Phone *" placeholder="0803 123 4567" prepend-inner-icon="mdi-phone-outline" :error-messages="errors.phone" />
              </v-col>
            </v-row>
          </div>

          <div v-if="tab === 'delivery'">
            <h3 class="font-display mb-4" style="color: var(--vio-purple)">Delivery Address</h3>
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="form.address" label="Street Address *" placeholder="12 Admiralty Way" prepend-inner-icon="mdi-map-marker-outline" :error-messages="errors.address" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.city" label="City / Area *" placeholder="Lekki" :error-messages="errors.city" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete v-model="form.state" :items="NIGERIAN_STATES" label="State *" :error-messages="errors.state" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="form.landmark" label="Nearest Landmark" placeholder="e.g. Opposite the filling station" />
              </v-col>
            </v-row>
          </div>
          <div v-else>
            <h3 class="font-display mb-4" style="color: var(--vio-purple)">Select Pickup Time</h3>
            <div class="pa-4 rounded-lg mb-4" style="background-color: var(--vio-cream)">
              <p class="text-body-2 ma-0" style="color: var(--vio-purple-dark)">
                📍 <strong style="color: var(--vio-purple)">VioGiftStore</strong> — Collection available Mon–Sat, 9am–6pm
              </p>
            </div>
            <v-row dense>
              <v-col cols="6">
                <v-text-field v-model="form.pickupDate" type="date" :min="todayKey()" label="Pickup Date *" prepend-inner-icon="mdi-calendar-outline" :error-messages="errors.pickupDate" />
              </v-col>
              <v-col cols="6">
                <v-select v-model="form.pickupTime" :items="pickupTimes" label="Pickup Time *" prepend-inner-icon="mdi-clock-outline" :error-messages="errors.pickupTime" />
              </v-col>
            </v-row>
          </div>

          <div>
            <h3 class="font-display mb-4" style="color: var(--vio-purple)">Payment</h3>
            <div class="tab-toggle mb-2">
              <button class="tab-btn" :class="{ active: payOption === 'now' }" @click="payOption = 'now'">✅ Pay now</button>
              <button class="tab-btn" :class="{ active: payOption === 'later' }" :disabled="!bookedDate" @click="payOption = 'later'">🕒 Pay later</button>
            </div>
            <p v-if="!bookedDate" class="text-caption mb-6" style="color: var(--vio-text-muted)">
              Pay later is available when you book a {{ tab === "pickup" ? "pickup" : "delivery" }} date.
            </p>
            <div v-else class="mb-6" />

            <div v-if="payOption === 'later'" class="pa-6 rounded-lg" style="background-color: var(--vio-cream)">
              <p class="font-display mb-3" style="color: var(--vio-purple)">Reserve now, pay before your gift date</p>
              <div v-for="line in payLaterNotes" :key="line" class="d-flex ga-3 mb-2">
                <v-icon icon="mdi-check-circle-outline" size="16" color="primary" class="mt-1" />
                <p class="text-body-2 ma-0" style="color: var(--vio-purple-dark)">{{ line }}</p>
              </div>
            </div>

            <div v-else class="pa-6 rounded-lg" style="background-color: var(--vio-cream)">
              <p class="font-display mb-3" style="color: var(--vio-purple)">Pay securely with Paystack</p>
              <div v-for="line in payNowNotes" :key="line" class="d-flex ga-3 mb-2">
                <v-icon icon="mdi-shield-check-outline" size="16" color="primary" class="mt-1" />
                <p class="text-body-2 ma-0" style="color: var(--vio-purple-dark)">{{ line }}</p>
              </div>
            </div>

            <v-alert v-if="payError" type="warning" variant="tonal" class="mt-4">
              {{ payError }}
              <template v-if="pendingOrder" #append>
                <v-btn size="small" variant="text" class="text-none" :loading="isProcessing" @click="handlePay">Try again</v-btn>
              </template>
            </v-alert>
          </div>
        </v-col>

        <!-- RIGHT: Summary -->
        <v-col cols="12" lg="4">
          <v-card rounded="xl" class="pa-6 summary-sticky" flat style="border: 1px solid rgba(46,27,48,0.15)">
            <h4 class="font-display mb-4" style="color: var(--vio-purple); font-size: 1.3rem">Order Total</h4>
            <div class="d-flex flex-column ga-3 mb-5 summary-items">
              <div v-for="item in cart.items" :key="item.id" class="d-flex justify-space-between ga-3 text-body-2">
                <span style="color: var(--vio-purple-dark)">{{ item.quantity }} x {{ item.name }}</span>
                <span class="text-no-wrap" style="color: var(--vio-purple)">₦{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="d-flex flex-column ga-2 mb-5 text-body-2">
              <div class="d-flex justify-space-between">
                <span style="color: var(--vio-purple-dark)">Items</span>
                <span style="color: var(--vio-purple)">₦{{ cart.subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="giftExtra" class="d-flex justify-space-between">
                <span style="color: var(--vio-purple-dark)">Gift {{ giftOption === "bag" ? "bag" : "wrap" }}</span>
                <span style="color: var(--vio-purple)">₦{{ giftExtra.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span style="color: var(--vio-purple-dark)">{{ tab === "pickup" ? "Pickup" : "Delivery" }}</span>
                <span style="color: var(--vio-success)">{{ tab === "pickup" ? "Free" : "TBC" }}</span>
              </div>
              <div v-if="bookedDate" class="d-flex justify-space-between">
                <span style="color: var(--vio-purple-dark)">{{ tab === "pickup" ? "Pickup date" : "Delivery date" }}</span>
                <span class="text-right" style="color: var(--vio-purple)">{{ formatDateKey(bookedDate) }}</span>
              </div>
              <div class="d-flex justify-space-between pt-3" style="border-top: 1px solid rgba(46,27,48,0.15)">
                <span class="font-display" style="color: var(--vio-purple)">Total</span>
                <span class="font-display" style="color: var(--vio-purple); font-size: 1.5rem">₦{{ cartTotal.toFixed(2) }}</span>
              </div>
              <template v-if="payOption === 'later'">
                <div class="d-flex justify-space-between">
                  <span style="color: var(--vio-purple-dark)">Due today</span>
                  <span style="color: var(--vio-success)">₦0.00</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span style="color: var(--vio-purple-dark)">Due by {{ formatDateKey(bookedDate, { day: "numeric", month: "short" }) }}</span>
                  <span style="color: var(--vio-purple)">₦{{ cartTotal.toFixed(2) }}</span>
                </div>
              </template>
            </div>

            <v-btn block size="x-large" color="primary" rounded="lg" class="text-none" :loading="isProcessing" :disabled="!cart.items.length" :prepend-icon="payOption === 'later' ? 'mdi-calendar-check' : 'mdi-lock-outline'" @click="handlePay">
              {{ isProcessing ? "Processing..." : payOption === "later" ? "Confirm Booking — Pay Later" : `Pay Now — ₦${cartTotal.toFixed(2)}` }}
            </v-btn>
            <p class="text-caption text-center mt-4" style="color: var(--vio-text-muted)">
              {{ payOption === "later" ? "No payment taken today." : "Payments are processed by Paystack. We never see or store your card details." }}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import SimpleHeader from "@/components/SimpleHeader.vue";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase";
import { useCartStore, GIFT_EXTRAS } from "@/store/cart";
import { todayKey, formatDateKey } from "@/store/admin";
import { NIGERIAN_STATES } from "@/data/nigeria";
import { payWithPaystack, friendlyError } from "@/lib/paystack";

const router = useRouter();
const cart = useCartStore();
cart.reload();

const tab = ref("delivery");
const when = ref("asap"); // delivery only: "asap" | "date"
const payOption = ref("now"); // "now" | "later"
const isProcessing = ref(false);
const payError = ref("");
// Set once the server has created the order, so a retry reopens payment instead of ordering twice.
const pendingOrder = ref(null);

const giftOption = computed(() => cart.giftingOptions?.giftOption || "");
const giftExtra = computed(() => GIFT_EXTRAS[giftOption.value] || 0);
// Preview only: the server recalculates the real total from live prices.
const cartTotal = computed(() => cart.subtotal + giftExtra.value);

const pickupTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const payNowNotes = [
  "Pay by card, bank transfer or USSD in Paystack's secure window.",
  "Your card details go straight to Paystack and never touch our site.",
  "You'll get an email confirmation as soon as payment goes through.",
];

const form = reactive({
  fullName: "", email: "", phone: "",
  address: "", city: "", state: "", landmark: "",
  pickupDate: "", pickupTime: "",
  deliveryDate: "",
});
const errors = reactive({});

// A date picked in "Book a Gift for Later" on the landing page carries through to here.
if (cart.bookingDate && cart.bookingDate >= todayKey(1)) {
  when.value = "date";
  form.deliveryDate = cart.bookingDate;
  form.pickupDate = cart.bookingDate;
}

// The date the gift is booked for: a pickup date, or a chosen delivery date.
const bookedDate = computed(() => {
  if (tab.value === "pickup") return form.pickupDate || "";
  return when.value === "date" ? form.deliveryDate : "";
});

// Pay later needs a date to be due by — fall back to pay now if the date goes away.
watch(bookedDate, (d) => {
  if (!d) payOption.value = "now";
});

const payLaterNotes = computed(() => [
  "No payment today — your gift is reserved straight away.",
  `We'll email a secure payment link. Pay by card or bank transfer any time before ${formatDateKey(bookedDate.value, { weekday: "long", day: "numeric", month: "long" })}.`,
  "Unpaid bookings may be released on the booked date.",
]);

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!form.fullName.trim()) errors.fullName = "Required";
  if (!form.email.trim()) errors.email = "Required";
  if (!form.phone.trim()) errors.phone = "Required";
  if (form.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) errors.email = "Enter a valid email";
  if (tab.value === "delivery") {
    if (!form.address.trim()) errors.address = "Required";
    if (!form.city.trim()) errors.city = "Required";
    if (!form.state) errors.state = "Required";
    if (when.value === "date") {
      if (!form.deliveryDate) errors.deliveryDate = "Choose a delivery date";
      else if (form.deliveryDate < todayKey(1)) errors.deliveryDate = "Choose a date from tomorrow onwards";
    }
  } else {
    if (!form.pickupDate) errors.pickupDate = "Required";
    else if (form.pickupDate < todayKey()) errors.pickupDate = "Date is in the past";
    if (!form.pickupTime) errors.pickupTime = "Required";
  }
  return Object.keys(errors).length === 0;
}

// Editing the order after a failed payment starts a fresh one; the old one is released automatically.
watch([form, tab, when, payOption, () => cart.items], () => {
  pendingOrder.value = null;
}, { deep: true });

function goToConfirmation({ orderNumber, token }) {
  router.push({ path: "/order-complete", query: { order: orderNumber, t: token } });
}

async function handlePay() {
  payError.value = "";
  if (!validate()) return;
  isProcessing.value = true;
  try {
    let accessCode;
    if (pendingOrder.value) {
      const { data } = await httpsCallable(functions, "startPayment")({ orderNumber: pendingOrder.value.orderNumber, token: pendingOrder.value.token });
      if (data.alreadyPaid) return goToConfirmation(pendingOrder.value);
      accessCode = data.accessCode;
    } else {
      const isPickup = tab.value === "pickup";
      const { data } = await httpsCallable(functions, "createOrder")({
        items: cart.items.map(({ id, quantity }) => ({ id, quantity })),
        customer: {
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          address: isPickup ? "" : form.address,
          city: isPickup ? "" : form.city,
          state: isPickup ? "" : form.state,
          landmark: isPickup ? "" : form.landmark,
        },
        fulfillment: tab.value,
        scheduledFor: bookedDate.value || null,
        scheduledTime: isPickup ? form.pickupTime : "",
        paymentOption: payOption.value,
        giftOption: giftOption.value,
        gifting: {
          from: cart.giftingOptions?.giftFrom || "",
          to: cart.giftingOptions?.giftTo || "",
          note: cart.giftingOptions?.giftNote || "",
        },
        orderNote: cart.orderNote,
      });
      pendingOrder.value = { orderNumber: data.orderNumber, token: data.payToken };
      if (data.paymentOption === "later") return goToConfirmation(pendingOrder.value);
      accessCode = data.accessCode;
    }

    isProcessing.value = false;
    await payWithPaystack(accessCode);
    goToConfirmation(pendingOrder.value);
  } catch (err) {
    payError.value = err.cancelled
      ? "Payment wasn't completed. Your items are held for an hour, so you can try again."
      : friendlyError(err);
  } finally {
    isProcessing.value = false;
  }
}
</script>

<style scoped>
.step-circle {
  width: 24px; height: 24px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 11px;
}
.tab-toggle {
  display: flex; border-radius: 16px; overflow: hidden; border: 1px solid rgba(46,27,48,0.25);
}
.tab-btn {
  flex: 1; padding: 12px; font-size: 0.9rem; background: white; color: var(--vio-purple); border: none; cursor: pointer; transition: all 0.2s;
}
.tab-btn.active {
  background-color: var(--vio-purple); color: #faf7f0;
}
.tab-btn:disabled {
  color: var(--vio-text-muted); background: var(--vio-light-gray); cursor: not-allowed;
}
.summary-sticky { position: sticky; top: 96px; }
.summary-items { border-bottom: 1px solid rgba(46,27,48,0.15); padding-bottom: 20px; }
</style>
