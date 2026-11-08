<template>
  <div class="login-page d-flex align-center justify-center pa-4">
    <v-card rounded="xl" class="login-card pa-8" elevation="0" width="100%" max-width="420">
      <div class="d-flex flex-column align-center text-center mb-6">
        <span class="logo-badge mb-4"><img src="/logo.jpg" alt="VioGiftStore" /></span>
        <h1 class="font-display ma-0" style="color: var(--vio-purple); font-size: 1.6rem">Admin sign in</h1>
        <p class="text-body-2 ma-0 mt-1" style="color: var(--vio-text-muted)">Staff access to the VioGiftStore dashboard</p>
      </div>

      <form @submit.prevent="handleSignIn">
        <v-text-field
          v-model="email"
          type="email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          autocomplete="username"
          :disabled="busy"
          autofocus
        />
        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          autocomplete="current-password"
          :disabled="busy"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">{{ error }}</v-alert>
        <v-alert v-if="notice" type="success" variant="tonal" density="compact" class="mb-4">{{ notice }}</v-alert>

        <v-btn type="submit" block size="large" color="primary" rounded="lg" class="text-none" :loading="busy">Sign in</v-btn>
      </form>

      <div class="d-flex justify-space-between mt-4">
        <router-link to="/" class="text-body-2 link">Back to store</router-link>
        <button type="button" class="text-body-2 link" :disabled="busy" @click="handleReset">Forgot password?</button>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const busy = ref(false);
const error = ref("");
const notice = ref("");

const friendlyErrors = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

async function handleSignIn() {
  error.value = "";
  notice.value = "";
  if (!email.value || !password.value) {
    error.value = "Enter your email and password.";
    return;
  }
  busy.value = true;
  try {
    await auth.signIn(email.value.trim(), password.value);
    const redirect = typeof route.query.redirect === "string" && route.query.redirect.startsWith("/admin") ? route.query.redirect : "/admin";
    router.replace(redirect);
  } catch (e) {
    error.value = friendlyErrors[e.code] || e.message;
  } finally {
    busy.value = false;
  }
}

async function handleReset() {
  error.value = "";
  notice.value = "";
  if (!email.value) {
    error.value = "Enter your email above first.";
    return;
  }
  try {
    await auth.resetPassword(email.value.trim());
  } catch {
    // Don't reveal whether the account exists.
  }
  notice.value = "If that account exists, a password reset email is on its way.";
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--vio-cream);
}
.login-card {
  border: 1px solid rgba(143, 90, 168, 0.14);
  background: #fff;
}
.logo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
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
.link {
  color: var(--vio-purple);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.link:hover {
  text-decoration: underline;
}
</style>
