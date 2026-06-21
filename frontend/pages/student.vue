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
