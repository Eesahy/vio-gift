<template>
  <div class="min-h-screen bg-white">
    <SimpleHeader back-to="/" back-label="Back">
      <template #right><span style="width: 1px" /></template>
    </SimpleHeader>

    <!-- Hero -->
    <section class="py-16 vio-gradient text-center">
      <v-container style="max-width: 760px">
        <div class="hero-icon mx-auto mb-6">
          <v-icon icon="mdi-office-building-outline" size="32" color="white" />
        </div>
        <h2 class="font-display mb-4" style="color: #faf7f0; font-size: 2.75rem">Corporate Gifting</h2>
        <p style="color: rgba(250,247,240,0.85); font-size: 1.1rem">
          Impress clients, reward your team, and celebrate milestones with premium wellness gifts
          that make a lasting impression.
        </p>
        <v-row class="mt-8">
          <v-col v-for="[val, label] in stats" :key="label" cols="4">
            <p class="font-display mb-1" style="color: var(--vio-gold); font-size: 1.75rem">{{ val }}</p>
            <p class="text-caption" style="color: rgba(250,247,240,0.7)">{{ label }}</p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Tab toggle -->
    <section class="py-10" style="border-bottom: 1px solid rgba(143,90,168,0.15)">
      <v-container class="text-center">
        <div class="tab-toggle mx-auto" style="max-width: 400px">
          <button class="tab-btn" :class="{ active: activeView === 'premade' }" @click="activeView = 'premade'">Pre-made Gifts</button>
          <button class="tab-btn" :class="{ active: activeView === 'personalized' }" @click="activeView = 'personalized'">Personalized Order</button>
        </div>
      </v-container>
    </section>

    <!-- Pre-made gallery -->
    <section v-if="activeView === 'premade'" class="py-16">
      <v-container>
        <div class="text-center mb-12">
          <h3 class="font-display mb-3" style="color: var(--vio-purple); font-size: 2rem">Pre-made Corporate Gifts</h3>
          <p style="color: var(--vio-purple-dark)">Ready-to-order packages perfect for bulk corporate gifting</p>
        </div>

        <v-row style="max-width: 1100px; margin: 0 auto 64px">
          <v-col v-for="p in corporateProducts" :key="p.id" cols="12" md="4">
            <router-link :to="`/product/${p.id}`">
              <v-card rounded="xl" class="vio-card-hover" flat style="border: 1px solid rgba(143,90,168,0.15)">
                <div class="vio-img-zoom" style="overflow: hidden">
                  <v-img :src="p.image" :alt="p.name" cover :aspect-ratio="4 / 3" />
                </div>
                <div class="pa-6">
                  <div class="d-flex flex-wrap ga-1 mb-2">
                    <v-chip v-for="tag in p.tags" :key="tag" size="x-small" color="secondary" variant="tonal">{{ tag }}</v-chip>
                  </div>
                  <h4 class="font-display mb-2" style="color: var(--vio-purple); font-size: 1.3rem">{{ p.name }}</h4>
                  <p class="text-body-2 mb-3" style="color: var(--vio-purple-dark)">{{ p.description }}</p>
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex"><v-icon v-for="i in 5" :key="i" icon="mdi-star" size="14" color="gold" /></div>
                    <p class="font-display mb-0" style="color: var(--vio-purple); font-size: 1.3rem">from ₦{{ p.price }}</p>
                  </div>
                </div>
              </v-card>
            </router-link>
          </v-col>
        </v-row>

        <!-- Pricing tiers -->
        <div style="max-width: 1100px; margin: 0 auto">
          <h3 class="font-display text-center mb-8" style="color: var(--vio-purple); font-size: 1.75rem">Corporate Pricing Tiers</h3>
          <v-row>
            <v-col v-for="(tier, i) in tiers" :key="tier.name" cols="12" md="4">
              <v-card
                rounded="xl" class="pa-8 text-center h-100" flat
                :style="{ border: i === 1 ? '2px solid var(--vio-purple)' : '1px solid rgba(143,90,168,0.2)', boxShadow: i === 1 ? '0 8px 32px rgba(143,90,168,0.15)' : 'none' }"
              >
                <v-chip v-if="i === 1" color="secondary" size="small" class="text-white mb-4">Most Popular</v-chip>
                <h4 class="font-display mb-1" style="color: var(--vio-purple); font-size: 1.5rem">{{ tier.name }}</h4>
                <p class="font-display mb-2" style="color: var(--vio-gold); font-size: 1.75rem">{{ tier.price }}</p>
                <p class="text-caption mb-6" style="color: var(--vio-purple-dark)">Minimum {{ tier.minQty }} units</p>
                <ul class="tier-list mb-6">
                  <li v-for="f in tier.features" :key="f">
                    <v-icon icon="mdi-check" size="16" color="primary" class="mr-2" />{{ f }}
                  </li>
                </ul>
                <v-btn block rounded="lg" class="text-none" :color="i === 1 ? 'primary' : undefined" :variant="i === 1 ? 'flat' : 'outlined'" @click="activeView = 'personalized'">
                  Get a Quote
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!-- Personalized order form -->
    <section v-else class="py-16">
      <v-container style="max-width: 760px">
        <div v-if="formSent" class="text-center py-16 vio-fade-in">
          <div class="hero-icon mx-auto mb-6" style="background-color: var(--vio-purple)">
            <v-icon icon="mdi-send-outline" size="36" color="white" />
          </div>
          <h4 class="font-display mb-3" style="color: var(--vio-purple); font-size: 2rem">Enquiry Sent!</h4>
          <p class="mb-6" style="color: var(--vio-purple-dark)">
            Thank you for your enquiry. Our corporate team will be in touch within 24 hours.
          </p>
          <router-link to="/" class="pill-btn">Back to Home</router-link>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="d-flex flex-column ga-6">
          <div class="text-center mb-2">
            <h3 class="font-display mb-3" style="color: var(--vio-purple); font-size: 2rem">Personalized Corporate Order</h3>
            <p style="color: var(--vio-purple-dark)">Tell us about your requirements and we'll create a bespoke gifting solution for you.</p>
          </div>

          <v-card rounded="xl" class="pa-8" flat style="border: 1px solid rgba(143,90,168,0.15)">
            <h4 class="font-display mb-5 d-flex align-center ga-2" style="color: var(--vio-purple)">
              <v-icon icon="mdi-office-building-outline" />Company Information
            </h4>
            <v-row dense>
              <v-col cols="12" sm="6"><v-text-field v-model="form.companyName" label="Company Name *" placeholder="Acme Corp" required /></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="form.contactName" label="Contact Name *" placeholder="Jane Smith" required /></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="form.email" type="email" label="Email *" placeholder="jane@acme.com" required /></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="form.phone" type="tel" label="Phone" placeholder="+44 7XXX XXXXXX" /></v-col>
            </v-row>
          </v-card>

          <v-card rounded="xl" class="pa-8" flat style="border: 1px solid rgba(143,90,168,0.15)">
            <h4 class="font-display mb-5 d-flex align-center ga-2" style="color: var(--vio-purple)">
              <v-icon icon="mdi-package-variant-closed" />Order Requirements
            </h4>
            <v-row dense>
              <v-col cols="12" sm="6"><v-text-field v-model="form.quantity" type="number" min="1" label="Quantity Needed *" placeholder="e.g. 50" required /></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="form.budget" label="Budget per Unit" placeholder="e.g. ₦80–₦100" /></v-col>
              <v-col cols="12">
                <v-select v-model="form.occasion" :items="occasions" label="Occasion / Purpose" />
              </v-col>
              <v-col cols="12">
                <p class="text-body-2 mb-2" style="color: var(--vio-purple-dark)">Package Tier Preference</p>
                <div class="d-flex ga-3 flex-wrap">
                  <v-btn
                    v-for="tier in tiers" :key="tier.name" variant="outlined" rounded="pill" size="small"
                    :color="form.tier === tier.name ? 'primary' : undefined" @click="form.tier = tier.name"
                  >
                    {{ tier.name }} ({{ tier.price }})
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="form.requirements" rows="4" label="Additional Requirements" placeholder="Tell us about branding needs, dietary requirements, delivery timeline, or anything else..." />
              </v-col>
            </v-row>
          </v-card>

          <v-btn type="submit" size="x-large" color="primary" rounded="lg" class="text-none" prepend-icon="mdi-account-group-outline">
            Submit Corporate Enquiry
          </v-btn>
        </form>
      </v-container>
    </section>

    <SimpleFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import SimpleHeader from "@/components/SimpleHeader.vue";
