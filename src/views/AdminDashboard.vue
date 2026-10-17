<template>
  <div class="admin-page">
    <!-- Top bar -->
    <header class="admin-bar">
      <v-container class="d-flex align-center ga-3 py-3" fluid style="max-width: 1440px">
        <span class="logo-badge"><img src="/logo.jpg" alt="VioGiftStore" /></span>
        <div>
          <p class="font-display ma-0 bar-title">Admin Dashboard</p>
          <p class="ma-0 bar-sub">VioGiftStore platform overview</p>
        </div>
        <v-spacer />
        <v-btn to="/" variant="outlined" color="#faf7f0" size="small" class="text-none" prepend-icon="mdi-storefront-outline">
          View store
        </v-btn>
      </v-container>
    </header>

    <v-container fluid class="py-6" style="max-width: 1440px">
      <v-alert
        v-if="admin.hasSampleData"
        type="info"
        variant="tonal"
        density="compact"
        class="mb-6"
        icon="mdi-flask-outline"
      >
        Showing <strong>sample data</strong> alongside real orders so the dashboard has something to display.
        Real checkouts and corporate enquiries are recorded automatically.
        <template #append>
          <v-btn size="small" variant="text" class="text-none" @click="admin.clearSampleData()">Clear sample data</v-btn>
        </template>
      </v-alert>

      <!-- Filters: one row above everything they affect -->
      <div class="d-flex align-center flex-wrap ga-3 mb-6">
        <h1 class="font-display ma-0 page-title">Overview</h1>
        <v-spacer />
        <v-btn-toggle v-model="rangeDays" mandatory density="compact" rounded="lg" color="primary" variant="outlined" divided>
          <v-btn v-for="r in ranges" :key="r.value" :value="r.value" class="text-none" rounded="0">{{ r.label }}</v-btn>
        </v-btn-toggle>
      </div>

      <!-- KPI tiles -->
      <v-row dense class="mb-4">
        <v-col v-for="k in kpis" :key="k.label" cols="6" md="3">
          <v-card rounded="xl" class="kpi pa-5 h-100" elevation="0">
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon :icon="k.icon" size="18" color="primary" />
              <span class="kpi-label">{{ k.label }}</span>
            </div>
            <p class="kpi-value ma-0">{{ k.value }}</p>
            <p v-if="k.delta !== undefined" class="kpi-delta ma-0 mt-1" :class="k.delta >= 0 ? 'up' : 'down'">
              <v-icon :icon="k.delta >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'" size="14" />
              {{ Math.abs(k.delta).toFixed(0) }}% vs previous {{ rangeDays }} days
            </p>
            <p v-else-if="k.note" class="kpi-note ma-0 mt-1">{{ k.note }}</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Revenue trend -->
      <v-card rounded="xl" class="panel pa-6 mb-4" elevation="0">
        <div class="d-flex align-baseline flex-wrap ga-2 mb-4">
          <h2 class="font-display panel-title ma-0">Revenue per day</h2>
          <span class="panel-sub">Excludes cancelled orders · hover for daily detail</span>
        </div>
        <TrendChart
          v-if="trend.length"
          :points="trend"
          :format="naira"
          :format-axis="nairaShort"
          aria-label="Daily revenue for the selected period"
        />
        <p v-else class="empty">No orders in this period yet.</p>
      </v-card>

      <!-- Bookings -->
      <v-row dense class="mb-4">
        <v-col cols="12" lg="7">
          <v-card rounded="xl" class="panel pa-6 h-100" elevation="0">
            <div class="d-flex align-center flex-wrap ga-2 mb-1">
              <h2 class="font-display panel-title ma-0">Upcoming bookings</h2>
              <v-spacer />
              <v-btn size="small" variant="text" color="primary" class="text-none" append-icon="mdi-arrow-right" @click="showOrders('booked')">
                All bookings
              </v-btn>
            </div>
            <p class="panel-sub mb-4">Gifts booked for a date, soonest first</p>

            <div v-if="upcomingBookings.length" class="d-flex flex-column">
              <div v-for="o in upcomingBookings.slice(0, 6)" :key="o.orderNumber" class="booking-row d-flex align-center ga-4 py-3">
                <div class="date-block">
                  <span class="date-month">{{ formatDateKey(o.scheduledFor, { month: "short" }) }}</span>
                  <span class="date-day">{{ formatDateKey(o.scheduledFor, { day: "numeric" }) }}</span>
                </div>
                <div class="flex-grow-1" style="min-width: 0">
                  <div class="bar-name">{{ o.customer.name }} · {{ o.orderNumber }}</div>
                  <div class="cell-sub">
                    {{ relativeDay(o.scheduledFor) }} · {{ o.fulfillmentMethod }}{{ o.scheduledTime ? ` at ${o.scheduledTime}` : "" }}
                    · {{ unitsIn(o) }} item{{ unitsIn(o) === 1 ? "" : "s" }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="bar-value">{{ naira(o.total) }}</div>
                  <PaymentChip :state="paymentState(o)" />
                </div>
              </div>
            </div>
            <p v-else class="empty py-6">No upcoming bookings.</p>
          </v-card>
        </v-col>

        <v-col cols="12" lg="5">
          <v-card rounded="xl" class="panel pa-6 h-100" elevation="0">
            <h2 class="font-display panel-title mb-1">Bookings, next 14 days</h2>
            <p class="panel-sub mb-5">Gifts due out per day · hover for detail</p>
            <div class="day-chart" role="img" aria-label="Number of booked gifts per day for the next 14 days">
              <v-tooltip v-for="d in bookingDays" :key="d.key" location="top">
                <template #activator="{ props: tp }">
                  <div v-bind="tp" class="day-col">
                    <span class="day-count">{{ d.count || "" }}</span>
                    <div class="day-bar-area">
                      <div class="day-bar" :style="{ height: d.count ? `${(d.count / maxBookingDay) * 100}%` : '0' }" />
                    </div>
                    <span class="day-label" :class="{ weekend: d.weekend }">{{ d.weekday }}<br />{{ d.day }}</span>
                  </div>
                </template>
                <strong>{{ d.label }}</strong><br />
                {{ d.count }} booking{{ d.count === 1 ? "" : "s" }} · {{ naira(d.value) }}
                <template v-if="d.unpaid"><br />{{ d.unpaid }} awaiting payment</template>
              </v-tooltip>
            </div>

            <v-divider class="my-5" />

            <h3 class="font-display sub-title mb-3">Pay later</h3>
            <div class="d-flex justify-space-between text-body-2 mb-2">
              <span>Awaiting payment</span>
              <span class="bar-value">{{ naira(unpaid.amount) }} · {{ unpaid.count }}</span>
            </div>
            <div class="d-flex justify-space-between text-body-2 mb-2">
              <span class="d-flex align-center ga-1">
                <v-icon icon="mdi-alert-circle-outline" size="16" color="error" /> Overdue
              </span>
              <span class="bar-value">{{ naira(unpaid.overdueAmount) }} · {{ unpaid.overdue }}</span>
            </div>
            <div class="d-flex justify-space-between text-body-2 mb-3">
              <span>Collected from pay later ({{ rangeLabel }})</span>
              <span class="bar-value">{{ naira(collectedLater) }}</span>
            </div>
            <v-btn v-if="unpaid.count" size="small" variant="tonal" color="primary" class="text-none" @click="showOrders('unpaid')">
              Review unpaid orders
            </v-btn>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense class="mb-4">
        <!-- Top products -->
        <v-col cols="12" lg="5">
          <v-card rounded="xl" class="panel pa-6 h-100" elevation="0">
            <h2 class="font-display panel-title mb-1">Top products</h2>
            <p class="panel-sub mb-5">By revenue in the selected period</p>
            <div v-if="topProducts.length" class="d-flex flex-column ga-4">
              <v-tooltip v-for="p in topProducts" :key="p.id" location="top">
                <template #activator="{ props: tp }">
                  <div v-bind="tp" class="bar-row">
                    <div class="d-flex justify-space-between ga-3 mb-1">
                      <span class="bar-name">{{ p.name }}</span>
                      <span class="bar-value">{{ naira(p.revenue) }}</span>
                    </div>
                    <div class="bar-track"><div class="bar-fill" :style="{ width: pct(p.revenue, topProducts[0].revenue) }" /></div>
                  </div>
                </template>
                {{ p.units }} units · {{ p.orders }} orders · {{ naira(p.price) }} each
              </v-tooltip>
            </div>
            <p v-else class="empty">No sales in this period yet.</p>
          </v-card>
        </v-col>

        <!-- Category split -->
        <v-col cols="12" md="6" lg="4">
          <v-card rounded="xl" class="panel pa-6 h-100" elevation="0">
            <h2 class="font-display panel-title mb-1">Sales by category</h2>
            <p class="panel-sub mb-5">Share of revenue</p>
            <div v-if="categorySales.length" class="d-flex flex-column ga-4">
              <v-tooltip v-for="c in categorySales" :key="c.key" location="top">
                <template #activator="{ props: tp }">
                  <div v-bind="tp" class="bar-row">
                    <div class="d-flex justify-space-between ga-3 mb-1">
                      <span class="bar-name">{{ c.label }}</span>
                      <span class="bar-value">{{ c.share.toFixed(0) }}%</span>
                    </div>
                    <div class="bar-track"><div class="bar-fill" :style="{ width: `${c.share}%` }" /></div>
                  </div>
                </template>
                {{ naira(c.revenue) }} · {{ c.units }} units
              </v-tooltip>
            </div>
            <p v-else class="empty">No sales in this period yet.</p>

            <v-divider class="my-6" />

            <h3 class="font-display sub-title mb-3">Top occasions</h3>
            <div v-for="t in topThemes" :key="t.key" class="d-flex justify-space-between text-body-2 mb-2">
              <span>{{ t.label }}</span>
              <span class="bar-value">{{ naira(t.revenue) }}</span>
            </div>
          </v-card>
        </v-col>

        <!-- Fulfilment, payment, customers -->
        <v-col cols="12" md="6" lg="3">
          <v-card rounded="xl" class="panel pa-6 h-100" elevation="0">
            <h2 class="font-display panel-title mb-5">Operations</h2>

            <div v-for="group in splits" :key="group.title" class="mb-6">
              <h3 class="font-display sub-title mb-3">{{ group.title }}</h3>
              <div v-for="row in group.rows" :key="row.label" class="mb-3">
                <div class="d-flex justify-space-between text-body-2 mb-1">
                  <span>{{ row.label }}</span>
                  <span class="bar-value">{{ row.count }} · {{ row.share.toFixed(0) }}%</span>
                </div>
                <div class="bar-track thin"><div class="bar-fill" :style="{ width: `${row.share}%` }" /></div>
              </div>
            </div>

            <h3 class="font-display sub-title mb-3">Top cities</h3>
            <div v-for="c in topCities" :key="c.city" class="d-flex justify-space-between text-body-2 mb-2">
              <span>{{ c.city }}</span>
              <span class="bar-value">{{ c.count }} orders</span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Detail tables -->
      <v-card ref="tablesCard" rounded="xl" class="panel" elevation="0">
        <v-tabs v-model="tab" color="primary" class="px-4 pt-2">
          <v-tab value="orders" class="text-none">
            Orders <v-badge v-if="openOrders" :content="openOrders" color="warning" inline />
          </v-tab>
          <v-tab value="inventory" class="text-none">
            Inventory <v-badge v-if="lowStockCount" :content="lowStockCount" color="error" inline />
          </v-tab>
          <v-tab value="corporate" class="text-none">
            Corporate enquiries <v-badge v-if="newEnquiries" :content="newEnquiries" color="primary" inline />
          </v-tab>
        </v-tabs>
        <v-divider />

        <v-window v-model="tab">
          <!-- Orders -->
          <v-window-item value="orders" class="pa-4">
            <v-btn-toggle v-model="orderView" mandatory density="compact" rounded="lg" color="primary" variant="outlined" divided class="mb-4">
              <v-btn value="all" class="text-none" rounded="0">All orders</v-btn>
              <v-btn value="booked" class="text-none" rounded="0" prepend-icon="mdi-calendar-heart">Booked ({{ bookedCount }})</v-btn>
              <v-btn value="unpaid" class="text-none" rounded="0" prepend-icon="mdi-clock-outline">Unpaid ({{ unpaid.count }})</v-btn>
            </v-btn-toggle>
            <div class="d-flex flex-wrap ga-3 mb-4">
              <v-text-field
                v-model="orderSearch"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search order, customer, email, city"
                density="compact"
                hide-details
                clearable
                style="max-width: 360px"
              />
              <v-chip-group v-model="orderStatusFilter" selected-class="text-primary" column>
                <v-chip value="All" variant="outlined" filter>All</v-chip>
                <v-chip v-for="s in ORDER_STATUSES" :key="s" :value="s" variant="outlined" filter>
                  {{ s }} ({{ statusCounts[s] || 0 }})
                </v-chip>
              </v-chip-group>
            </div>

            <v-data-table
              :headers="orderHeaders"
              :items="filteredOrders"
              item-value="orderNumber"
              v-model:sort-by="orderSort"
              items-per-page="10"
              show-expand
              density="comfortable"
              hover
            >
              <template #item.createdAt="{ value }">{{ formatDate(value) }}</template>
              <template #item.customer="{ item }">
                <div class="py-1">
                  <div>{{ item.customer.name }}</div>
                  <div class="cell-sub">{{ item.customer.email }}</div>
                </div>
              </template>
              <template #item.scheduledFor="{ item }">
                <div v-if="item.scheduledFor" class="py-1">
                  <div>{{ formatDateKey(item.scheduledFor, { day: "numeric", month: "short", year: "numeric" }) }}</div>
                  <div class="cell-sub">{{ relativeDay(item.scheduledFor) }}{{ item.scheduledTime ? ` · ${item.scheduledTime}` : "" }}</div>
                </div>
                <span v-else class="cell-sub">ASAP</span>
              </template>
              <template #item.total="{ value }"><span class="bar-value">{{ naira(value) }}</span></template>
              <template #item.paymentStatus="{ item }">
                <v-menu>
                  <template #activator="{ props: mp }">
                    <PaymentChip v-bind="mp" :state="paymentState(item)" menu />
                  </template>
                  <v-list density="compact">
                    <v-list-item
                      v-for="m in ['Card', 'Bank Transfer']"
                      :key="m"
                      prepend-icon="mdi-check-circle-outline"
                      :title="`Mark paid · ${m}`"
                      :active="item.paymentStatus === 'Paid' && item.paymentMethod === m"
                      @click="admin.markPaid(item.orderNumber, m)"
                    />
                    <v-list-item
                      v-if="item.paymentStatus === 'Paid'"
                      prepend-icon="mdi-clock-outline"
                      title="Mark unpaid (pay later)"
                      @click="admin.markUnpaid(item.orderNumber)"
                    />
                  </v-list>
                </v-menu>
              </template>
              <template #item.status="{ item }">
                <v-menu>
                  <template #activator="{ props: mp }">
                    <v-chip v-bind="mp" size="small" :color="orderStatusMeta[item.status].color" :prepend-icon="orderStatusMeta[item.status].icon" append-icon="mdi-chevron-down" variant="tonal">
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <v-list density="compact">
                    <v-list-item
                      v-for="s in ORDER_STATUSES"
                      :key="s"
                      :prepend-icon="orderStatusMeta[s].icon"
                      :title="s"
                      :active="s === item.status"
                      @click="admin.setOrderStatus(item.orderNumber, s)"
                    />
                  </v-list>
                </v-menu>
              </template>
              <template #expanded-row="{ columns, item }">
                <tr>
                  <td :colspan="columns.length" class="expanded">
                    <div v-for="line in item.items" :key="line.id" class="d-flex justify-space-between text-body-2 py-1" style="max-width: 520px">
                      <span>{{ line.quantity }} × {{ line.name }}</span>
                      <span>{{ naira(line.price * line.quantity) }}</span>
                    </div>
                    <div class="cell-sub mt-2">
                      {{ item.fulfillmentMethod }}<span v-if="item.customer.city"> to {{ item.customer.city }}</span>
                      · {{ item.paymentOption === "later" ? "Chose pay later" : "Paid at checkout" }}
                      <span v-if="item.paymentStatus === 'Paid'"> · paid by {{ item.paymentMethod }}</span>
                      <span v-if="item.customer.phone"> · {{ item.customer.phone }}</span>
                      <span v-if="item.sample"> · sample order</span>
                    </div>
                  </td>
                </tr>
              </template>
              <template #no-data><p class="empty py-6">No orders match.</p></template>
            </v-data-table>
          </v-window-item>

          <!-- Inventory -->
          <v-window-item value="inventory" class="pa-4">
            <div class="d-flex flex-wrap align-center ga-4 mb-4">
              <v-text-field
                v-model="productSearch"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search products"
                density="compact"
                hide-details
                clearable
                style="max-width: 320px"
              />
              <v-switch v-model="lowStockOnly" color="primary" label="Low / out of stock only" hide-details density="compact" inset />
              <v-spacer />
              <span class="cell-sub">{{ allProducts.length }} products · {{ totalStock }} units in stock · stock value {{ naira(stockValue) }}</span>
            </div>
            <v-data-table
              :headers="inventoryHeaders"
              :items="filteredInventory"
              :sort-by="[{ key: 'remaining', order: 'asc' }]"
              items-per-page="10"
              density="comfortable"
              hover
            >
              <template #item.name="{ item }">
                <div class="d-flex align-center ga-3 py-2">
                  <v-avatar rounded="lg" size="36"><v-img :src="item.image" cover /></v-avatar>
                  <router-link :to="`/product/${item.id}`" class="product-link">{{ item.name }}</router-link>
                </div>
              </template>
              <template #item.category="{ value }">{{ categoryLabels[value] || value }}</template>
              <template #item.price="{ value }">{{ naira(value) }}</template>
              <template #item.revenue="{ value }">{{ naira(value) }}</template>
              <template #item.stockStatus="{ item }">
                <v-chip size="small" variant="tonal" :color="stockMeta[item.stockStatus].color" :prepend-icon="stockMeta[item.stockStatus].icon">
                  {{ item.stockStatus }}
                </v-chip>
              </template>
            </v-data-table>
            <p class="cell-sub mt-2">Stock = catalogue stock less units from live (non-sample, non-cancelled) orders. Sold and revenue are all-time.</p>
          </v-window-item>

          <!-- Corporate enquiries -->
          <v-window-item value="corporate" class="pa-4">
            <v-data-table
              :headers="enquiryHeaders"
              :items="admin.enquiries"
              :sort-by="[{ key: 'createdAt', order: 'desc' }]"
              items-per-page="10"
              show-expand
              density="comfortable"
              hover
            >
              <template #item.createdAt="{ value }">{{ formatDate(value) }}</template>
              <template #item.contactName="{ item }">
                <div class="py-1">
                  <div>{{ item.contactName }}</div>
                  <div class="cell-sub">{{ item.email }}</div>
                </div>
              </template>
              <template #item.status="{ item }">
                <v-menu>
                  <template #activator="{ props: mp }">
                    <v-chip v-bind="mp" size="small" :color="enquiryStatusMeta[item.status].color" :prepend-icon="enquiryStatusMeta[item.status].icon" append-icon="mdi-chevron-down" variant="tonal">
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <v-list density="compact">
                    <v-list-item
                      v-for="s in ENQUIRY_STATUSES"
                      :key="s"
                      :prepend-icon="enquiryStatusMeta[s].icon"
                      :title="s"
                      :active="s === item.status"
                      @click="admin.setEnquiryStatus(item.id, s)"
                    />
                  </v-list>
                </v-menu>
              </template>
              <template #expanded-row="{ columns, item }">
                <tr>
                  <td :colspan="columns.length" class="expanded text-body-2">
                    <div><strong>Phone:</strong> {{ item.phone || "—" }}</div>
                    <div><strong>Requirements:</strong> {{ item.requirements || "—" }}</div>
                  </td>
                </tr>
              </template>
              <template #no-data><p class="empty py-6">No corporate enquiries yet.</p></template>
            </v-data-table>
          </v-window-item>
        </v-window>
      </v-card>

      <div class="d-flex justify-end mt-4">
        <v-btn v-if="!admin.hasSampleData" size="small" variant="text" class="text-none" @click="admin.restoreSampleData()">
          Load sample data
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import TrendChart from "@/components/admin/TrendChart.vue";
import PaymentChip from "@/components/admin/PaymentChip.vue";
import { allProducts, themeDisplayNames } from "@/data/products";
import {
  useAdminStore,
  ORDER_STATUSES,
  ENQUIRY_STATUSES,
  LOW_STOCK_THRESHOLD,
  paymentState,
  formatDateKey,
  todayKey,
} from "@/store/admin";

const admin = useAdminStore();
const DAY = 86400000;

const ranges = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "All time", value: 0 },
];
const rangeDays = ref(30);
const rangeLabel = computed(() => ranges.find((r) => r.value === rangeDays.value).label.toLowerCase());
const tab = ref("orders");
const tablesCard = ref(null);

