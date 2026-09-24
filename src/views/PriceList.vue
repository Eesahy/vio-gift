<template>
  <div class="min-h-screen" style="background-color: var(--vio-cream)">
    <SimpleHeader variant="purple" back-to="/" back-label="Back to Home" :sticky="false" />

    <section class="py-16 text-center">
      <v-container>
        <h1 class="font-display mb-4" style="color: var(--vio-purple); font-size: 3rem">Custom Orders</h1>
        <p class="mb-8" style="color: var(--vio-purple-dark); font-size: 1.1rem">Premium Wellness Gift Packages — 2026</p>
        <div class="d-flex ga-4 justify-center flex-wrap">
          <v-btn color="primary" rounded="lg" size="large" class="text-none" prepend-icon="mdi-download-outline">Download PDF</v-btn>
          <v-btn rounded="lg" size="large" class="text-none" style="background-color: var(--vio-purple-dark); color: #faf7f0" prepend-icon="mdi-share-variant-outline">Share</v-btn>
        </div>
      </v-container>
    </section>

    <section class="py-8">
      <v-container style="max-width: 900px">
        <v-card rounded="xl" class="pa-10 text-center elevation-2">
          <h2 class="font-display mb-4" style="color: var(--vio-purple); font-size: 1.9rem">Custom Orders</h2>
          <p class="mb-8" style="color: var(--vio-purple-dark); font-size: 1.05rem; line-height: 1.7">
            Need something special? We create bespoke gift packages tailored to your requirements.
            Contact us for custom pricing and personalization options.
          </p>

          <div class="d-flex flex-column ga-4 text-left">
            <div v-for="f in customFeatures" :key="f.title" class="d-flex ga-4 pa-4 rounded-lg" style="background-color: var(--vio-cream)">
              <div class="check-badge">✓</div>
              <div>
                <p class="font-display mb-1" style="color: var(--vio-purple)">{{ f.title }}</p>
                <p class="text-body-2 ma-0" style="color: var(--vio-purple-dark)">{{ f.desc }}</p>
              </div>
            </div>
          </div>

          <div class="mt-8 d-flex flex-column flex-sm-row ga-4 justify-center">
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" class="cta-purple">WhatsApp for Quote</a>
            <a href="https://instagram.com/viogiftstore" target="_blank" rel="noopener noreferrer" class="cta-plum">Contact via Instagram</a>
          </div>
        </v-card>
      </v-container>
    </section>

    <!-- Corporate packages -->
    <section class="py-8">
      <v-container style="max-width: 1100px">
        <h2 class="font-display text-center mb-8" style="color: var(--vio-purple); font-size: 1.9rem">Corporate Packages</h2>
        <v-card rounded="xl" class="overflow-hidden elevation-2">
          <div class="px-6 py-4" style="background-color: var(--vio-purple)">
            <v-row class="ma-0" dense>
              <v-col cols="5" class="font-display" style="color: #faf7f0">Package Type</v-col>
              <v-col cols="2" class="font-display" style="color: #faf7f0">Min. Order</v-col>
              <v-col cols="2" class="font-display" style="color: #faf7f0">Price / Unit</v-col>
              <v-col cols="3" class="font-display text-right" style="color: #faf7f0">Discount</v-col>
            </v-row>
          </div>
          <div v-for="(row, i) in corporateRows" :key="row.type" class="px-6 py-4" :style="{ backgroundColor: i % 2 === 0 ? 'var(--vio-cream)' : 'transparent' }">
            <v-row class="ma-0 align-center" dense>
              <v-col cols="5">
                <p class="font-display mb-0" style="color: var(--vio-purple)">{{ row.type }}</p>
                <p class="text-body-2 ma-0" style="color: var(--vio-purple-dark)">{{ row.desc }}</p>
              </v-col>
              <v-col cols="2" class="text-body-2" style="color: var(--vio-purple-dark)">{{ row.min }}</v-col>
              <v-col cols="2" class="font-display" style="color: var(--vio-purple)">{{ row.price }}</v-col>
              <v-col cols="3" class="font-display text-right" style="color: var(--vio-gold)">{{ row.discount }}</v-col>
            </v-row>
          </div>
        </v-card>
      </v-container>
    </section>

    <!-- Individual packages -->
    <section class="py-8" style="padding-bottom: 96px">
      <v-container style="max-width: 1100px">
        <h2 class="font-display text-center mb-8" style="color: var(--vio-purple); font-size: 1.9rem">Individual Gift Packages</h2>
        <v-card rounded="xl" class="overflow-hidden elevation-2">
          <div class="px-6 py-4" style="background-color: var(--vio-purple)">
            <v-row class="ma-0" dense>
              <v-col cols="5" class="font-display" style="color: #faf7f0">Package Name</v-col>
              <v-col cols="4" class="font-display" style="color: #faf7f0">Contents</v-col>
              <v-col cols="3" class="font-display text-right" style="color: #faf7f0">Price</v-col>
            </v-row>
          </div>
          <div v-for="(pkg, i) in individualPackages" :key="pkg.name" class="px-6 py-4" :style="{ backgroundColor: i % 2 === 0 ? 'var(--vio-cream)' : 'transparent' }">
            <v-row class="ma-0 align-center" dense>
              <v-col cols="5">
                <p class="font-display mb-0" style="color: var(--vio-purple)">{{ pkg.name }}</p>
                <p class="text-body-2 ma-0" style="color: var(--vio-purple-dark)">{{ pkg.theme }} Collection</p>
              </v-col>
              <v-col cols="4" class="text-body-2" style="color: var(--vio-purple-dark)">{{ pkg.contents }}</v-col>
              <v-col cols="3" class="font-display text-right" style="color: var(--vio-purple); font-size: 1.2rem">{{ pkg.price }}</v-col>
            </v-row>
          </div>
        </v-card>
      </v-container>
    </section>

    <footer class="py-12 text-center" style="background-color: var(--vio-purple)">
      <p class="font-display mb-4" style="color: #faf7f0; font-size: 1.6rem">VioGiftStore</p>
      <p class="mb-3" style="color: rgba(250,247,240,0.9)">All prices in USD. Shipping costs calculated at checkout.</p>
      <p class="text-body-2" style="color: rgba(250,247,240,0.8)">Thoughtful Gifting, Naturally Curated</p>
    </footer>
  </div>
