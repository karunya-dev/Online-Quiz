<template>
  <div class="auth-page">
    <header class="auth-nav">
      <BrandLogo />
      <div class="nav-actions">
        <NuxtLink class="btn btn-outline" to="/join">Enter join code</NuxtLink>
        <NuxtLink v-if="mode === 'login'" class="btn btn-primary" to="/signup">Sign up</NuxtLink>
        <NuxtLink v-else class="btn btn-primary" to="/login">Log in</NuxtLink>
      </div>
    </header>
    <main class="auth-center">
      <section class="auth-card">
        <slot />
      </section>
    </main>
    <footer class="section-lead">
      Trusted by educators in <strong style="color: var(--pink)">90% of US schools</strong> and over
      <strong style="color: var(--pink)">150+ countries</strong>.
    </footer>
  </div>
</template>

<script setup lang="ts">
defineProps<{ mode: "login" | "signup" }>();
</script>
