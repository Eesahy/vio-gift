<template>
  <div class="min-h-screen bg-white">
    <SimpleHeader back-to="/" back-label="Home">
      <template #right>
        <router-link to="/cart" class="icon-link" aria-label="Cart">
          <v-icon icon="mdi-shopping-outline" size="22" />
        </router-link>
      </template>
    </SimpleHeader>

    <section class="py-16 vio-gradient text-center">
      <v-container>
        <h2 class="font-display mb-3" style="color: #faf7f0; font-size: 2.5rem">Our Collection</h2>
        <p style="color: rgba(250,247,240,0.85)">
          Browse our full range of premium wellness gifts — curated with love for every moment.
        </p>
      </v-container>
    </section>

    <div class="py-5" style="border-bottom: 1px solid rgba(143,90,168,0.12)">
      <v-container>
        <div class="d-flex flex-column flex-sm-row ga-4 align-center">
          <v-text-field v-model="search" placeholder="Search products..." prepend-inner-icon="mdi-magnify" hide-details rounded="pill" class="flex-grow-1" />
          <v-select v-model="sort" :items="sortOptions" item-title="label" item-value="value" hide-details rounded="pill" style="max-width: 220px" prepend-inner-icon="mdi-tune" />
        </div>
      </v-container>
    </div>

    <div class="py-4" style="border-bottom: 1px solid rgba(143,90,168,0.1); overflow-x: auto">
      <v-container>
        <div class="d-flex ga-3" style="min-width: max-content">
          <v-btn
            v-for="cat in categories" :key="cat.id" rounded="pill" size="small" class="text-none"
            :color="activeCategory === cat.id ? 'primary' : undefined"
            :variant="activeCategory === cat.id ? 'flat' : 'tonal'"
            @click="activeCategory = cat.id"
          >
            {{ cat.emoji }} {{ cat.label }}
          </v-btn>

          <v-btn
            rounded="pill" size="small" variant="outlined" class="text-none"
            :color="showBuildBundle ? 'secondary' : undefined"
            @click="showBuildBundle = !showBuildBundle"
          >
            🎁 Build Your Bundle
            <v-chip v-if="bundleItems.length" size="x-small" color="secondary" class="text-white ml-2">{{ bundleItems.length }}</v-chip>
          </v-btn>
        </div>
      </v-container>
    </div>

    <v-expand-transition>
      <div v-if="showBuildBundle" class="px-4 py-4" style="background-color: rgba(217,180,232,0.2); border-bottom: 1px solid rgba(143,90,168,0.25)">
        <v-container class="d-flex flex-wrap align-center justify-space-between ga-4">
          <p class="text-body-2 ma-0" style="color: var(--vio-purple-dark)">
            🎁 <strong style="color: var(--vio-gold)">Build Your Bundle:</strong> Select items below to create a custom gift box.
            <span v-if="bundleItems.length"> ({{ bundleItems.length }} item{{ bundleItems.length > 1 ? "s" : "" }} selected)</span>
          </p>
          <router-link v-if="bundleItems.length" to="/price-list" class="pill-gold">Enquire About Bundle →</router-link>
        </v-container>
      </div>
    </v-expand-transition>

    <section class="py-12" style="padding-bottom: 96px">
      <v-container>
        <p class="text-body-2 mb-6" style="color: var(--vio-purple-dark)">
          {{ filtered.length }} product{{ filtered.length !== 1 ? "s" : "" }}
          <span v-if="activeCategory !== 'all'"> in {{ categories.find((c) => c.id === activeCategory)?.label }}</span>
        </p>

        <div v-if="filtered.length === 0" class="text-center py-16">
          <p style="color: var(--vio-purple-dark)">No products found. Try a different search or category.</p>
        </div>

        <v-row v-else style="max-width: 1300px; margin: 0 auto">
          <v-col v-for="product in filtered" :key="product.id" cols="12" sm="6" lg="4" xl="3">
            <div class="position-relative">
              <button
                v-if="showBuildBundle"
                class="bundle-check"
                :style="{ backgroundColor: bundleItems.includes(product.id) ? 'var(--vio-gold)' : 'rgba(255,255,255,0.85)', borderColor: bundleItems.includes(product.id) ? 'var(--vio-gold)' : 'rgba(255,255,255,0.85)' }"
                @click="toggleBundle(product.id)"
              >
                <span v-if="bundleItems.includes(product.id)" style="color: #fff; font-size: 12px">✓</span>
              </button>
              <ProductCard :product="product" :show-add-button="false" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <SimpleFooter />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SimpleHeader from "@/components/SimpleHeader.vue";
import SimpleFooter from "@/components/SimpleFooter.vue";
import ProductCard from "@/components/ProductCard.vue";
import { allProducts } from "@/data/products";

const categories = [
  { id: "all", label: "All Products", emoji: "✨" },
  { id: "health", label: "Health & Wellbeing", emoji: "🌿" },
  { id: "events", label: "Events & Occasions", emoji: "🎉" },
  { id: "corporate", label: "Corporate", emoji: "🏢" },
  { id: "kids", label: "Kids", emoji: "🎈" },
  { id: "edibles", label: "Edibles", emoji: "🍯" },
  { id: "household", label: "Household", emoji: "🏡" },
  { id: "garden", label: "Garden", emoji: "🌸" },
];

const sortOptions = [
  { label: "Featured", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const activeCategory = ref("all");
const sort = ref("default");
const search = ref("");
const showBuildBundle = ref(false);
const bundleItems = ref([]);

function toggleBundle(id) {
  bundleItems.value = bundleItems.value.includes(id)
    ? bundleItems.value.filter((i) => i !== id)
    : [...bundleItems.value, id];
}

const filtered = computed(() => {
  let products = allProducts;
  if (activeCategory.value !== "all") {
    products = products.filter((p) => p.category === activeCategory.value);
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.items.some((i) => i.toLowerCase().includes(q))
    );
  }
  if (sort.value === "price-asc") return [...products].sort((a, b) => a.price - b.price);
  if (sort.value === "price-desc") return [...products].sort((a, b) => b.price - a.price);
  return products;
});
</script>

<style scoped>
.icon-link { color: var(--vio-purple); transition: opacity 0.2s; }
.icon-link:hover { opacity: 0.7; }
.pill-gold {
  display: inline-flex; align-items: center; padding: 8px 20px; border-radius: 999px;
  background-color: var(--vio-gold); color: #fff; font-size: 0.9rem;
}
.bundle-check {
  position: absolute; top: 12px; left: 12px; z-index: 5; width: 24px; height: 24px;
  border-radius: 999px; border: 2px solid; display: flex; align-items: center; justify-content: center; cursor: pointer;
}
</style>
