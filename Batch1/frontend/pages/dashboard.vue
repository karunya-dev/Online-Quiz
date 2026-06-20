<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Teacher-first assessment workspace</p>
        <h1>Dashboard</h1>
      </div>
      <NuxtLink v-if="user?.role === 'TEACHER'" class="btn btn-primary" to="/teacher">Create quiz</NuxtLink>
    </header>

    <section class="card-grid">
      <article class="panel">
        <h2>Resources</h2>
        <div class="metric">{{ resources.length }}</div>
        <p>Activities stored as MongoDB quiz documents.</p>
      </article>
      <article class="panel">
        <h2>Role</h2>
        <div class="metric">{{ user?.role || "Guest" }}</div>
        <p>JWT-backed role access for Admin, Teacher, and Student.</p>
      </article>
      <article class="panel">
        <h2>Fast path</h2>
        <NuxtLink class="btn btn-dark" to="/join">Enter join code</NuxtLink>
      </article>
    </section>

    <section class="panel" style="margin-top: 18px">
      <h2>Recent quiz resources</h2>
      <div class="card-grid">
        <article v-for="resource in resources" :key="resource.id" class="resource-card panel">
          <div>
            <h3>{{ resource.title }}</h3>
            <p>{{ resource.subject }} · {{ resource.grade }} · {{ resource.questions?.length || 0 }} questions</p>
          </div>
          <button
  v-if="user?.role === 'TEACHER'"
  class="btn btn-primary"
  @click="host(resource.id, 'LIVE')"
>
  Host live
</button>
        </article>
      </div>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
const { request, user } = useApi();
const { requireAuth } = useRoleAccess();

const resources = ref<any[]>([]);

async function load() {
  try {
    const response = await request<{ resources: any[] }>("/resources");
    resources.value = response.resources;
  } catch {
    resources.value = [];
  }
}

async function host(resourceId: string, mode: "LIVE" | "SELF_PACED") {
  const response = await request<{ sessionId: string; pinCode: string }>("/sessions", {
    method: "POST",
    body: { resourceId, mode }
  });
  await navigateTo(`/play/${response.sessionId}?pin=${response.pinCode}`);
}

onMounted(() => {
  const redirect = requireAuth();
  if (redirect) return;
  load();
});
</script>
