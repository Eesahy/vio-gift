<template>
  <div class="min-h-screen bg-white">
    <!-- HEADER -->
    <header class="header-sticky bg-white" style="border-bottom: 1px solid rgba(143,90,168,0.15)">
      <v-container>
        <div class="d-flex align-center justify-space-between" style="height: 80px">
          <div class="d-flex align-center ga-8">
            <router-link to="/" class="d-flex align-center" aria-label="VioGiftStore — home">
              <span class="logo-badge">
                <img src="/logo.jpg" alt="VioGiftStore" />
              </span>
            </router-link>

            <nav class="d-none d-md-flex align-center ga-6">
              <router-link to="/catalogue" class="nav-link">Shop All</router-link>
              <router-link to="/corporate" class="nav-link">Corporate</router-link>
              <router-link to="/price-list" class="nav-link">Custom Orders</router-link>
            </nav>
          </div>

          <div class="d-none d-md-flex align-center ga-4">
            <router-link to="/cart" class="icon-link" aria-label="Cart">
              <v-icon icon="mdi-shopping-outline" size="22" />
            </router-link>
            <router-link to="/checkout" class="login-btn">
              <v-icon icon="mdi-account-outline" size="18" class="mr-2" />
              Login
            </router-link>
            <router-link to="/checkout" class="register-btn">Register</router-link>
          </div>

          <v-btn
            icon
            variant="text"
            class="d-md-none"
            style="color: var(--vio-purple)"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <v-icon :icon="mobileMenuOpen ? 'mdi-close' : 'mdi-menu'" />
          </v-btn>
        </div>
      </v-container>

      <v-expand-transition>
        <div v-if="mobileMenuOpen" class="d-md-none bg-white px-4 py-6" style="border-top: 1px solid rgba(143,90,168,0.15)">
          <router-link
            v-for="item in mobileLinks"
            :key="item.to"
            :to="item.to"
            class="d-block py-2 text-body-1 mobile-link"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </router-link>
          <div class="d-flex ga-3 pt-2">
            <router-link to="/checkout" class="flex-1 text-center py-2 login-btn" style="flex: 1">Login</router-link>
            <router-link to="/checkout" class="flex-1 text-center py-2 register-btn" style="flex: 1">Register</router-link>
          </div>
        </div>
      </v-expand-transition>
    </header>

    <!-- HERO -->
    <section class="vio-hero-bg" style="padding: 96px 0 128px">
      <v-container class="text-center" style="max-width: 900px">
        <div class="vio-fade-in">
          <div class="d-flex align-center justify-center ga-2 mb-6">
            <v-icon icon="mdi-creation" size="16" color="gold" />
            <span class="text-caption text-uppercase" style="letter-spacing: 0.15em; color: var(--vio-gold)">
              Premium Sustainable Gifting
            </span>
            <v-icon icon="mdi-creation" size="16" color="gold" />
          </div>

          <h2 class="font-display hero-title mb-6" style="color: var(--vio-purple)">
            Turning Simple Moments<br />into Beautiful Memories
          </h2>

          <p class="mb-10 mx-auto" style="max-width: 640px; font-size: 1.15rem; line-height: 1.7; color: var(--vio-gold)">
            View our range of items featuring premium wellness products like our herbal tea,
            organic honey, artisanal incense, and healthy snacks. Each package curated with care
            for those who matter the most.
          </p>

          <div class="d-flex flex-column flex-sm-row justify-center ga-4">
            <a href="#themes" class="hero-btn-solid">
              <v-icon icon="mdi-gift-outline" size="20" class="mr-2" />
              Shop Now
            </a>
            <a href="#build" class="hero-btn-outline">
              Build Your Box
              <v-icon icon="mdi-chevron-right" size="18" class="ml-1" />
            </a>
          </div>
        </div>
      </v-container>
    </section>

    <!-- FEATURE CARDS -->
    <section id="build" class="py-16" style="background-color: var(--vio-cream)">
      <v-container style="max-width: 1100px">
        <v-row>
          <v-col cols="12" md="6">
            <router-link to="/catalogue">
              <v-card class="feature-card vio-gradient" height="320" rounded="xl" flat>
                <v-img
                  src="https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                  cover
                  height="100%"
                  class="feature-card-img"
                  style="opacity: 0.22"
                />
                <div class="feature-card-content">
                  <v-chip color="secondary" size="small" class="text-white mb-4" prepend-icon="mdi-creation">
                    Most Popular
                  </v-chip>
                  <h3 class="font-display mb-2" style="color: #faf7f0; font-size: 2rem">Ready-to-Gift Bundles</h3>
                  <p class="text-body-2 mb-4" style="color: rgba(250,247,240,0.85)">
                    Love, Thoughtfulness &amp; a Little Surprise in Every Box
                  </p>
                  <div class="d-flex align-center ga-2" style="color: var(--vio-gold)">
                    <span class="text-body-2 font-weight-medium">Shop Bundles</span>
                    <v-icon icon="mdi-arrow-right" size="16" />
                  </div>
                </div>
              </v-card>
            </router-link>
          </v-col>

          <v-col cols="12" md="6">
            <router-link to="/price-list">
              <v-card class="feature-card bg-white" height="320" rounded="xl" border flat style="border-color: rgba(143,90,168,0.25) !important">
                <v-img
                  src="https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                  cover
                  height="100%"
                  class="feature-card-img"
                  style="opacity: 0.12"
                />
                <div class="feature-card-content">
                  <h3 class="font-display mb-2" style="color: var(--vio-purple); font-size: 2rem">
                    Create Your Own Gift Box
                  </h3>
                  <p class="text-body-2 mb-4" style="color: var(--vio-purple-dark)">Little boxes of love &amp; joy</p>
                  <div class="d-flex flex-wrap align-center ga-3 mb-4">
                    <div v-for="(step, i) in ['Login', 'Choose Products', 'Checkout']" :key="step" class="d-flex align-center ga-2">
                      <span class="step-badge">{{ i + 1 }}</span>
                      <span class="text-caption" style="color: var(--vio-purple-dark)">{{ step }}</span>
                      <v-icon v-if="i < 2" icon="mdi-arrow-right" size="12" color="secondary" />
                    </div>
                  </div>
                  <div class="d-flex align-center ga-2" style="color: var(--vio-gold)">
                    <span class="text-body-2 font-weight-medium">Start Building</span>
                    <v-icon icon="mdi-arrow-right" size="16" />
                  </div>
                </div>
              </v-card>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CHOOSE YOUR THEME -->
    <section id="themes" class="py-16 bg-white">
      <v-container>
        <div class="text-center mb-12">
          <h3 class="font-display mb-3" style="color: var(--vio-purple); font-size: 2.75rem">Choose Your Theme</h3>
          <p style="font-size: 1.1rem; color: var(--vio-gold)">Curated collections for every cherished relationship</p>
        </div>

        <v-row dense>
          <v-col v-for="theme in themeCards" :key="theme.id" cols="6" sm="4" lg="3" xl="2">
            <router-link :to="`/products/${theme.id}`">
              <v-card class="vio-card-hover" rounded="lg" border flat style="border-color: rgba(143,90,168,0.18) !important">
                <div class="vio-img-zoom" style="overflow: hidden">
                  <v-img :src="theme.image" :alt="theme.name" cover :aspect-ratio="1" />
                </div>
                <div class="pa-3 text-center">
                  <p class="font-display mb-0" style="color: var(--vio-purple)">{{ theme.name }}</p>
                  <p class="text-caption" style="color: var(--vio-gold)">{{ theme.description }}</p>
                </div>
              </v-card>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CHOOSE YOUR OCCASION -->
    <section class="py-16" style="background-color: var(--vio-cream)">
      <v-container>
        <div class="text-center mb-12">
          <div class="d-flex align-center justify-center ga-3 mb-3">
            <v-icon icon="mdi-creation" size="20" color="gold" />
            <h3 class="font-display" style="color: var(--vio-purple); font-size: 2.75rem">Choose Your Occasion</h3>
            <v-icon icon="mdi-creation" size="20" color="gold" />
          </div>
          <p class="font-italic" style="font-size: 1.1rem; color: var(--vio-gold)">
            Sacred celebrations deserving of thoughtful, meaningful gifts
          </p>
        </div>

        <v-row dense style="max-width: 1200px; margin: 0 auto">
          <v-col v-for="occ in occasionCards" :key="occ.id" cols="6" sm="4" lg="2" style="flex-grow: 0">
            <router-link :to="`/products/${occ.id}`">
              <v-card class="vio-card-hover" rounded="lg" border flat style="border-color: rgba(217,180,232,0.7) !important">
                <div class="vio-img-zoom" style="overflow: hidden">
                  <v-img :src="occ.image" :alt="occ.name" cover :aspect-ratio="4 / 3" />
                </div>
                <div class="pa-3 text-center">
                  <p class="font-display mb-0" style="color: var(--vio-purple)">{{ occ.name }}</p>
                  <p class="text-caption" style="color: var(--vio-gold)">{{ occ.description }}</p>
                </div>
              </v-card>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- WHY VIOGIFTSTORE -->
    <section class="py-16 bg-white">
      <v-container>
        <div class="text-center mb-12">
          <h3 class="font-display" style="color: var(--vio-purple); font-size: 2.25rem">Why Choose VioGiftStore?</h3>
        </div>
        <v-row style="max-width: 1000px; margin: 0 auto">
          <v-col v-for="item in whyUs" :key="item.title" cols="12" md="4">
            <div class="text-center pa-8 rounded-xl h-100" style="background-color: var(--vio-cream)">
              <div class="why-icon mx-auto mb-5">
                <v-icon :icon="item.icon" size="30" color="white" />
              </div>
              <h4 class="font-display mb-2" style="color: var(--vio-purple); font-size: 1.3rem">{{ item.title }}</h4>
              <p class="text-body-2" style="color: var(--vio-gold); line-height: 1.6">{{ item.desc }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- REVIEWS -->
    <section class="py-16" style="background-color: var(--vio-cream)">
      <v-container>
        <div class="text-center mb-12">
          <h3 class="font-display mb-3" style="color: var(--vio-purple); font-size: 2.25rem">What Our Customers Say</h3>
          <div class="d-flex justify-center ga-1 mb-2">
            <v-icon v-for="i in 5" :key="i" icon="mdi-star" size="20" color="gold" />
          </div>
          <p class="text-body-2" style="color: var(--vio-gold)">Rated 5 stars by hundreds of happy customers</p>
        </div>

        <v-row style="max-width: 1200px; margin: 0 auto">
          <v-col v-for="review in reviews" :key="review.name" cols="12" md="6" lg="4">
            <v-card class="pa-6 h-100" rounded="lg" flat style="border: 1px solid rgba(143,90,168,0.15)">
              <div class="d-flex ga-1 mb-3">
                <v-icon v-for="i in review.rating" :key="i" icon="mdi-star" size="16" color="gold" />
              </div>
              <p class="text-body-2 mb-4" style="color: var(--vio-purple-dark); line-height: 1.6">"{{ review.text }}"</p>
              <div class="d-flex align-center ga-3">
                <v-avatar color="primary" size="36">
                  <span class="font-display" style="color: #faf7f0">{{ review.name[0] }}</span>
                </v-avatar>
                <div>
                  <p class="font-display mb-0" style="color: var(--vio-purple)">{{ review.name }}</p>
                  <p class="text-caption ma-0" style="color: var(--vio-text-muted)">{{ review.location }}</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- FOOTER -->
    <footer style="background-color: var(--vio-purple)">
      <v-container class="py-16">
        <v-row class="mb-8">
          <v-col cols="12" md="6">
            <span class="logo-badge logo-badge--footer mb-4">
              <img src="/logo.jpg" alt="VioGiftStore" />
            </span>
            <p class="text-body-2 mb-6" style="color: rgba(250,247,240,0.8); line-height: 1.7; max-width: 480px">
              Premium sustainable gifting featuring herbal tea, organic honey, artisanal incense,
              and healthy snacks. Turning simple moments into beautiful memories.
            </p>
            <div class="d-flex ga-4">
              <a href="https://instagram.com/viogiftstore" target="_blank" rel="noopener noreferrer" class="footer-social">
                <v-icon icon="mdi-instagram" size="20" />
                <span class="text-body-2">@viogiftstore</span>
              </a>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" class="footer-social">
                <v-icon icon="mdi-whatsapp" size="20" />
                <span class="text-body-2">WhatsApp</span>
              </a>
            </div>
          </v-col>

          <v-col cols="6" md="3">
            <h5 class="font-display mb-4" style="color: #faf7f0">Quick Links</h5>
            <ul class="footer-list">
              <li><router-link to="/catalogue">Shop All</router-link></li>
              <li><router-link to="/corporate">Corporate Gifting</router-link></li>
              <li><router-link to="/price-list">Custom Orders</router-link></li>
              <li><router-link to="/catalogue">Digital Catalogue</router-link></li>
            </ul>
          </v-col>

          <v-col cols="6" md="3">
            <h5 class="font-display mb-4" style="color: #faf7f0">Legal</h5>
            <ul class="footer-list">
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </v-col>
        </v-row>

        <div class="text-center text-body-2 pt-8" style="border-top: 1px solid rgba(250,247,240,0.2); color: rgba(250,247,240,0.7)">
          © 2026 VioGiftStore. All rights reserved. Thoughtful Gifting, Naturally Curated.
        </div>
      </v-container>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { themeCards, occasionCards } from "@/data/products";

const mobileMenuOpen = ref(false);

const mobileLinks = [
  { to: "/catalogue", label: "Shop All" },
  { to: "/corporate", label: "Corporate" },
  { to: "/price-list", label: "Custom Orders" },
  { to: "/cart", label: "Cart" },
];

const whyUs = [
  { icon: "mdi-gift-outline", title: "Premium Quality", desc: "Handpicked sustainable products from trusted artisans and wellness brands." },
  { icon: "mdi-heart-outline", title: "Thoughtfully Curated", desc: "Each gift box designed with intention, care, and attention to every detail." },
  { icon: "mdi-package-variant-closed", title: "Ready in 3 Hours", desc: "Pickup and delivery available. Most orders ready in as little as 3 hours." },
];

const reviews = [
  { name: "Sarah M.", rating: 5, text: "Absolutely stunning packaging and the quality of the products inside was exceptional. My mum cried happy tears!", location: "London" },
  { name: "Fatima A.", rating: 5, text: "Ordered the Ramadan box for my family — it arrived beautifully wrapped and felt so thoughtful. Will definitely order again.", location: "Birmingham" },
  { name: "James O.", rating: 5, text: "Used VioGiftStore for our corporate gifting and the feedback from clients was incredible. Professional and luxurious.", location: "Manchester" },
  { name: "Amira H.", rating: 5, text: "The Eid collection is perfect. Every product inside is high quality and the presentation is simply beautiful.", location: "Leeds" },
  { name: "Rachel T.", rating: 5, text: "Sent the Wife collection to my sister for her birthday and she loved every single item. Highly recommend!", location: "Bristol" },
  { name: "David K.", rating: 5, text: "Fast delivery, gorgeous box, premium contents. VioGiftStore never disappoints. My go-to for all occasions.", location: "Edinburgh" },
];
</script>

<style scoped>
.header-sticky { position: sticky; top: 0; z-index: 50; }
.logo-badge {
  display: flex; align-items: center; justify-content: center;
  width: 60px; height: 60px; border-radius: 999px; background: #fff;
  box-shadow: 0 2px 10px rgba(46, 27, 48, 0.18); overflow: hidden;
}
.logo-badge img { width: 84%; height: 84%; object-fit: contain; }
.logo-badge--footer { width: 84px; height: 84px; }
.nav-link { color: var(--vio-gold); font-size: 0.9rem; transition: opacity 0.2s; }
.nav-link:hover { opacity: 0.7; }
.icon-link { color: var(--vio-purple); transition: opacity 0.2s; }
.icon-link:hover { opacity: 0.7; }
.mobile-link { color: var(--vio-gold); border-bottom: 1px solid rgba(143,90,168,0.1); }
.login-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 8px 18px; border-radius: 999px; font-size: 0.875rem;
  border: 1px solid var(--vio-purple); color: var(--vio-purple);
  transition: box-shadow 0.2s;
}
.login-btn:hover { box-shadow: 0 2px 8px rgba(143,90,168,0.2); }
.register-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 9px 18px; border-radius: 999px; font-size: 0.875rem;
  background-color: var(--vio-purple); color: var(--vio-cream);
  transition: opacity 0.2s;
}
.register-btn:hover { opacity: 0.9; }

