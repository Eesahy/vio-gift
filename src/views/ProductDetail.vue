<template>
  <div v-if="!product" class="min-h-screen d-flex align-center justify-center bg-white">
    <div class="text-center">
      <p class="text-h6 mb-4" style="color: var(--vio-purple-dark)">Product not found</p>
      <router-link to="/" class="hero-btn-solid">Back to Home</router-link>
    </div>
  </div>

  <div v-else class="min-h-screen bg-white">
    <SimpleHeader :back-to="null" back-label="Back" @back="$router.back()">
      <template #right>
        <router-link to="/cart" class="icon-link" aria-label="Cart">
          <v-icon icon="mdi-shopping-outline" size="22" />
        </router-link>
      </template>
    </SimpleHeader>

    <v-container class="py-12" style="max-width: 1200px">
      <v-row>
        <!-- LEFT: Images -->
        <v-col cols="12" lg="6">
          <div class="position-relative rounded-xl overflow-hidden mb-4 elevation-2">
            <v-img :src="images[activeImg]" :alt="product.name" cover :aspect-ratio="1" class="vio-fade-in" />

            <v-btn icon size="36" class="gallery-nav" style="right: 16px" @click="activeImg = (activeImg + 1) % images.length">
              <v-icon icon="mdi-chevron-right" color="primary" />
            </v-btn>
            <v-btn icon size="36" class="gallery-nav" style="left: 16px" @click="activeImg = (activeImg - 1 + images.length) % images.length">
              <v-icon icon="mdi-chevron-left" color="primary" />
            </v-btn>

            <v-btn icon size="40" class="wishlist-btn" @click="wishlist = !wishlist">
              <v-icon :icon="wishlist ? 'mdi-heart' : 'mdi-heart-outline'" :color="wishlist ? 'pink' : 'primary'" />
            </v-btn>
          </div>

          <div class="d-flex ga-3">
            <button
              v-for="(img, i) in images"
              :key="i"
              class="thumb-btn"
              :style="{ borderColor: activeImg === i ? 'var(--vio-purple)' : 'transparent' }"
              @click="activeImg = i"
            >
              <img :src="img" alt="" />
            </button>
          </div>
        </v-col>

        <!-- RIGHT: Details -->
        <v-col cols="12" lg="6">
          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip
              v-for="tag in product.tags"
              :key="tag"
              size="small"
              :color="tag === 'Best Seller' ? 'secondary' : undefined"
              :variant="tag === 'Best Seller' ? 'flat' : 'tonal'"
              :class="tag === 'Best Seller' ? 'text-white' : ''"
            >
              {{ tag }}
            </v-chip>
          </div>

          <h2 class="font-display mb-3" style="color: var(--vio-purple); font-size: 2.25rem; line-height: 1.2">
            {{ product.name }}
          </h2>

          <div class="d-flex align-center ga-2 mb-4">
            <div class="d-flex">
              <v-icon v-for="i in 5" :key="i" icon="mdi-star" size="16" color="secondary" />
            </div>
            <span class="text-body-2" style="color: var(--vio-purple-dark)">(48 reviews)</span>
          </div>

          <p class="font-display mb-4" style="color: var(--vio-purple); font-size: 2.25rem">£{{ product.price }}</p>

          <p class="mb-6" style="color: var(--vio-purple-dark); line-height: 1.7">{{ product.description }}</p>

          <div class="d-flex flex-wrap ga-3 mb-6">
            <span class="trust-badge"><v-icon icon="mdi-package-variant-closed" size="16" class="mr-1" />Arrives packaged</span>
            <span class="trust-badge"><v-icon icon="mdi-shield-check-outline" size="16" class="mr-1" />Secure Payments</span>
            <span class="trust-badge"><v-icon icon="mdi-credit-card-outline" size="16" class="mr-1" />Card &amp; Transfer</span>
          </div>

          <div class="d-flex align-center ga-3 pa-4 rounded-xl mb-6" style="background-color: var(--vio-cream)">
            <v-icon icon="mdi-clock-outline" size="20" color="secondary" />
            <p class="text-body-2 ma-0" style="color: var(--vio-purple-dark)">
              <strong style="color: var(--vio-purple)">Pickup and delivery.</strong> Ready in 3 hours.
            </p>
          </div>

          <div class="d-flex ga-3 mb-8">
            <v-btn size="x-large" class="flex-grow-1 text-none" color="primary" rounded="lg" prepend-icon="mdi-shopping" @click="handleAddToCart">
              Add to Cart
            </v-btn>
            <v-btn size="x-large" icon variant="outlined" rounded="lg" :color="wishlist ? 'pink' : 'primary'" @click="wishlist = !wishlist">
              <v-icon :icon="wishlist ? 'mdi-heart' : 'mdi-heart-outline'" />
            </v-btn>
          </div>

          <div class="mb-6">
            <h4 class="font-display mb-3" style="color: var(--vio-purple); font-size: 1.2rem">What it contains</h4>
            <div class="d-flex flex-column ga-2">
              <div v-for="item in product.items" :key="item" class="d-flex align-center ga-2">
                <v-icon icon="mdi-check" size="16" color="secondary" />
                <span class="text-body-2" style="color: var(--vio-purple-dark)">{{ item }}</span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="font-display mb-3" style="color: var(--vio-purple); font-size: 1.2rem">Perfect for:</h4>
            <div class="d-flex flex-wrap ga-2">
              <span
                v-for="occasion in product.perfectFor"
                :key="occasion"
                class="text-body-2 px-3 py-1 rounded-pill"
                style="background-color: var(--vio-cream); color: var(--vio-purple-dark)"
              >
                {{ occasion }}
              </span>
            </div>
          </div>

          <div class="d-flex align-center ga-2">
            <span class="stock-dot" :style="{ backgroundColor: stockColor }" />
            <span class="text-body-2" style="color: var(--vio-purple-dark)">{{ stockLabel }}</span>
          </div>
        </v-col>
      </v-row>

      <!-- Related products -->
      <section v-if="related.length" class="mt-16">
        <h3 class="font-display mb-8" style="color: var(--vio-purple); font-size: 1.75rem">You might also love</h3>
        <v-row>
          <v-col v-for="p in related" :key="p.id" cols="12" sm="4">
            <ProductCard :product="p" :show-add-button="false" />
          </v-col>
        </v-row>
      </section>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import SimpleHeader from "@/components/SimpleHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import { getProductById, allProducts } from "@/data/products";
