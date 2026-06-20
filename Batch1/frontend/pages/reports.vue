<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Reporting service</p>
        <h1>Reports</h1>
      </div>
      <NuxtLink v-if="user?.role === 'TEACHER'" class="btn btn-primary" to="/teacher">Host a session</NuxtLink>
    </header>

    <section class="panel">
      <h2>Generate report by ID</h2>
      <form class="join-box" style="margin: 0; border-color: #eadfe8" @submit.prevent="load">
        <input v-model="reportId" placeholder="RPT-SES-..." />
        <button class="btn btn-primary" type="submit">Open</button>
      </form>
      <p style="color: var(--muted)">Reports are generated automatically after response submission.</p>
    </section>

    <section v-if="report" class="card-grid" style="margin-top: 18px">
      <article class="panel">
        <h2>Average score</h2>
        <div class="metric">{{ report.average_score }}%</div>
      </article>
      <article class="panel">
        <h2>Participants</h2>
        <div class="metric">{{ report.participant_count }}</div>
      </article>
      <article class="panel">
        <h2>Completion rate</h2>
        <div class="metric">{{ report.completion_rate }}%</div>
      </article>
    </section>
    <h2>All Reports</h2>
    <p v-if="error" class="error">{{ error }}</p>
     <section class="card-grid" style="margin-top: 20px">

  <article class="panel">
    <h3>Science Systems Check</h3>

    <p>Average Score: 85%</p>
    <p>Participants: 25</p>
    <p>Completion Rate: 92%</p>

    <button class="btn btn-primary">
      View Report
    </button>
  </article>

  <article class="panel">
    <h3>Math Quiz</h3>

    <p>Average Score: 78%</p>
    <p>Participants: 18</p>
    <p>Completion Rate: 88%</p>

    <button class="btn btn-primary">
      View Report
    </button>
  </article>

</section>

    <section>
  

  

  <div
    v-for="item in reports"
    :key="item.id"
    style="margin-bottom:12px"
  >
    <strong>{{ item.id }}</strong>

```
<p>
  Average Score:
  {{ item.average_score }}%
</p>

<p>
  Participants:
  {{ item.participant_count }}
</p>

<p>
  Completion:
  {{ item.completion_rate }}%
</p>
```

  </div>
</section>

  </AppShell>
</template>

<script setup lang="ts">
const { request, user } = useApi();
const { requireRole } = useRoleAccess();

const reportId = ref("");
const report = ref<any>(null);
const error = ref("");
const reports = ref<any[]>([]);

async function loadReports() {
const response = await request("/reports");

reports.value = response.reports;
}


async function load() {
  error.value = "";
  try {
    const response = await request<{ report: any }>(`/reports/${reportId.value}`);
    report.value = response.report;
  } catch (err: any) {
    error.value = err?.data?.message || "Report not found";
  }
}

onMounted(async () => {
requireRole(["ADMIN", "TEACHER"]);

await loadReports();
});

</script>