</template>

<script setup>
import SimpleHeader from "@/components/SimpleHeader.vue";

const customFeatures = [
  { title: "Custom Product Selection", desc: "Choose your own combination of products" },
  { title: "Branded Packaging", desc: "Add your company logo and custom messaging" },
  { title: "Flexible Quantities", desc: "No minimum order for custom packages" },
];

const corporateRows = [
  { type: "Corporate Standard Box", desc: "Perfect for client appreciation", min: "25 units", price: "$75", discount: "10%" },
  { type: "Corporate Premium Box", desc: "Elevated gifting for VIP clients", min: "25 units", price: "$95", discount: "10%" },
  { type: "Corporate Luxury Box", desc: "Ultimate premium experience", min: "25 units", price: "$120", discount: "15%" },
  { type: "Bulk Orders (50+ units)", desc: "Special pricing for large orders", min: "50 units", price: "Custom", discount: "20%" },
  { type: "Bulk Orders (100+ units)", desc: "Maximum value pricing", min: "100 units", price: "Custom", discount: "25%" },
];

const individualPackages = [
  { name: "Sacred Serenity Box", theme: "Ramadan", contents: "Tea, Honey, Incense, Dates", price: "$85" },
  { name: "Blessed Ramadan Gift", theme: "Ramadan", contents: "Tea, Honey, Snacks, Prayer Mat", price: "$95" },
  { name: "Iftar Delights Package", theme: "Ramadan", contents: "Tea, Dates, Snacks, Honey", price: "$75" },
  { name: "Eid Celebration Box", theme: "Eid", contents: "Tea, Honey, Incense, Snacks", price: "$90" },
  { name: "Joyful Eid Collection", theme: "Eid", contents: "Premium Tea Set, Honey, Incense, Dates", price: "$105" },
  { name: "Friendship Wellness Box", theme: "Friendship", contents: "Tea, Snacks, Incense, Honey", price: "$70" },
  { name: "Mother's Serenity Package", theme: "Mum", contents: "Tea Collection, Honey, Aromatherapy, Spa", price: "$95" },
  { name: "Pamper Mum Box", theme: "Mum", contents: "Tea, Honey, Incense, Wellness Treats", price: "$85" },
  { name: "Dad's Wellness Collection", theme: "Dad", contents: "Coffee & Tea, Honey, Snacks, Grooming", price: "$90" },
  { name: "Husband's Luxury Box", theme: "Husband", contents: "Tea & Coffee, Honey, Protein Snacks", price: "$95" },
  { name: "Wife's Luxury Collection", theme: "Wife", contents: "Premium Tea, Honey, Aromatherapy", price: "$100" },
  { name: "Couples' Harmony Box", theme: "Couple", contents: "Tea for Two, Honey, Incense, Treats, Candles", price: "$120" },
  { name: "New Arrival Blessing Box", theme: "New Baby", contents: "Calming Tea, Honey, Wellness Snacks", price: "$85" },
];
</script>

<style scoped>
.check-badge {
  width: 32px; height: 32px; border-radius: 999px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  background-color: var(--vio-purple); color: #faf7f0;
}
.cta-purple {
  display: inline-flex; align-items: center; justify-content: center; padding: 12px 32px;
  border-radius: 16px; background-color: var(--vio-purple); color: #faf7f0;
}
.cta-plum {
  display: inline-flex; align-items: center; justify-content: center; padding: 12px 32px;
  border-radius: 16px; background-color: var(--vio-purple-dark); color: #faf7f0;
}
</style>
