<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Admin workflow</p>
        <h1>Platform overview</h1>
      </div>
      <NuxtLink class="btn btn-outline" to="/dashboard">Dashboard</NuxtLink>
    </header>

    <section v-if="overview" class="card-grid">
      <article class="panel">
        <h2>Resources</h2>
        <div class="metric">{{ overview.resources }}</div>
      </article>
      <article class="panel">
        <h2>Sessions</h2>
        <div class="metric">{{ overview.sessions }}</div>
      </article>
      <article class="panel">
        <h2>Reports</h2>
        <div class="metric">{{ overview.reports }}</div>
      </article>
    </section>

    <section v-if="overview" class="panel" style="margin-top: 18px">
      <h2>Integrations</h2>
      <div class="integration-row" style="justify-content: flex-start">
        <span v-for="item in overview.integrations" :key="item" class="badge" style="background: var(--plum-900)">{{ item }}</span>
      </div>
    </section>

    <section v-if="overview" class="panel" style="margin-top: 18px">
      <h2>Users by role</h2>
      <div v-for="row in overview.users" :key="row.role" class="wide-option" style="margin-bottom: 10px">
        <strong>{{ row.role }}</strong>
        <span>{{ row.count }}</span>
      </div>
    </section>
    <p v-if="error" class="error">{{ error }}</p>
  </AppShell>
</template>

<script setup lang="ts">
const { request } = useApi();
const { requireRole } = useRoleAccess();

const overview = ref<any>(null);
const error = ref("");

onMounted(async () => {
  const redirect = requireRole(["ADMIN"]);
  if (redirect) return;
  try {
    overview.value = await request("/admin/overview");
  } catch (err: any) {
    error.value = err?.data?.message || "Admin access requires an ADMIN account.";
  }
});
</script>
