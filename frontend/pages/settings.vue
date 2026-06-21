<template>
  <AppShell>

    <header class="dashboard-header">
      <div>
        <h1>Platform Settings</h1>
        <p class="eyebrow">
          Manage system configuration
        </p>
      </div>

      <NuxtLink
        class="btn btn-outline"
        to="/admin"
      >
        Back to Admin
      </NuxtLink>
    </header>

    <!-- Platform Settings -->
    <section class="panel">
      <h2>Platform Settings</h2>

      <label>
        Platform Name
        <input
          class="input"
          value="Online Quiz System"
        />
      </label>

      <br /><br />

      <label>
        Organization Name
        <input
          class="input"
          value="Karunya Education"
        />
      </label>

      <br /><br />

      <label>
        Contact Email
        <input
          class="input"
          value="admin@quiz.com"
        />
      </label>
    </section>

    <!-- User Settings -->
    <section
      class="panel"
      style="margin-top:20px"
    >
      <h2>User Settings</h2>

      <p>
        <input type="checkbox" checked />
        Enable Student Registration
      </p>

      <p>
        <input type="checkbox" checked />
        Enable Teacher Registration
      </p>

      <p>
        <input type="checkbox" />
        Allow Guest Join
      </p>
    </section>

    <!-- Quiz Settings -->
    <section
      class="panel"
      style="margin-top:20px"
    >
      <h2>Quiz Settings</h2>

      <p>
        <input type="checkbox" checked />
        Randomize Questions
      </p>

      <p>
        <input type="checkbox" checked />
        Show Leaderboard
      </p>

      <p>
        <input type="checkbox" checked />
        Show Correct Answers
      </p>

      <br />

      <label>
        Default Quiz Timer
        <select class="input">
          <option>10 Minutes</option>
          <option>20 Minutes</option>
          <option>30 Minutes</option>
        </select>
      </label>
    </section>

    <!-- Security Settings -->
    <section
      class="panel"
      style="margin-top:20px"
    >
      <h2>Security Settings</h2>

      <p>
        <input type="checkbox" checked />
        JWT Authentication Enabled
      </p>

      <p>
        <input type="checkbox" checked />
        Session Timeout Enabled
      </p>

      <button class="btn btn-outline">
        Change Password
      </button>
    </section>

    <!-- Notification Settings -->
    <section
      class="panel"
      style="margin-top:20px"
    >
      <h2>Notification Settings</h2>

      <p>
        <input type="checkbox" checked />
        Email Notifications
      </p>

      <p>
        <input type="checkbox" checked />
        Assignment Reminders
      </p>

      <p>
        <input type="checkbox" />
        Quiz Completion Alerts
      </p>
    </section>

    <!-- Backup Settings -->
    <section
      class="panel"
      style="margin-top:20px"
    >
      <h2>Backup & Reports</h2>

      <button class="btn btn-outline">
        Export Database
      </button>

      <button
        class="btn btn-outline"
        style="margin-left:10px"
      >
        Download Reports
      </button>
    </section>

    <!-- Action Buttons -->
    <section
      class="panel"
      style="margin-top:20px"
    >
      <button class="btn btn-primary">
        Save Settings
      </button>

      <button
        class="btn btn-outline"
        style="margin-left:10px"
      >
        Reset
      </button>
    </section>

  </AppShell>
</template>

<script setup lang="ts">
const { requireRole } = useRoleAccess();

onMounted(() => {
  requireRole(["ADMIN"]);
});
</script>