<template>
  <header
    class="py-5"
    :class="sticky ? 'header-sticky' : ''"
    :style="variant === 'purple'
      ? { backgroundColor: 'var(--vio-purple)' }
      : { backgroundColor: 'var(--vio-cream)', borderBottom: '1px solid var(--vio-border-soft)' }"
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

      <router-link to="/" class="header-logo" aria-label="VioGiftStore — home">
        <span class="logo-badge">
          <img src="/logo.jpg" alt="VioGiftStore" />
        </span>
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
.logo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(46, 27, 48, 0.18);
  overflow: hidden;
}
.logo-badge img {
  width: 84%;
  height: 84%;
  object-fit: contain;
}
.header-right {
  min-width: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
</style>
