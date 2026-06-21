<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Result management</p>
        <h1>Quiz result</h1>
      </div>
      <NuxtLink class="btn btn-outline" to="/dashboard">Dashboard</NuxtLink>
    </header>

    <section class="card-grid">
      <article class="panel">
        <h2>Score</h2>
        <div class="metric">{{ result?.score || 0 }}</div>
      </article>
      <article class="panel">
        <h2>Rank</h2>
        <div class="metric">#{{ result?.rank || "-" }}</div>
      </article>
      <article class="panel">
        <h2>Participant</h2>
        <div class="metric" style="font-size: 1.6rem">{{ result?.nickname }}</div>
      </article>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
const route = useRoute();
const { request } = useApi();
const result = ref<any>(null);

onMounted(async () => {
  result.value = await request(`/results/${route.params.participantId}`);
});
</script>