.hero-title {
  color: var(--vio-purple);
  font-size: clamp(2.25rem, 6vw, 4.5rem);
  line-height: 1.15;
}
.hero-btn-solid {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 16px 40px; border-radius: 999px; font-size: 1rem;
  font-family: "Belleza", serif; background-color: var(--vio-purple); color: var(--vio-cream);
  box-shadow: 0 4px 14px rgba(143,90,168,0.35); transition: transform 0.2s, box-shadow 0.2s;
}
.hero-btn-solid:hover { transform: scale(1.03); box-shadow: 0 6px 20px rgba(143,90,168,0.4); }
.hero-btn-outline {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 16px 40px; border-radius: 999px; font-size: 1rem;
  font-family: "Belleza", serif; border: 2px solid var(--vio-purple); color: var(--vio-purple);
  transition: transform 0.2s;
}
.hero-btn-outline:hover { transform: scale(1.03); }

.feature-card { position: relative; overflow: hidden; cursor: pointer; }
.feature-card-img { position: absolute; inset: 0; }
.feature-card-content {
  position: relative; z-index: 2; height: 100%;
  display: flex; flex-direction: column; justify-content: flex-end; padding: 32px;
}
.step-badge {
  width: 20px; height: 20px; border-radius: 999px; display: inline-flex;
  align-items: center; justify-content: center; font-size: 11px;
  background-color: var(--vio-purple); color: var(--vio-cream);
}
.why-icon {
  width: 64px; height: 64px; border-radius: 999px; display: flex;
  align-items: center; justify-content: center; background-color: var(--vio-purple);
}
.footer-social {
  display: inline-flex; align-items: center; gap: 8px; color: #faf7f0; transition: opacity 0.2s;
}
.footer-social:hover { opacity: 0.7; }
.footer-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.footer-list a { color: rgba(250,247,240,0.8); font-size: 0.875rem; transition: opacity 0.2s; }
.footer-list a:hover { opacity: 0.7; }
</style>
