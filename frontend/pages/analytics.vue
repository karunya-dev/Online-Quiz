<template>
  <AppShell>

    <header class="dashboard-header">
      <div>
        <h1>Analytics Dashboard</h1>
        <p class="eyebrow">
          Platform insights and performance metrics
        </p>
      </div>

      <NuxtLink
        class="btn btn-outline"
        to="/admin"
      >
        Back to Admin
      </NuxtLink>
    </header>

    <section class="card-grid">

      <article class="panel">
        <h2>Total Users</h2>
        <div class="metric">120</div>
      </article>

      <article class="panel">
        <h2>Total Quizzes</h2>
        <div class="metric">35</div>
      </article>

      <article class="panel">
        <h2>Total Sessions</h2>
        <div class="metric">18</div>
      </article>

      <article class="panel">
        <h2>Average Score</h2>
        <div class="metric">78%</div>
      </article>

    </section>

    <section
      class="panel"
      style="margin-top:20px"
    >
      <h2>Quiz Attempts By Subject</h2>

      <div class="chart-container">

        <div class="bar">
          <span>Science (120)</span>
        </div>

        <div class="bar math">
          <span>Math (95)</span>
        </div>

        <div class="bar english">
          <span>English (80)</span>
        </div>

        <div class="bar history">
          <span>History (60)</span>
        </div>

      </div>
    </section>

    <section
      class="card-grid"
      style="margin-top:20px"
    >

      <article class="panel">
        <h2>User Distribution</h2>

        <ul>
          <li>Students : 70%</li>
          <li>Teachers : 25%</li>
          <li>Admins : 5%</li>
        </ul>
      </article>

      <article class="panel">
        <h2>Performance Summary</h2>

        <ul>
          <li>Excellent : 40%</li>
          <li>Good : 35%</li>
          <li>Average : 15%</li>
          <li>Poor : 10%</li>
        </ul>
      </article>

    </section>

    
  </AppShell>
</template>

<script setup lang="ts">
const { requireRole } = useRoleAccess();

onMounted(() => {
  requireRole(["ADMIN"]);
});
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar {
  width: 100%;
  max-width: 500px;
  height: 40px;
  background: #ec4899;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  color: white;
  font-weight: 600;
}

.math {
  max-width: 400px;
}

.english {
  max-width: 330px;
}

.history {
  max-width: 250px;
}
</style>