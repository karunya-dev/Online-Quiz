<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        
        <h1>Dashboard</h1>
      </div>
      <NuxtLink v-if="user?.role === 'TEACHER'" class="btn btn-primary" to="/teacher">Create quiz</NuxtLink>
    </header>

    <section class="card-grid">
      <article class="panel">
        <h2>Resources</h2>
        <div class="metric">{{ resources.length }}</div>
       
      </article>
      <article class="panel">
        <h2>Role</h2>
        <div class="metric">{{ user?.role || "Guest" }}</div>
       
      </article>
   
    </section>
    <template v-if="user?.role === 'STUDENT'">
  <section
    class="card-grid"
    style="margin-top: 18px"
  >
    <NuxtLink
      to="/assignments"
      class="panel"
      style="text-decoration:none;color:inherit;"
    >
      <h2>My Assignments</h2>
      <p>View assigned quizzes</p>
    </NuxtLink>

    <NuxtLink
      to="/results"
      class="panel"
      style="text-decoration:none;color:inherit;"
    >
      <h2>My Results</h2>
      <p>View quiz scores and reports</p>
    </NuxtLink>

    <NuxtLink
      to="/leaderboard"
      class="panel"
      style="text-decoration:none;color:inherit;"
    >
      <h2>Leaderboard</h2>
      <p>View rankings and scores</p>
    </NuxtLink>
  </section>
</template>

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