const categoryLabels = { events: "Events & Occasions", health: "Health & Wellness", household: "Household", kids: "Kids", corporate: "Corporate" };
const productById = Object.fromEntries(allProducts.map((p) => [p.id, p]));

const orderStatusMeta = {
  Pending: { color: "warning", icon: "mdi-clock-outline" },
  Processing: { color: "info", icon: "mdi-package-variant" },
  Dispatched: { color: "primary", icon: "mdi-truck-delivery-outline" },
  Delivered: { color: "success", icon: "mdi-check-circle-outline" },
  Cancelled: { color: "error", icon: "mdi-close-circle-outline" },
};
const enquiryStatusMeta = {
  New: { color: "primary", icon: "mdi-email-alert-outline" },
  Contacted: { color: "info", icon: "mdi-phone-outline" },
  Quoted: { color: "warning", icon: "mdi-file-document-outline" },
  Won: { color: "success", icon: "mdi-handshake-outline" },
  Lost: { color: "error", icon: "mdi-close-circle-outline" },
};
const stockMeta = {
  "In stock": { color: "success", icon: "mdi-check" },
  "Low stock": { color: "warning", icon: "mdi-alert-outline" },
  "Out of stock": { color: "error", icon: "mdi-alert-octagon-outline" },
};

// ── Formatting ──
const naira = (v) => `₦${Number(v || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
const nairaShort = (v) => (v >= 1000 ? `₦${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k` : `₦${v}`);
const pct = (v, max) => `${max ? (v / max) * 100 : 0}%`;
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const unitsIn = (o) => o.items.reduce((s, i) => s + i.quantity, 0);
const isLive = (o) => o.status !== "Cancelled";

// ── Period selection ──
const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
const rangeStart = computed(() => (rangeDays.value ? startOfToday - (rangeDays.value - 1) * DAY : 0));

const rangeOrders = computed(() => admin.orders.filter((o) => new Date(o.createdAt).getTime() >= rangeStart.value));
const liveRangeOrders = computed(() => rangeOrders.value.filter(isLive));
const prevRangeOrders = computed(() => {
  if (!rangeDays.value) return [];
  const prevStart = rangeStart.value - rangeDays.value * DAY;
  return admin.orders.filter((o) => {
    const t = new Date(o.createdAt).getTime();
    return t >= prevStart && t < rangeStart.value && isLive(o);
  });
});

const sumRevenue = (list) => list.reduce((s, o) => s + o.total, 0);
const delta = (cur, prev) => (rangeDays.value && prev ? ((cur - prev) / prev) * 100 : undefined);

// ── KPIs ──
const openOrders = computed(() => admin.orders.filter((o) => o.status === "Pending" || o.status === "Processing").length);
const newEnquiries = computed(() => admin.enquiries.filter((e) => e.status === "New").length);

const kpis = computed(() => {
  const revenue = sumRevenue(liveRangeOrders.value);
  const count = liveRangeOrders.value.length;
  const units = liveRangeOrders.value.reduce((s, o) => s + unitsIn(o), 0);
  const customers = new Set(liveRangeOrders.value.map((o) => o.customer.email.toLowerCase())).size;
  const prevRevenue = sumRevenue(prevRangeOrders.value);
  const prevCount = prevRangeOrders.value.length;
  const openEnquiries = admin.enquiries.filter((e) => !["Won", "Lost"].includes(e.status)).length;
  return [
    { label: "Revenue", icon: "mdi-cash-multiple", value: naira(revenue), delta: delta(revenue, prevRevenue) },
    { label: "Orders", icon: "mdi-receipt-text-outline", value: count.toLocaleString(), delta: delta(count, prevCount) },
    { label: "Avg. order value", icon: "mdi-scale-balance", value: naira(count ? revenue / count : 0), note: `${units} units sold` },
    { label: "Customers", icon: "mdi-account-group-outline", value: customers.toLocaleString(), note: "Unique by email" },
    { label: "Awaiting fulfilment", icon: "mdi-package-variant-closed", value: openOrders.value.toLocaleString(), note: "Pending + processing, all time" },
    { label: "Upcoming bookings", icon: "mdi-calendar-heart", value: upcomingBookings.value.length.toLocaleString(), note: `${bookingsThisWeek.value} in the next 7 days` },
    { label: "Awaiting payment", icon: "mdi-clock-outline", value: naira(unpaid.value.amount), note: `${unpaid.value.count} pay-later · ${unpaid.value.overdue} overdue` },
    { label: "Open corporate leads", icon: "mdi-briefcase-outline", value: openEnquiries.toLocaleString(), note: `${newEnquiries.value} new` },
  ];
});

// ── Bookings & pay later (operational: not tied to the date filter) ──
const relativeDay = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  const diff = Math.round((new Date(y, m - 1, d).getTime() - startOfToday) / DAY);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return diff > 0 ? `In ${diff} days` : `${-diff} days ago`;
};
const bookedCount = computed(() => admin.orders.filter((o) => o.scheduledFor).length);
const upcomingBookings = computed(() =>
  admin.orders
    .filter((o) => o.scheduledFor && o.scheduledFor >= todayKey() && isLive(o) && o.status !== "Delivered")
    .sort((a, b) => (a.scheduledFor + (a.scheduledTime || "")).localeCompare(b.scheduledFor + (b.scheduledTime || "")))
);
const bookingsThisWeek = computed(() => upcomingBookings.value.filter((o) => o.scheduledFor <= todayKey(6)).length);

const unpaid = computed(() => {
  const list = admin.orders.filter((o) => ["Unpaid", "Overdue"].includes(paymentState(o)));
  const overdue = list.filter((o) => paymentState(o) === "Overdue");
  return {
    count: list.length,
    amount: sumRevenue(list),
    overdue: overdue.length,
    overdueAmount: sumRevenue(overdue),
  };
});
const collectedLater = computed(() =>
  sumRevenue(liveRangeOrders.value.filter((o) => o.paymentOption === "later" && o.paymentStatus === "Paid"))
);

const bookingDays = computed(() =>
  Array.from({ length: 14 }, (_, i) => {
    const key = todayKey(i);
    const list = upcomingBookings.value.filter((o) => o.scheduledFor === key);
    const date = new Date(startOfToday + i * DAY);
    return {
      key,
      count: list.length,
      value: sumRevenue(list),
      unpaid: list.filter((o) => o.paymentStatus === "Unpaid").length,
      weekday: date.toLocaleDateString("en-GB", { weekday: "narrow" }),
      day: date.getDate(),
      weekend: [0, 6].includes(date.getDay()),
      label: formatDateKey(key, { weekday: "long", day: "numeric", month: "short" }),
    };
  })
);
const maxBookingDay = computed(() => Math.max(1, ...bookingDays.value.map((d) => d.count)));

async function showOrders(view) {
  tab.value = "orders";
  orderView.value = view;
  orderStatusFilter.value = "All";
  orderSort.value = view === "booked" ? [{ key: "scheduledFor", order: "asc" }] : [{ key: "createdAt", order: "desc" }];
  await nextTick();
  tablesCard.value?.$el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Revenue trend (one point per day) ──
const trend = computed(() => {
  const live = liveRangeOrders.value;
  if (!live.length && !rangeDays.value) return [];
  const first = rangeDays.value
    ? rangeStart.value
    : Math.min(...live.map((o) => new Date(new Date(o.createdAt).setHours(0, 0, 0, 0)).getTime()));
  const days = Math.round((startOfToday - first) / DAY) + 1;
  const buckets = Array.from({ length: days }, () => ({ revenue: 0, orders: 0 }));
  live.forEach((o) => {
    const i = Math.floor((new Date(o.createdAt).getTime() - first) / DAY);
    if (buckets[i]) {
      buckets[i].revenue += o.total;
      buckets[i].orders += 1;
    }
  });
  return buckets.map((b, i) => ({
    label: new Date(first + i * DAY).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    value: b.revenue,
    sub: `${b.orders} order${b.orders === 1 ? "" : "s"}`,
  }));
});

// ── Product / category / occasion aggregation ──
const productSales = computed(() => {
  const map = {};
  liveRangeOrders.value.forEach((o) =>
    o.items.forEach((i) => {
      const row = (map[i.id] ||= { id: i.id, name: i.name, price: i.price, units: 0, revenue: 0, orders: 0 });
      row.units += i.quantity;
      row.revenue += i.price * i.quantity;
      row.orders += 1;
    })
  );
  return Object.values(map).sort((a, b) => b.revenue - a.revenue);
});
const topProducts = computed(() => productSales.value.slice(0, 7));

function groupSales(keyOf, labelOf) {
  const map = {};
  productSales.value.forEach((p) => {
    const key = keyOf(productById[p.id]) || "other";
    const row = (map[key] ||= { key, label: labelOf(key), revenue: 0, units: 0 });
    row.revenue += p.revenue;
    row.units += p.units;
  });
  const total = Object.values(map).reduce((s, r) => s + r.revenue, 0);
  return Object.values(map)
    .map((r) => ({ ...r, share: total ? (r.revenue / total) * 100 : 0 }))
    .sort((a, b) => b.revenue - a.revenue);
}
const categorySales = computed(() => groupSales((p) => p?.category, (k) => categoryLabels[k] || "Other"));
const topThemes = computed(() => groupSales((p) => p?.theme, (k) => themeDisplayNames[k] || "Other").slice(0, 5));

// ── Operations splits ──
function split(list, field, values, labels = values) {
  return values.map((value, i) => {
    const count = list.filter((o) => o[field] === value).length;
    return { label: labels[i], count, share: list.length ? (count / list.length) * 100 : 0 };
  });
}
const splits = computed(() => {
  const live = liveRangeOrders.value;
  const paid = live.filter((o) => o.paymentStatus === "Paid");
  return [
    { title: "Fulfilment", rows: split(live, "fulfillmentMethod", ["Delivery", "Pickup"]) },
    { title: "Payment choice", rows: split(live, "paymentOption", ["now", "later"], ["Pay now", "Pay later"]) },
    { title: "Paid by", rows: split(paid, "paymentMethod", ["Card", "Bank Transfer"]) },
  ];
});
const topCities = computed(() => {
  const map = {};
  liveRangeOrders.value.forEach((o) => {
    const city = o.customer.city?.trim() || "Pickup / not given";
    map[city] = (map[city] || 0) + 1;
  });
  return Object.entries(map)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
});

// ── Orders table ──
const orderSearch = ref("");
const orderStatusFilter = ref("All");
const statusCounts = computed(() =>
  admin.orders.reduce((m, o) => ((m[o.status] = (m[o.status] || 0) + 1), m), {})
);
const orderView = ref("all"); // "all" | "booked" | "unpaid"
const orderSort = ref([{ key: "createdAt", order: "desc" }]);
const orderHeaders = [
  { title: "Order", key: "orderNumber" },
  { title: "Placed", key: "createdAt" },
  { title: "Customer", key: "customer", sortable: false },
  { title: "Booked for", key: "scheduledFor" },
  { title: "Fulfilment", key: "fulfillmentMethod" },
  { title: "Total", key: "total", align: "end" },
  { title: "Payment", key: "paymentStatus" },
  { title: "Status", key: "status" },
  { title: "", key: "data-table-expand" },
];
const filteredOrders = computed(() => {
  const q = (orderSearch.value || "").toLowerCase().trim();
  return admin.orders.filter((o) => {
    if (orderView.value === "booked" && !o.scheduledFor) return false;
    if (orderView.value === "unpaid" && !["Unpaid", "Overdue"].includes(paymentState(o))) return false;
    if (orderStatusFilter.value && orderStatusFilter.value !== "All" && o.status !== orderStatusFilter.value) return false;
    if (!q) return true;
    return [o.orderNumber, o.customer.name, o.customer.email, o.customer.city].some((f) => f?.toLowerCase().includes(q));
  });
});

// ── Inventory ──
const productSearch = ref("");
const lowStockOnly = ref(false);
const inventory = computed(() => {
  const sold = {};
  const liveSold = {};
  admin.orders.filter(isLive).forEach((o) =>
    o.items.forEach((i) => {
      const row = (sold[i.id] ||= { units: 0, revenue: 0 });
      row.units += i.quantity;
      row.revenue += i.price * i.quantity;
      if (!o.sample) liveSold[i.id] = (liveSold[i.id] || 0) + i.quantity;
    })
  );
  return allProducts.map((p) => {
    const remaining = Math.max(p.stock - (liveSold[p.id] || 0), 0);
    return {
      ...p,
      themeLabel: themeDisplayNames[p.theme] || p.theme,
      remaining,
      sold: sold[p.id]?.units || 0,
      revenue: sold[p.id]?.revenue || 0,
      stockStatus: remaining === 0 ? "Out of stock" : remaining <= LOW_STOCK_THRESHOLD ? "Low stock" : "In stock",
    };
  });
});
const lowStockCount = computed(() => inventory.value.filter((p) => p.stockStatus !== "In stock").length);
const totalStock = computed(() => inventory.value.reduce((s, p) => s + p.remaining, 0));
const stockValue = computed(() => inventory.value.reduce((s, p) => s + p.remaining * p.price, 0));
const inventoryHeaders = [
  { title: "Product", key: "name" },
  { title: "Occasion", key: "themeLabel" },
  { title: "Category", key: "category" },
  { title: "Price", key: "price", align: "end" },
  { title: "Stock", key: "remaining", align: "end" },
  { title: "Sold", key: "sold", align: "end" },
  { title: "Revenue", key: "revenue", align: "end" },
  { title: "Status", key: "stockStatus" },
];
const filteredInventory = computed(() => {
  const q = (productSearch.value || "").toLowerCase().trim();
  return inventory.value.filter(
    (p) => (!lowStockOnly.value || p.stockStatus !== "In stock") && (!q || p.name.toLowerCase().includes(q) || p.themeLabel.toLowerCase().includes(q))
  );
});

// ── Corporate enquiries ──
const enquiryHeaders = [
  { title: "Date", key: "createdAt" },
  { title: "Company", key: "companyName" },
  { title: "Contact", key: "contactName" },
  { title: "Occasion", key: "occasion" },
  { title: "Tier", key: "tier" },
  { title: "Qty", key: "quantity", align: "end" },
  { title: "Budget", key: "budget" },
  { title: "Status", key: "status" },
  { title: "", key: "data-table-expand" },
];
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: var(--vio-cream);
  font-family: var(--font-body);
}
.admin-bar {
  background: var(--vio-purple);
  position: sticky;
  top: 0;
  z-index: 50;
}
.logo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #fff;
  overflow: hidden;
}
.logo-badge img {
  width: 84%;
  height: 84%;
  object-fit: contain;
}
.bar-title {
  color: var(--vio-cream);
  font-size: 1.15rem;
  line-height: 1.2;
}
.bar-sub {
  color: rgba(250, 247, 240, 0.7);
  font-size: 0.75rem;
}
.page-title {
  font-size: 1.8rem;
}
.kpi,
.panel {
  border: 1px solid rgba(143, 90, 168, 0.14);
  background: #fff;
}
.kpi-label {
  font-size: 0.8rem;
  color: var(--vio-text-muted);
}
.kpi-value {
  font-family: var(--font-display);
  font-size: 1.75rem;
  color: var(--vio-purple);
  line-height: 1.1;
}
.kpi-delta,
.kpi-note {
  font-size: 0.75rem;
  color: var(--vio-text-muted);
}
.kpi-delta.up {
  color: #15803d;
}
.kpi-delta.down {
  color: #b91c1c;
}
.panel-title {
  font-size: 1.25rem;
}
.sub-title {
  font-size: 0.95rem;
}
.panel-sub {
  font-size: 0.8rem;
  color: var(--vio-text-muted);
}
.bar-row {
  cursor: default;
}
.bar-name {
  font-size: 0.875rem;
  color: var(--vio-purple-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bar-value {
  font-size: 0.875rem;
  color: var(--vio-purple);
  font-weight: 500;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.bar-track {
  height: 10px;
  border-radius: 4px;
  background: var(--vio-light-gray);
  overflow: hidden;
}
.bar-track.thin {
  height: 6px;
}
.bar-fill {
  height: 100%;
  border-radius: 4px;
  background: #8f5aa8;
  transition: width 0.4s ease;
}
.booking-row + .booking-row {
  border-top: 1px solid var(--vio-light-gray);
}
.date-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--vio-cream);
  border: 1px solid rgba(143, 90, 168, 0.18);
}
.date-month {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vio-text-muted);
}
.date-day {
  font-family: var(--font-display);
  font-size: 1.3rem;
  line-height: 1;
  color: var(--vio-purple);
}
.day-chart {
  display: flex;
  align-items: stretch;
  gap: 4px;
  height: 150px;
}
.day-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
}
.day-count {
  font-size: 0.7rem;
  height: 16px;
  color: var(--vio-purple-dark);
  font-variant-numeric: tabular-nums;
}
.day-bar-area {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-bottom: 1px solid var(--vio-light-gray);
}
.day-bar {
  width: min(100%, 22px);
  background: #8f5aa8;
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
}
.day-col:hover .day-bar-area {
  background: rgba(143, 90, 168, 0.06);
}
.day-label {
  margin-top: 4px;
  font-size: 0.65rem;
  line-height: 1.2;
  text-align: center;
  color: var(--vio-text-muted);
}
.day-label.weekend {
  color: var(--vio-purple-dark);
  font-weight: 600;
}
.cell-sub {
  font-size: 0.75rem;
  color: var(--vio-text-muted);
}
.expanded {
  background: var(--vio-cream);
  padding: 12px 24px !important;
}
.product-link {
  color: var(--vio-purple);
}
.product-link:hover {
  text-decoration: underline;
}
.empty {
  color: var(--vio-text-muted);
  font-size: 0.875rem;
  text-align: center;
  margin: 0;
}
</style>
