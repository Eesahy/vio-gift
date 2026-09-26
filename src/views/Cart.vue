<template>
  <div class="min-h-screen bg-white">
    <SimpleHeader back-to="/" back-label="Continue Shopping">
      <template #right><span style="width: 1px" /></template>
    </SimpleHeader>

    <v-container class="py-10" style="max-width: 1200px">
      <h2 class="font-display mb-8" style="color: var(--vio-purple); font-size: 2rem">
        Your Cart ({{ cart.itemCount }} items)
      </h2>

      <div v-if="cart.items.length === 0" class="text-center py-16">
        <v-icon icon="mdi-shopping-outline" size="64" style="color: rgba(143,90,168,0.4)" class="mb-4" />
        <p class="text-h6 mb-6" style="color: var(--vio-purple-dark)">Your cart is empty</p>
        <router-link to="/" class="hero-btn-solid">Start Shopping</router-link>
      </div>

      <v-row v-else>
        <!-- LEFT -->
        <v-col cols="12" lg="8" class="d-flex flex-column ga-6">
          <v-card rounded="xl" border flat style="border-color: rgba(143,90,168,0.15) !important">
            <div v-for="(item, idx) in cart.items" :key="item.id" class="d-flex ga-4 pa-5" :style="idx < cart.items.length - 1 ? 'border-bottom: 1px solid rgba(143,90,168,0.12)' : ''">
              <v-img :src="item.image" :alt="item.name" width="96" height="96" cover rounded="lg" class="flex-shrink-0" />
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-1">
                  <h4 class="font-display" style="color: var(--vio-purple)">{{ item.name }}</h4>
                  <v-btn icon="mdi-delete-outline" variant="text" size="small" style="color: var(--vio-text-muted)" @click="cart.removeItem(item.id)" />
                </div>
                <p class="text-caption mb-3" style="color: var(--vio-purple-dark)">{{ item.description }}</p>
                <div class="d-flex align-center justify-space-between">
                  <div class="qty-selector">
                    <button class="qty-btn" @click="cart.updateQty(item.id, -1)"><v-icon icon="mdi-minus" size="14" /></button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button class="qty-btn" @click="cart.updateQty(item.id, 1)"><v-icon icon="mdi-plus" size="14" /></button>
                  </div>
                  <span class="font-display" style="color: var(--vio-purple); font-size: 1.1rem">
                    £{{ (item.price * item.quantity).toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </v-card>

          <!-- Upsell -->
          <v-card rounded="xl" class="pa-6" flat style="background-color: var(--vio-cream); border: 1px solid rgba(143,90,168,0.15)">
            <h4 class="font-display mb-4" style="color: var(--vio-purple)">Customers also love</h4>
            <v-row dense>
              <v-col v-for="p in upsellItems" :key="p.id" cols="4">
                <v-card rounded="lg" border flat style="border-color: rgba(143,90,168,0.12) !important">
                  <v-img :src="p.image" :alt="p.name" aspect-ratio="1" cover />
                  <div class="pa-3">
                    <p class="text-caption line-clamp-1 mb-1" style="color: var(--vio-purple); font-family: Belleza, serif">{{ p.name }}</p>
                    <p class="text-body-2 mb-2" style="color: var(--vio-purple)">£{{ p.price }}</p>
                    <v-btn block size="small" color="primary" class="text-none" @click="addUpsell(p)">+ Add</v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card>

          <!-- Order note -->
          <v-card rounded="xl" class="pa-6" flat style="border: 1px solid rgba(143,90,168,0.15)">
            <h4 class="font-display mb-3 d-flex align-center ga-2" style="color: var(--vio-purple)">
              <v-icon icon="mdi-message-text-outline" />
              Additional Order Note
            </h4>
            <v-textarea
              v-model="orderNote"
              rows="3"
              hide-details
              placeholder="Any special requests or notes for your order..."
              @update:model-value="cart.setOrderNote(orderNote)"
            />
          </v-card>

          <!-- Gift extras -->
          <v-card rounded="xl" class="pa-6" flat style="border: 1px solid rgba(143,90,168,0.15)">
            <v-checkbox v-model="addGiftExtras" hide-details class="mb-2">
              <template #label>
                <span class="font-display d-flex align-center ga-2" style="color: var(--vio-purple)">
                  <v-icon icon="mdi-gift-outline" />
                  Add Cards, Extras
                </span>
              </template>
            </v-checkbox>

            <v-expand-transition>
              <div v-if="addGiftExtras" class="d-flex flex-column ga-5 pt-2">
                <div>
                  <p class="text-body-2 mb-3" style="color: var(--vio-purple-dark)">Gift Packaging</p>
                  <div class="d-flex ga-3 flex-wrap">
                    <v-btn
                      variant="outlined" rounded="lg" prepend-icon="mdi-package-variant-closed"
                      :color="giftOption === 'bag' ? 'primary' : undefined"
                      @click="giftOption = giftOption === 'bag' ? '' : 'bag'"
                    >Gift Bag (+£5)</v-btn>
                    <v-btn
                      variant="outlined" rounded="lg" prepend-icon="mdi-gift-outline"
                      :color="giftOption === 'wrap' ? 'primary' : undefined"
                      @click="giftOption = giftOption === 'wrap' ? '' : 'wrap'"
                    >Gift Wrap (+£3)</v-btn>
                  </div>
                </div>

                <div>
                  <p class="text-body-2 mb-3" style="color: var(--vio-purple-dark)">Personalised Message</p>
                  <v-row dense>
                    <v-col cols="6"><v-text-field v-model="giftFrom" label="From" placeholder="Your name" hide-details /></v-col>
                    <v-col cols="6"><v-text-field v-model="giftTo" label="To" placeholder="Recipient's name" hide-details /></v-col>
                  </v-row>
                  <v-textarea v-model="giftNote" class="mt-3" rows="3" hide-details placeholder="Enter personalized note here..." />
                </div>

                <v-btn
                  variant="outlined" rounded="pill" size="small" prepend-icon="mdi-bookmark-outline"
                  :color="savedGifting ? 'success' : 'primary'"
                  @click="saveGifting"
                >
                  {{ savedGifting ? "Gifting options saved!" : "Save gifting options" }}
                </v-btn>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>

        <!-- RIGHT: Summary -->
        <v-col cols="12" lg="4">
          <v-card rounded="xl" class="pa-6 summary-sticky" flat style="border: 1px solid rgba(143,90,168,0.15)">
            <h4 class="font-display mb-5" style="color: var(--vio-purple); font-size: 1.3rem">Order Summary</h4>
            <div class="d-flex flex-column ga-3 mb-5 summary-items">
              <div v-for="item in cart.items" :key="item.id" class="d-flex justify-space-between ga-3 text-body-2">
                <span style="color: var(--vio-purple-dark)">{{ item.quantity }} x {{ item.name }}</span>
                <span class="text-no-wrap" style="color: var(--vio-purple)">£{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="d-flex flex-column ga-3 mb-5">
              <div class="d-flex justify-space-between text-body-2">
                <span style="color: var(--vio-purple-dark)">Subtotal</span>
                <span style="color: var(--vio-purple)">£{{ cart.subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="giftExtra > 0" class="d-flex justify-space-between text-body-2">
                <span style="color: var(--vio-purple-dark)">Gift {{ giftOption === "bag" ? "Bag" : "Wrap" }}</span>
                <span style="color: var(--vio-purple)">£{{ giftExtra.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-space-between text-body-2">
                <span style="color: var(--vio-purple-dark)">Delivery</span>
                <span style="color: var(--vio-success)">Calculated at checkout</span>
              </div>
              <div class="d-flex justify-space-between pt-3" style="border-top: 1px solid rgba(143,90,168,0.15)">
                <span class="font-display" style="color: var(--vio-purple)">Total</span>
                <span class="font-display" style="color: var(--vio-purple); font-size: 1.5rem">£{{ total.toFixed(2) }}</span>
              </div>
            </div>

            <v-btn block size="x-large" color="primary" rounded="lg" class="text-none" append-icon="mdi-arrow-right" @click="handleCheckout">
              Proceed to Checkout
            </v-btn>
            <p class="text-caption text-center mt-4" style="color: var(--vio-text-muted)">
              Secure checkout. Your data is protected.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import SimpleHeader from "@/components/SimpleHeader.vue";
import { allProducts } from "@/data/products";
import { useCartStore } from "@/store/cart";

const router = useRouter();
const cart = useCartStore();
cart.reload();

const orderNote = ref(cart.orderNote);
const addGiftExtras = ref(false);
const giftOption = ref("");
const giftFrom = ref("");
const giftTo = ref("");
const giftNote = ref("");
const savedGifting = ref(false);

const upsellItems = allProducts.filter((p) => p.tags.includes("Best Seller")).slice(0, 3);

const giftExtra = computed(() => (giftOption.value === "bag" ? 5 : giftOption.value === "wrap" ? 3 : 0));
const total = computed(() => cart.subtotal + giftExtra.value);

function addUpsell(product) {
  cart.addToCart(product, 1);
}

function saveGifting() {
  cart.saveGiftingOptions({ giftFrom: giftFrom.value, giftTo: giftTo.value, giftNote: giftNote.value, giftOption: giftOption.value });
  savedGifting.value = true;
  setTimeout(() => (savedGifting.value = false), 2000);
}

function handleCheckout() {
  cart.setOrderNote(orderNote.value);
  cart.setCartTotal(total.value);
  router.push("/checkout");
}
</script>

<style scoped>
.hero-btn-solid {
  display: inline-flex; align-items: center; padding: 12px 32px; border-radius: 999px;
  background-color: var(--vio-purple); color: var(--vio-cream); font-family: "Belleza", serif;
}
.qty-selector {
  display: inline-flex; align-items: center; gap: 12px; border: 1px solid rgba(143,90,168,0.3); border-radius: 999px; padding: 0 4px;
}
.qty-btn {
  width: 32px; height: 32px; border-radius: 999px; border: none; background: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: var(--vio-purple);
}
.qty-value { width: 16px; text-align: center; color: var(--vio-purple); font-size: 0.9rem; }
.summary-sticky { position: sticky; top: 96px; }
.summary-items { border-bottom: 1px solid rgba(143,90,168,0.15); padding-bottom: 20px; }
</style>
