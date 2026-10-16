<template>
  <div ref="wrap" class="trend-wrap">
    <svg
      v-if="width > 0"
      :width="width"
      :height="height"
      role="img"
      :aria-label="ariaLabel"
      @mousemove="onMove"
      @mouseleave="hover = null"
    >
      <!-- Recessive grid + y labels -->
      <g v-for="t in yTicks" :key="t.value">
        <line :x1="pad.left" :x2="width - pad.right" :y1="t.y" :y2="t.y" class="grid" />
        <text :x="pad.left - 8" :y="t.y" class="axis-label" text-anchor="end" dominant-baseline="middle">{{ t.label }}</text>
      </g>
      <text
        v-for="t in xTicks"
        :key="t.i"
        :x="t.x"
        :y="height - 6"
        class="axis-label"
        text-anchor="middle"
      >{{ t.label }}</text>

      <path :d="areaPath" class="area" />
      <path :d="linePath" class="line" />

      <g v-if="hover !== null">
        <line :x1="xs[hover]" :x2="xs[hover]" :y1="pad.top" :y2="height - pad.bottom" class="crosshair" />
        <circle :cx="xs[hover]" :cy="ys[hover]" r="5" class="dot" />
      </g>
    </svg>

    <div
      v-if="hover !== null"
      class="tooltip"
      :style="{ left: `${Math.min(Math.max(xs[hover], 70), width - 70)}px`, top: `${Math.max(ys[hover] - 64, 0)}px` }"
    >
      <div class="tt-label">{{ points[hover].label }}</div>
      <div class="tt-value">{{ format(points[hover].value) }}</div>
      <div v-if="points[hover].sub" class="tt-sub">{{ points[hover].sub }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  // [{ label: "12 Oct", value: 1200, sub: "4 orders" }]
  points: { type: Array, required: true },
  height: { type: Number, default: 240 },
  format: { type: Function, default: (v) => String(v) },
  formatAxis: { type: Function, default: (v) => String(v) },
  ariaLabel: { type: String, default: "Trend chart" },
});

const wrap = ref(null);
const width = ref(0);
const hover = ref(null);
const pad = { top: 16, right: 16, bottom: 28, left: 56 };

let observer;
onMounted(() => {
  observer = new ResizeObserver(([entry]) => (width.value = Math.floor(entry.contentRect.width)));
  observer.observe(wrap.value);
});
onBeforeUnmount(() => observer?.disconnect());

// Round the axis max up to a "nice" number so gridlines land on readable values.
const yMax = computed(() => {
  const max = Math.max(...props.points.map((p) => p.value), 0);
  if (max === 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * mag * 4 >= max) * mag;
  return step * 4;
});

const plotW = computed(() => width.value - pad.left - pad.right);
const plotH = computed(() => props.height - pad.top - pad.bottom);

const xs = computed(() => {
  const n = props.points.length;
  return props.points.map((_, i) => pad.left + (n === 1 ? plotW.value / 2 : (i / (n - 1)) * plotW.value));
});
const ys = computed(() => props.points.map((p) => pad.top + plotH.value - (p.value / yMax.value) * plotH.value));

const linePath = computed(() => xs.value.map((x, i) => `${i ? "L" : "M"}${x},${ys.value[i]}`).join(" "));
const areaPath = computed(() => {
  if (!xs.value.length) return "";
  const base = pad.top + plotH.value;
  return `${linePath.value} L${xs.value.at(-1)},${base} L${xs.value[0]},${base} Z`;
});

const yTicks = computed(() =>
  [0, 1, 2, 3, 4].map((i) => {
    const value = (yMax.value / 4) * i;
    return { value, y: pad.top + plotH.value - (value / yMax.value) * plotH.value, label: props.formatAxis(value) };
  })
);

const xTicks = computed(() => {
  const n = props.points.length;
  const count = Math.min(n, Math.max(2, Math.floor(plotW.value / 90)));
  const idx = new Set(Array.from({ length: count }, (_, k) => Math.round((k / Math.max(count - 1, 1)) * (n - 1))));
  return [...idx].map((i) => ({ i, x: xs.value[i], label: props.points[i].label }));
});

function onMove(e) {
  const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
  let best = 0;
  xs.value.forEach((px, i) => {
    if (Math.abs(px - x) < Math.abs(xs.value[best] - x)) best = i;
  });
  hover.value = props.points.length ? best : null;
}
</script>

<style scoped>
.trend-wrap {
  position: relative;
  width: 100%;
}
svg {
  display: block;
  overflow: visible;
}
.grid {
  stroke: var(--vio-light-gray);
  stroke-width: 1;
}
.axis-label {
  fill: var(--vio-text-muted);
  font-size: 11px;
  font-family: var(--font-body);
}
.line {
  fill: none;
  stroke: #8f5aa8;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.area {
  fill: rgba(143, 90, 168, 0.12);
}
.crosshair {
  stroke: var(--vio-gray);
  stroke-width: 1;
  stroke-dasharray: 3 3;
}
.dot {
  fill: #8f5aa8;
  stroke: #fff;
  stroke-width: 2;
}
.tooltip {
  position: absolute;
  transform: translateX(-50%);
  pointer-events: none;
  background: #fff;
  border: 1px solid var(--vio-light-gray);
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(46, 27, 48, 0.12);
  padding: 6px 10px;
  white-space: nowrap;
  font-family: var(--font-body);
}
.tt-label {
  font-size: 11px;
  color: var(--vio-text-muted);
}
.tt-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--vio-purple);
}
.tt-sub {
  font-size: 11px;
  color: var(--vio-purple-dark);
}
</style>
