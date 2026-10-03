<template>
  <div class="min-h-screen" style="background-color: var(--vio-cream)">
    <SimpleHeader variant="purple" back-to="/" back-label="Back to Home" :sticky="true" />

    <section class="py-16 text-center">
      <v-container style="max-width: 760px">
        <h1 class="font-display mb-6" style="color: var(--vio-purple); font-size: 2.75rem">Brand Assets &amp; Design System</h1>
        <p style="color: var(--vio-purple-dark); font-size: 1.1rem">
          Complete brand design resources including product labels, marketing materials, catalogues, and pricing sheets.
        </p>
      </v-container>
    </section>

    <section class="py-8">
      <v-container style="max-width: 1000px">
        <v-row>
          <v-col v-for="nav in quickNav" :key="nav.label" cols="6" md="3">
            <component :is="nav.to ? 'router-link' : 'a'" :to="nav.to" :href="nav.href">
              <v-card rounded="xl" class="pa-6 text-center vio-card-hover" flat>
                <v-icon :icon="nav.icon" size="40" color="primary" class="mb-3" />
                <h3 class="font-display" style="color: var(--vio-purple); font-size: 1.1rem">{{ nav.label }}</h3>
              </v-card>
            </component>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="py-12" style="background-color: rgba(217,180,232,0.2)">
      <v-container style="max-width: 900px">
        <h2 class="font-display text-center mb-8" style="color: var(--vio-purple); font-size: 1.9rem">Brand Guidelines</h2>
        <v-row>
          <v-col cols="12" md="6">
            <v-card rounded="xl" class="pa-6">
              <h3 class="font-display mb-4" style="color: var(--vio-purple); font-size: 1.4rem">Typography</h3>
              <p class="text-body-2 mb-1" style="color: var(--vio-purple-dark)">Primary Font</p>
              <p class="font-display mb-2" style="color: var(--vio-purple); font-size: 1.5rem">Belleza</p>
              <p class="text-body-2" style="color: var(--vio-purple-dark)">Used for headings, labels, and brand elements</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card rounded="xl" class="pa-6">
              <h3 class="font-display mb-4" style="color: var(--vio-purple); font-size: 1.4rem">Color Palette</h3>
              <div v-for="c in palette" :key="c.hex" class="d-flex align-center ga-3 mb-3">
                <div class="swatch" :style="{ backgroundColor: c.hex }" />
                <div>
                  <p class="text-body-2 mb-0" style="color: var(--vio-purple-dark)">{{ c.name }}</p>
                  <p class="text-caption ma-0" style="font-family: monospace">{{ c.hex }}</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="labels" class="py-12">
      <v-container>
        <h2 class="font-display text-center mb-10" style="color: var(--vio-purple); font-size: 2rem">Product Label Design System</h2>
        <h3 class="font-display mb-4" style="color: var(--vio-purple)">Rectangle Labels</h3>
        <v-row class="mb-10">
          <v-col v-for="p in labelProducts" :key="p.name + '-r'" cols="12" md="6">
            <ProductLabel :product-name="p.name" :description="p.description" :net-weight="p.weight" shape="rectangle" />
          </v-col>
        </v-row>
        <h3 class="font-display mb-4" style="color: var(--vio-purple)">Square Labels</h3>
        <v-row class="mb-10">
          <v-col v-for="p in labelProducts" :key="p.name + '-s'" cols="6" md="3">
            <ProductLabel :product-name="p.name" :description="p.description" :net-weight="p.weight" shape="square" />
          </v-col>
        </v-row>
        <h3 class="font-display mb-4" style="color: var(--vio-purple)">Circular Seal Stickers</h3>
        <v-row style="max-width: 800px">
          <v-col v-for="p in labelProducts" :key="p.name + '-c'" cols="6" md="3">
            <ProductLabel :product-name="p.name" :description="p.description" :net-weight="p.weight" shape="circle" />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="fliers" class="py-12" style="background-color: rgba(217,180,232,0.2)">
      <v-container>
        <h2 class="font-display text-center mb-10" style="color: var(--vio-purple); font-size: 2rem">Coming Soon Flier Designs</h2>
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="font-display text-center mb-4" style="color: var(--vio-purple)">Instagram Post (Square)</h3>
            <ComingSoonFlier format="instagram" />
          </v-col>
          <v-col cols="12" lg="6">
            <h3 class="font-display text-center mb-4" style="color: var(--vio-purple)">Instagram Story (Vertical)</h3>
            <div style="max-width: 380px; margin: 0 auto">
              <ComingSoonFlier format="story" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="py-16 text-center">
      <v-container style="max-width: 640px">
        <h2 class="font-display mb-4" style="color: var(--vio-purple); font-size: 1.9rem">Need Custom Design Work?</h2>
        <p class="mb-8" style="color: var(--vio-purple-dark)">
          Contact us for custom branding, corporate packages, or special design requests
        </p>
        <div class="d-flex flex-column flex-sm-row ga-4 justify-center">
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" class="cta-purple">WhatsApp Us</a>
          <a href="https://instagram.com/viogiftstore" target="_blank" rel="noopener noreferrer" class="cta-plum">Instagram</a>
        </div>
      </v-container>
    </section>

    <SimpleFooter />
  </div>
</template>

<script setup>
import SimpleHeader from "@/components/SimpleHeader.vue";
import SimpleFooter from "@/components/SimpleFooter.vue";
import ProductLabel from "@/components/ProductLabel.vue";
import ComingSoonFlier from "@/components/ComingSoonFlier.vue";

const quickNav = [
  { label: "Product Labels", icon: "mdi-package-variant-closed", href: "#labels" },
  { label: "Coming Soon Fliers", icon: "mdi-bullhorn-outline", href: "#fliers" },
  { label: "Catalogue", icon: "mdi-file-document-outline", to: "/catalogue" },
  { label: "Price List", icon: "mdi-currency-usd", to: "/price-list" },
];

const palette = [
  { name: "Primary Purple", hex: "#8f5aa8" },
  { name: "Secondary Lilac", hex: "#d9b4e8" },
  { name: "Warm Cream", hex: "#faf7f0" },
  { name: "Gray", hex: "#8d8890" },
  { name: "Light Gray", hex: "#ece9ec" },
  { name: "Gold", hex: "#c8a96a" },
];

const labelProducts = [
  { name: "Herbal Tea", description: "Premium organic blend", weight: "Net Wt: 50g" },
  { name: "Organic Honey", description: "Pure wildflower honey", weight: "Net Wt: 250g" },
  { name: "Artisanal Incense", description: "Hand-rolled natural incense", weight: "20 Sticks" },
  { name: "Wellness Snacks", description: "Healthy gourmet treats", weight: "Net Wt: 150g" },
];
</script>

<style scoped>
.swatch { width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0; }
.cta-purple {
  display: inline-flex; align-items: center; justify-content: center; padding: 12px 32px;
  border-radius: 16px; background-color: var(--vio-purple); color: #faf7f0;
}
.cta-plum {
  display: inline-flex; align-items: center; justify-content: center; padding: 12px 32px;
  border-radius: 16px; background-color: var(--vio-purple-dark); color: #faf7f0;
}
</style>
