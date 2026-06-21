<template>
  <AuthLayout mode="login">
    <h1>Login to your Wayground account</h1>
    <p>New to Wayground? <NuxtLink style="color: #005bd3; font-weight: 900" to="/signup">Create a free account</NuxtLink></p>
    <div class="auth-options">

    </div>
    <form class="form-grid" @submit.prevent="submit">
      <label>Email <input v-model="email" class="input" type="email" required /></label>
      <label>Password <input v-model="password" class="input" type="password" required /></label>
      <button class="btn btn-primary" type="submit">Log in</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
const { login } = useApi();
const email = ref("");
const password = ref("");
const error = ref("");

async function submit() {
  error.value = "";
  try {
    await login(email.value, password.value);
    await navigateTo("/dashboard");
  } catch (err: any) {
    error.value = err?.data?.message || "Login failed";
  }
}
</script>
