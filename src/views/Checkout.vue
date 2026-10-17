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
                <v-text-field v-model="form.phone" type="tel" label="Phone *" placeholder="+44 7XXX XXXXXX" prepend-inner-icon="mdi-phone-outline" :error-messages="errors.phone" />
              </v-col>
            </v-row>
          </div>

          <div v-if="tab === 'delivery'">
            <h3 class="font-display mb-4" style="color: var(--vio-purple)">Shipping Address</h3>
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="form.address" label="Street Address *" placeholder="123 Gift Lane" prepend-inner-icon="mdi-map-marker-outline" :error-messages="errors.address" />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="form.city" label="City *" placeholder="London" :error-messages="errors.city" />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="form.postcode" label="Postcode" placeholder="SW1A 1AA" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="form.billingAddress" label="Billing Address (if different)" placeholder="Leave blank if same as shipping" />
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

            <template v-else>
            <h4 class="font-display mb-3" style="color: var(--vio-purple)">Payment Method</h4>
            <div class="tab-toggle mb-6">
              <button class="tab-btn" :class="{ active: payMethod === 'card' }" @click="payMethod = 'card'">💳 Pay by Card</button>
              <button class="tab-btn" :class="{ active: payMethod === 'transfer' }" @click="payMethod = 'transfer'">🏦 Bank Transfer</button>
            </div>

            <div v-if="payMethod === 'card'">
              <v-text-field v-model="form.cardNumber" label="Card Number *" placeholder="1234 5678 9012 3456" prepend-inner-icon="mdi-credit-card-outline" :error-messages="errors.cardNumber" />
              <v-row dense>
                <v-col cols="4"><v-text-field v-model="form.expiry" label="Expiry *" placeholder="MM/YY" :error-messages="errors.expiry" /></v-col>
                <v-col cols="4"><v-text-field v-model="form.cvv" label="CVV *" placeholder="123" :error-messages="errors.cvv" /></v-col>
                <v-col cols="4"><v-text-field v-model="form.cardName" label="Name on Card" placeholder="Full name" /></v-col>
              </v-row>
            </div>
            <div v-else class="pa-6 rounded-lg" style="background-color: var(--vio-cream)">
              <p class="font-display mb-3" style="color: var(--vio-purple)">Bank Transfer Details</p>
              <div v-for="[label, value] in bankDetails" :key="label" class="d-flex align-center ga-3 mb-2">
                <v-icon icon="mdi-office-building-outline" size="16" color="primary" />
                <p class="text-body-2 ma-0">
                  <span style="color: var(--vio-purple-dark)">{{ label }}: </span>
                  <strong style="color: var(--vio-purple)">{{ value }}</strong>
                </p>
              </div>
              <p class="text-caption pt-2" style="color: var(--vio-text-muted)">
                Your order will be confirmed once payment is received (usually within 1 business hour).
              </p>
            </div>
            </template>
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
                <span style="color: var(--vio-purple)">₦{{ cartTotal.toFixed(2) }}</span>
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

            <v-btn block size="x-large" color="primary" rounded="lg" class="text-none" :loading="isProcessing" :prepend-icon="payOption === 'later' ? 'mdi-calendar-check' : 'mdi-lock-outline'" @click="handlePay">
              {{ isProcessing ? "Processing..." : payOption === "later" ? "Confirm Booking — Pay Later" : `Pay Now — ₦${cartTotal.toFixed(2)}` }}
            </v-btn>
            <p class="text-caption text-center mt-4" style="color: var(--vio-text-muted)">
              {{ payOption === "later" ? "No payment taken today." : "Encrypted & secure. We never store your card details." }}
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
import { useCartStore } from "@/store/cart";
import { useAdminStore, makeOrderNumber, todayKey, formatDateKey } from "@/store/admin";

const router = useRouter();
const cart = useCartStore();
const admin = useAdminStore();

const tab = ref("delivery");
const when = ref("asap"); // delivery only: "asap" | "date"
const payOption = ref("now"); // "now" | "later"
const payMethod = ref("card");
const isProcessing = ref(false);
const cartTotal = computed(() => cart.cartTotal || cart.subtotal);

const pickupTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const bankDetails = [
  ["Account Name", "VioGiftStore Ltd"],
  ["Sort Code", "12-34-56"],
  ["Account Number", "12345678"],
  ["Reference", "Your order email"],
];

const form = reactive({
  fullName: "", email: "", phone: "",
  address: "", city: "", postcode: "",
  billingAddress: "",
  cardNumber: "", expiry: "", cvv: "", cardName: "",
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
  if (tab.value === "delivery") {
    if (!form.address.trim()) errors.address = "Required";
    if (!form.city.trim()) errors.city = "Required";
    if (when.value === "date") {
      if (!form.deliveryDate) errors.deliveryDate = "Choose a delivery date";
      else if (form.deliveryDate < todayKey(1)) errors.deliveryDate = "Choose a date from tomorrow onwards";
    }
  } else {
    if (!form.pickupDate) errors.pickupDate = "Required";
    else if (form.pickupDate < todayKey()) errors.pickupDate = "Date is in the past";
    if (!form.pickupTime) errors.pickupTime = "Required";
  }
  if (payOption.value === "now" && payMethod.value === "card") {
    if (!form.cardNumber.trim()) errors.cardNumber = "Required";
    if (!form.expiry.trim()) errors.expiry = "Required";
    if (!form.cvv.trim()) errors.cvv = "Required";
  }
  return Object.keys(errors).length === 0;
}

function handlePay() {
  if (!validate()) return;
  isProcessing.value = true;
  setTimeout(() => {
    const orderNumber = makeOrderNumber();
    const items = cart.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
    const fulfillmentMethod = tab.value === "pickup" ? "Pickup" : "Delivery";
    const payLater = payOption.value === "later";
    cart.setOrderDetails({
      ...form,
      orderNumber,
      total: cartTotal.value,
      subtotal: cart.subtotal,
      itemCount: cart.itemCount,
      items,
      fulfillmentMethod,
      tab: tab.value,
      scheduledFor: bookedDate.value || null,
      paymentOption: payOption.value,
    });
    // Card details are deliberately left out of the admin record.
    admin.recordOrder({
      orderNumber,
      customer: { name: form.fullName, email: form.email, phone: form.phone, city: tab.value === "pickup" ? "" : form.city },
      items,
      subtotal: cart.subtotal,
      total: cartTotal.value,
      fulfillmentMethod,
      scheduledFor: bookedDate.value || null,
      scheduledTime: tab.value === "pickup" ? form.pickupTime : "",
      paymentOption: payOption.value,
      paymentMethod: payLater ? "Pay later" : payMethod.value === "card" ? "Card" : "Bank Transfer",
      paymentStatus: payLater ? "Unpaid" : "Paid",
    });
    router.push("/order-complete");
  }, 2200);
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
