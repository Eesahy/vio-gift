<template>
  <div class="flier" :class="format" style="background: linear-gradient(135deg, #8f5aa8 0%, #673a7f 25%, #8f5aa8 50%, #d9b4e8 100%)">
    <div class="flier-circle" style="top: 40px; right: 40px; width: 128px; height: 128px; background-color: #faf7f0; opacity: 0.2" />
    <div class="flier-circle" style="bottom: 80px; left: 40px; width: 160px; height: 160px; background-color: var(--vio-gold); opacity: 0.1" />

    <div class="flier-content">
      <div class="d-flex align-center justify-center ga-2 mb-8">
        <v-icon icon="mdi-creation" size="24" color="secondary" />
        <p class="font-display text-uppercase ma-0" style="color: #faf7f0; letter-spacing: 0.15em; font-size: 1.1rem">VioGiftStore</p>
        <v-icon icon="mdi-creation" size="24" color="secondary" />
      </div>

      <h1 class="font-display mb-6" :style="{ color: '#faf7f0', fontSize: format === 'story' ? '2.75rem' : '2.25rem', lineHeight: 1.2 }">
        Something Beautiful<br />is Coming
      </h1>

      <div style="width: 96px; height: 4px; background-color: var(--vio-gold); margin: 0 auto 32px" />

      <p class="font-display mb-10" style="color: #faf7f0; font-size: 1.25rem">
        New Wellness Gift Packages<br />Launching Soon
      </p>

      <div class="d-flex justify-center ga-4 mb-10" style="opacity: 0.4">
        <div style="width: 48px; height: 64px; border-radius: 8px; background-color: #faf7f0" />
        <div style="width: 64px; height: 48px; border-radius: 999px; background-color: #faf7f0" />
        <div style="width: 48px; height: 64px; border-radius: 8px; background-color: #faf7f0" />
      </div>

      <div class="d-flex flex-column ga-3">
        <div class="d-flex align-center justify-center ga-2" style="color: #faf7f0">
          <v-icon icon="mdi-instagram" size="18" /><span class="text-body-2">@viogiftstore</span>
        </div>
        <div class="d-flex align-center justify-center ga-2" style="color: #faf7f0">
          <v-icon icon="mdi-whatsapp" size="18" /><span class="text-body-2">WhatsApp: +1 234 567 8900</span>
        </div>
        <p class="text-body-2" style="color: #faf7f0">www.viogiftstore.com</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  format: { type: String, default: "instagram" }, // instagram | story
});
</script>

<style scoped>
.flier {
  width: 100%; max-width: 640px; margin: 0 auto; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center; padding: 48px; text-align: center;
}
.flier.instagram { aspect-ratio: 1/1; }
.flier.story { aspect-ratio: 9/16; }
.flier-circle { position: absolute; border-radius: 999px; }
.flier-content { position: relative; z-index: 2; }
</style>
