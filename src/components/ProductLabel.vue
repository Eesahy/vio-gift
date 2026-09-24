<template>
  <div class="product-label" :class="shape" :style="{ backgroundImage: 'linear-gradient(135deg, #8f5aa8 0%, #673a7f 100%)' }">
    <div class="d-flex align-center ga-2 mb-4">
      <v-icon icon="mdi-creation" size="16" color="secondary" />
      <p class="font-display ma-0" style="color: #faf7f0; letter-spacing: 0.15em; font-size: 0.85rem">VIOGIFTSTORE</p>
      <v-icon icon="mdi-creation" size="16" color="secondary" />
    </div>
    <div class="flex-grow-1 d-flex align-center">
      <h2 class="font-display" style="color: #faf7f0; font-size: 1.6rem">{{ productName }}</h2>
    </div>
    <div class="label-divider" />
    <p class="mb-2" style="color: #faf7f0; opacity: 0.9; font-size: 0.9rem">{{ description }}</p>
    <p style="color: #faf7f0; opacity: 0.8; font-size: 0.75rem; letter-spacing: 0.05em">{{ netWeight }}</p>
  </div>
</template>

<script setup>
defineProps({
  productName: String,
  description: String,
  netWeight: String,
  shape: { type: String, default: "rectangle" }, // square | rectangle | circle
});
</script>

<style scoped>
.product-label {
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
}
.product-label.rectangle { aspect-ratio: 16/9; border-radius: 20px; }
.product-label.square { aspect-ratio: 1/1; border-radius: 20px; }
.product-label.circle { aspect-ratio: 1/1; border-radius: 999px; }
.label-divider { width: 64px; height: 1px; background-color: var(--vio-gold); margin: 16px 0; }
</style>
