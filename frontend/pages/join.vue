<template>
  <div class="join-page">
    <header class="site-nav">
      <BrandLogo compact />
      <div class="nav-actions">
        <NuxtLink class="btn btn-dark" to="/dashboard">My dashboard</NuxtLink>
        <NuxtLink class="btn btn-outline" to="/login">Log in</NuxtLink>
      </div>
    </header>
    <main class="join-main">
      <div class="join-logo">
        <BrandLogo />
        <span style="font-size: 1.7rem">formerly Quizizz</span>
      </div>
     <form class="join-box" @submit.prevent="joinQuiz">
       <input
  v-model="pin"
  placeholder="Enter a join code"
/>
        <button class="btn btn-primary" type="submit">Join</button>
      </form>
      
      <p v-if="error" class="error">{{ error }}</p>
    </main>
    <footer class="section-lead">Quick links · Worksheets · Teacher resources · Accessibility & Inclusion</footer>
  </div>
</template>

<script setup lang="ts">
const pin = ref("");
const nickname = ref("");
const needsName = ref(false);

function joinQuiz() {
  if (!pin.value) {
    alert("Enter Quiz PIN");
    return;
  }

  navigateTo(`/play/${pin.value}?participant=test-student`);
}
</script>
