<template>
  <div class="min-h-screen d-flex align-center justify-center text-center bg-white">
    <div>
      <h1 class="font-display mb-4" style="color: var(--vio-purple); font-size: 3rem">404</h1>
      <p class="mb-6" style="color: var(--vio-purple-dark)">This page could not be found.</p>
      <router-link to="/" class="home-btn">Back to Home</router-link>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.home-btn {
  display: inline-flex; align-items: center; padding: 12px 32px; border-radius: 999px;
  background-color: var(--vio-purple); color: #faf7f0; font-family: "Belleza", serif;
}
</style>
