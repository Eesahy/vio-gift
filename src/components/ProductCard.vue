<template>
  <router-link :to="`/product/${product.id}`" class="d-block">
    <v-card class="vio-product-card vio-card-hover" rounded="xl" border flat>
      <div class="vio-img-zoom position-relative" style="overflow: hidden">
        <v-img :src="product.image" :alt="product.name" cover :aspect-ratio="4 / 3" />
        <div v-if="product.tags?.length" class="position-absolute d-flex flex-wrap ga-1" style="top: 12px; left: 12px">
          <v-chip
            v-for="tag in product.tags.slice(0, 2)"
            :key="tag"
            size="x-small"
            :color="tag === 'Best Seller' ? 'secondary' : 'primary'"
            variant="flat"
            class="text-white"
          >
            {{ tag }}
          </v-chip>
        </div>
      </div>

      <div class="pa-5">
        <h3 class="font-display mb-1" style="color: var(--vio-purple); font-size: 1.15rem">
          {{ product.name }}
        </h3>
        <p class="text-caption line-clamp-2 mb-3" style="color: var(--vio-purple-dark)">
          {{ product.description }}
        </p>

        <div class="d-flex flex-wrap ga-1 mb-4">
          <span
            v-for="item in product.items.slice(0, 3)"
            :key="item"
            class="text-caption px-2 py-1 rounded-pill"
            style="background: var(--vio-cream); color: var(--vio-purple-dark)"
          >
            {{ item }}
          </span>
          <span
            v-if="product.items.length > 3"
            class="text-caption px-2 py-1 rounded-pill"
            style="background: var(--vio-cream); color: var(--vio-purple)"
          >
            +{{ product.items.length - 3 }} more
          </span>
        </div>

        <div class="d-flex align-center justify-space-between">
          <div class="d-flex">
            <v-icon v-for="i in 5" :key="i" icon="mdi-star" size="14" color="secondary" />
          </div>
          <span class="font-display" style="color: var(--vio-purple); font-size: 1.3rem">
            £{{ product.price }}
          </span>
        </div>

        <v-btn
          v-if="showAddButton"
          block
          class="mt-4 text-none"
          color="primary"
          rounded="lg"
          prepend-icon="mdi-shopping"
        >
          View Product
        </v-btn>
      </div>
    </v-card>
  </router-link>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true },
  showAddButton: { type: Boolean, default: true },
});
</script>

<style scoped>
.vio-product-card {
  border-color: rgba(143, 90, 168, 0.15) !important;
}
</style>
