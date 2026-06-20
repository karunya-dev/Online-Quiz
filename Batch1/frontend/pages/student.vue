<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Student workflow</p>
        <h1>Student dashboard</h1>
      </div>
      <NuxtLink class="btn btn-primary" to="/join">Join quiz</NuxtLink>
    </header>

    <section class="card-grid">
      <article class="panel">
  <h2>My Assignments</h2>

  <div
    v-for="item in assignments"
    :key="item.id"
    style="margin-top: 12px"
  >
    <strong>{{ item.resource?.title || item.title || item.resource_id }}</strong>

    <p>
      Class: {{ item.class_id }}
    </p>
  </div>
</article>
      <article class="panel">
  <h2>My Results</h2>

  <div
    v-for="item in results"
    :key="item.id"
    style="margin-top: 12px"
  >
    <strong>
      Score: {{ item.score }}
    </strong>

    <p>
      Quiz: {{ item.quiz_id }}
    </p>
  </div>
</article>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
const { requireRole } = useRoleAccess();
const { request, user } = useApi();

const assignments = ref([]);
const results = ref([]);
const leaderboard = ref([]);

onMounted(() => {
  requireRole(["STUDENT"]);
});

async function loadData() {

  const assignmentResponse =
    await request("/student/assignments");

  assignments.value =
    assignmentResponse.assignments;

  const resultResponse = await request(`/student/results`);
  results.value = resultResponse.results;
}

onMounted(async () => {
  await loadData();
});
</script>
