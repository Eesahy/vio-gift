<template>
  <header
    class="py-5"
    :class="sticky ? 'header-sticky' : ''"
    :style="variant === 'purple'
      ? { backgroundColor: 'var(--vio-purple)' }
      : { backgroundColor: '#faf7f0', borderBottom: '1px solid rgba(143,90,168,0.15)' }"
  >
    <v-container class="d-flex align-center justify-space-between" style="position: relative">
      <component
        :is="backTo ? 'router-link' : 'button'"
        v-bind="backTo ? { to: backTo } : {}"
        class="d-flex align-center header-link"
        :style="{ color: variant === 'purple' ? '#faf7f0' : 'var(--vio-purple)' }"
        @click="backTo ? null : $emit('back')"
      >
        <v-icon icon="mdi-arrow-left" size="20" class="mr-2" />
        <span class="text-body-2">{{ backLabel }}</span>
      </component>

      <router-link to="/" class="header-logo">
        <h1
          class="font-display ma-0"
          style="font-size: 1.6rem"
          :style="{ color: variant === 'purple' ? '#faf7f0' : 'var(--vio-purple)' }"
        >
          VioGiftStore
        </h1>
      </router-link>

      <div class="header-right"><slot name="right" /></div>
    </v-container>
  </header>
</template>

<script setup>
defineProps({
  backTo: { default: "/" },
  backLabel: { type: String, default: "Back" },
  variant: { type: String, default: "light" }, // "light" | "purple"
  sticky: { type: Boolean, default: true },
});
defineEmits(["back"]);
</script>

<style scoped>
.header-sticky {
  position: sticky;
  top: 0;
  z-index: 50;
}
.header-link {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  transition: opacity 0.2s;
}
.header-link:hover {
  opacity: 0.7;
}
.header-logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.header-right {
  min-width: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
</style>
