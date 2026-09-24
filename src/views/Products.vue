<template>
  <div class="min-h-screen bg-white">
    <SimpleHeader back-to="/" back-label="Back">
      <template #right>
        <router-link to="/cart" class="icon-link" aria-label="Cart">
          <v-icon icon="mdi-shopping-outline" size="22" />
        </router-link>
      </template>
    </SimpleHeader>

    <section class="py-12 text-center" style="background-color: var(--vio-cream)">
      <v-container>
        <h2 class="font-display mb-3" style="color: var(--vio-purple); font-size: 2.75rem">
          {{ displayName }} Collection
        </h2>
        <p style="color: var(--vio-purple-dark)">
          {{ themeProducts.length }} curated wellness gift{{ themeProducts.length !== 1 ? "s" : "" }}
        </p>
      </v-container>
    </section>

    <section class="py-4" style="border-bottom: 1px solid rgba(143,90,168,0.15)">
      <v-container>
        <div class="d-flex align-center flex-wrap ga-4">
          <v-btn
            variant="outlined"
            rounded="pill"
            size="small"
            prepend-icon="mdi-tune"
            :style="{
              borderColor: filterOpen ? 'var(--vio-purple)' : 'rgba(143,90,168,0.3)',
              color: 'var(--vio-purple)',
              backgroundColor: filterOpen ? 'rgba(217,180,232,0.3)' : 'transparent',
            }"
            @click="filterOpen = !filterOpen"
          >
            Filters
          </v-btn>

          <div class="d-flex align-center ga-3" style="margin-left: auto">
            <span class="text-body-2" style="color: var(--vio-purple-dark)">Sort by:</span>
            <v-select
              v-model="sort"
              :items="sortOptions"
              item-title="label"
              item-value="value"
              density="compact"
              hide-details
              style="max-width: 200px"
            />
          </div>
        </div>

        <v-expand-transition>
          <div v-if="filterOpen" class="pt-4 mt-4" style="border-top: 1px solid rgba(143,90,168,0.15)">
            <div class="d-flex flex-wrap ga-8 align-center">
              <div>
                <p class="text-caption text-uppercase mb-2" style="color: var(--vio-purple-dark)">Price Range</p>
                <div class="d-flex align-center ga-3">
                  <span class="text-body-2" style="color: var(--vio-purple)">£0</span>
                  <v-slider v-model="priceMax" :min="0" :max="200" hide-details style="width: 160px" color="primary" />
                  <span class="text-body-2" style="color: var(--vio-purple)">£{{ priceMax }}</span>
                </div>
              </div>
              <div>
                <p class="text-caption text-uppercase mb-2" style="color: var(--vio-purple-dark)">Tags</p>
                <div class="d-flex ga-2 flex-wrap">
                  <v-chip v-for="tag in ['Best Seller', 'Limited Edition', 'New']" :key="tag" variant="outlined" color="secondary" size="small">
                    {{ tag }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>
        </v-expand-transition>
      </v-container>
    </section>

    <section class="py-12" style="padding-bottom: 96px">
      <v-container>
        <div v-if="themeProducts.length === 0" class="text-center py-16">
          <p style="color: var(--vio-purple-dark)">No products found. Try adjusting your filters.</p>
        </div>
        <v-row v-else style="max-width: 1300px; margin: 0 auto">
          <v-col v-for="product in themeProducts" :key="product.id" cols="12" sm="6" lg="4" xl="3">
            <ProductCard :product="product" />
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import SimpleHeader from "@/components/SimpleHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import { getProductsByTheme, allProducts, themeDisplayNames } from "@/data/products";

const route = useRoute();
const sort = ref("default");
const filterOpen = ref(false);
const priceMax = ref(200);

const sortOptions = [
  { label: "Featured", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name A-Z", value: "name" },
];

const themeProducts = computed(() => {
  const theme = route.params.theme;
  let products = theme ? getProductsByTheme(theme) : allProducts;
  products = products.filter((p) => p.price <= priceMax.value);

  if (sort.value === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  else if (sort.value === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  else if (sort.value === "name") products = [...products].sort((a, b) => a.name.localeCompare(b.name));

  return products;
});

const displayName = computed(() => {
  const theme = route.params.theme;
  return theme ? themeDisplayNames[theme] || theme : "All Products";
});
</script>

<style scoped>
.icon-link { color: var(--vio-purple); transition: opacity 0.2s; }
.icon-link:hover { opacity: 0.7; }
</style>