import SimpleFooter from "@/components/SimpleFooter.vue";
import { allProducts } from "@/data/products";
import { useAdminStore } from "@/store/admin";

const corporateProducts = allProducts.filter((p) => p.category === "corporate");

const stats = [
  ["500+", "Corporate Orders"],
  ["48h", "Turnaround"],
  ["100%", "Satisfaction"],
];

const tiers = [
  { name: "Standard", minQty: 10, price: "₦65/unit", features: ["Branded tissue paper", "Thank you card", "Standard box"] },
  { name: "Premium", minQty: 25, price: "₦95/unit", features: ["Custom ribbon", "Branded card", "Premium box", "Logo sticker"] },
  { name: "Luxury", minQty: 50, price: "₦130/unit", features: ["Full branded packaging", "Personalised card", "Luxury box", "Gold ribbon", "Handwritten note"] },
];

const occasions = ["Client Appreciation", "Staff Gifts", "Conference Giveaways", "Eid / Ramadan", "Christmas", "Product Launch", "Team Building", "Other"];

const activeView = ref("premade");
const formSent = ref(false);
const form = reactive({
  companyName: "", contactName: "", email: "", phone: "",
  quantity: "", budget: "", occasion: "", requirements: "", tier: "",
});

const admin = useAdminStore();

function handleSubmit() {
  admin.recordEnquiry({ ...form, quantity: Number(form.quantity) || 0 });
  formSent.value = true;
}
</script>

<style scoped>
.hero-icon {
  width: 64px; height: 64px; border-radius: 999px; display: flex; align-items: center; justify-content: center;
  background-color: rgba(250,247,240,0.15);
}
.tab-toggle { display: flex; border-radius: 16px; overflow: hidden; border: 1px solid rgba(143,90,168,0.25); }
.tab-btn { flex: 1; padding: 12px; font-size: 0.9rem; background: white; color: var(--vio-purple); border: none; cursor: pointer; transition: all 0.2s; }
.tab-btn.active { background-color: var(--vio-purple); color: #faf7f0; }
.tier-list { list-style: none; padding: 0; margin: 0; text-align: left; display: flex; flex-direction: column; gap: 8px; }
.tier-list li { display: flex; align-items: center; font-size: 0.9rem; color: var(--vio-purple-dark); }
.pill-btn {
  display: inline-flex; align-items: center; padding: 12px 32px; border-radius: 16px;
  background-color: var(--vio-purple); color: var(--vio-cream);
}
</style>
