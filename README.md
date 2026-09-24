# VioGiftStore — Vue 3 + Vuetify Platform

A full conversion of the original **React + TypeScript + Tailwind/shadcn** VioGiftStore
prototype into a clean, production-ready **Vue 3 + Vuetify 3** application, built with Vite.

---

## 1. Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

> This project was authored in a sandboxed environment with no network access, so the
> dependency tree could **not** be installed or build-verified here. Everything has been
> carefully hand-checked (import paths, tag balance, bracket balance, route targets, prop
> typing) but you should treat the first `npm install && npm run dev` as the real
> smoke test, and file an issue/ping me with any error output so it can be fixed quickly.

## 2. Tech stack

| Concern | Choice |
|---|---|
| Framework | Vue 3 (`<script setup>` Composition API) |
| UI library | Vuetify 3 (Material Design components, theming, grid) |
| Routing | vue-router 4 |
| State | Pinia (cart store, backed by `sessionStorage` — same persistence model as the original) |
| Build tool | Vite |
| Icons | Material Design Icons (`@mdi/font`) — mapped 1:1 from the original `lucide-react` icon set |
| Fonts | Belleza (display/headings) + Poppins (body) — loaded via Google Fonts, matching the original |

## 3. Project structure

```
src/
├── App.vue                 # Root shell (mirrors Root.tsx)
├── main.js                 # App bootstrap: Pinia + Router + Vuetify
├── plugins/
│   └── vuetify.js          # Custom "vioTheme" — brand colors + component defaults
├── router/
│   └── index.js            # All routes, lazy-loaded views
├── store/
│   └── cart.js             # Pinia cart store (sessionStorage-backed, matches original logic)
├── data/
│   └── products.js         # Product catalogue, theme/occasion cards (ported 1:1 from products.ts)
├── assets/styles/
│   └── theme.css           # CSS variables + brand utility classes
├── components/
│   ├── SimpleHeader.vue    # Shared back-link + centered logo header (light/purple variants)
│   ├── SimpleFooter.vue    # Shared compact footer for inner pages
│   ├── ProductCard.vue     # Reusable product card (grid, catalogue, corporate, related items)
│   ├── ProductLabel.vue    # Brand asset: product label design (rect/square/circle)
│   └── ComingSoonFlier.vue # Brand asset: Instagram post/story flier
└── views/
    ├── Landing.vue          # Homepage — hero, feature cards, theme/occasion grids, reviews
    ├── Products.vue         # Theme-filtered product listing with sort/filter
    ├── ProductDetail.vue    # Single product page, gallery, related products, add-to-cart
    ├── Cart.vue             # Cart, quantity controls, upsells, gift extras, order note
    ├── Checkout.vue         # Delivery/pickup, contact + payment form, order summary
    ├── OrderComplete.vue    # Invoice / confirmation page
    ├── Corporate.vue        # Corporate gifting: pre-made gallery, tiers, enquiry form
    ├── Catalogue.vue        # Full catalogue: search, categories, "build your bundle"
    ├── PriceList.vue        # Pricing sheet (corporate tiers + individual packages)
    ├── DesignHub.vue        # Brand assets / design system showcase
    └── NotFound.vue         # 404 fallback
```

## 4. Routes

Identical to the original `routes.ts`:

| Path | View |
|---|---|
| `/` | Landing |
| `/products/:theme` | Products |
| `/product/:id` | ProductDetail |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/order-complete` | OrderComplete |
| `/corporate` | Corporate |
| `/catalogue` | Catalogue |
| `/price-list` | PriceList |
| `/design-hub` | DesignHub |
| `*` | NotFound |

## 5. What was intentionally left out

The source repo contained three page files (`CustomerDetails.tsx`, `Payment.tsx`,
`ProjectSummary.tsx`, ~930 lines combined) that were **not wired into `routes.ts`** in the
original app — the live checkout flow uses the single all-in-one `Checkout.tsx` instead.
Since they were unreachable dead code in the source, they were not ported. Let me know if
you actually want a multi-step checkout (separate customer-details → payment steps) and I
can build that out as an alternate flow.

## 6. Design fidelity notes

- All brand colors, the Belleza/Poppins font pairing, rounded-pill buttons, card hover-lift
  and image-zoom effects, and section backgrounds (cream / purple gradient) are reproduced
  via CSS variables and utility classes in `theme.css`, matching the Tailwind tokens used in
  the original `theme.css`/inline styles.
- Layout uses Vuetify's `v-container` / `v-row` / `v-col` grid in place of Tailwind's flex/grid
  utilities, with the same breakpoints and proportions as the original.
- Cards, buttons, inputs, chips, and other interactive elements use real Vuetify components
  (not just styled `div`s) so you get proper accessibility, keyboard support, and ripple/focus
  states out of the box — while still being skinned to match the original pixel-for-pixel design
  intent as closely as Vuetify's component model allows.
- The cart persists to `sessionStorage` under the same keys (`cart`, `orderNote`, `cartTotal`,
  `giftingOptions`, `orderDetails`) as the original React app.

## 7. Known gaps / next steps

- **Not yet build-verified** (see note above) — run `npm install && npm run dev` first.
- Corporate enquiry form and checkout "payment" are front-end only (no real backend/payment
  gateway), same as the original prototype.
- Product images are hot-linked to the original Unsplash URLs from the source data — swap in
  your own CDN assets for production.
- Consider adding form validation libraries (e.g. `vuelidate`) if you want stricter checkout
  validation than the current hand-rolled checks in `Checkout.vue`.