import { useCartStore } from "@/store/cart";

const route = useRoute();
const router = useRouter();
const cart = useCartStore();

const product = computed(() => getProductById(route.params.id));
const images = computed(() => (product.value ? [product.value.image, product.value.image2] : []));
const activeImg = ref(0);
const wishlist = ref(false);

const related = computed(() => {
  if (!product.value) return [];
  return allProducts.filter((p) => p.category === product.value.category && p.id !== product.value.id).slice(0, 3);
});

const stockColor = computed(() => {
  if (!product.value) return "#ccc";
  return product.value.stock > 5 ? "#22c55e" : product.value.stock > 0 ? "#f59e0b" : "#ef4444";
});
const stockLabel = computed(() => {
  if (!product.value) return "";
  const s = product.value.stock;
  return s > 10 ? "In stock — ships fast" : s > 0 ? `Only ${s} left` : "Out of stock";
});

function handleAddToCart() {
  cart.addToCart(product.value, 1);
  router.push("/cart");
}
</script>

<style scoped>
.icon-link { color: var(--vio-purple); transition: opacity 0.2s; }
.icon-link:hover { opacity: 0.7; }
.gallery-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  background-color: rgba(255,255,255,0.9) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.wishlist-btn {
  position: absolute; top: 16px; right: 16px;
  background-color: rgba(255,255,255,0.9) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.thumb-btn {
  width: 80px; height: 80px; border-radius: 12px; overflow: hidden; border: 2px solid transparent;
  cursor: pointer; padding: 0; transition: border-color 0.2s;
}
.thumb-btn img { width: 100%; height: 100%; object-fit: cover; }
.trust-badge {
  display: inline-flex; align-items: center; padding: 8px 16px; border-radius: 999px;
  font-size: 0.875rem; border: 1px solid rgba(143,90,168,0.3); color: var(--vio-purple);
}
.stock-dot { width: 8px; height: 8px; border-radius: 999px; display: inline-block; }
.hero-btn-solid {
  display: inline-flex; align-items: center; padding: 12px 28px; border-radius: 999px;
  background-color: var(--vio-purple); color: var(--vio-cream); font-family: "Belleza", serif;
}
</style>
