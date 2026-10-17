<template>
  <v-chip size="small" variant="tonal" :color="meta.color" :prepend-icon="meta.icon" :append-icon="menu ? 'mdi-chevron-down' : undefined">
    {{ meta.label }}
  </v-chip>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // "Paid" | "Unpaid" | "Overdue" | "Void" — see paymentState() in the admin store
  state: { type: String, required: true },
  menu: { type: Boolean, default: false },
});

const META = {
  Paid: { color: "success", icon: "mdi-check-circle-outline", label: "Paid" },
  Unpaid: { color: "warning", icon: "mdi-clock-outline", label: "Pay later" },
  Overdue: { color: "error", icon: "mdi-alert-circle-outline", label: "Overdue" },
  Void: { color: "grey", icon: "mdi-minus-circle-outline", label: "Not due" },
};

const meta = computed(() => META[props.state] || META.Paid);
</script>
