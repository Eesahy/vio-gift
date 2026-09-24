<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
// Root shell — matches the original Root.tsx which simply rendered
// <Outlet /> inside a min-h-screen wrapper using the Belleza font.
// Each page/view owns its own header + footer, exactly like the source app.
</script>

<style>
.v-application {
  font-family: "Belleza", serif;
}
</style>
