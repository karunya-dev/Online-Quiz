<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        <h1>Platform Overview</h1>
      </div>

      <NuxtLink
        class="btn btn-outline"
        to="/dashboard"
      >
        Dashboard
      </NuxtLink>
    </header>

    <section
      v-if="overview"
      class="card-grid"
    >
      <article class="panel">
        <h2>Resources</h2>
        <div class="metric">
          {{ overview.resources }}
        </div>
      </article>

      <article class="panel">
        <h2>Sessions</h2>
        <div class="metric">
          {{ overview.sessions }}
        </div>
      </article>

      <article class="panel">
        <h2>Reports</h2>
        <div class="metric">
          {{ overview.reports }}
        </div>
      </article>
    </section>

    <section
      v-if="overview"
      class="panel"
      style="margin-top:18px"
    >
      <h2>Users By Role</h2>

      <div
        v-for="row in overview.users"
        :key="row.role"
        class="wide-option"
        style="margin-bottom:10px;cursor:pointer"
        @click="selectedRole = row.role"
      >
        <strong>{{ row.role }}</strong>
        <span>{{ row.count }}</span>
      </div>
    </section>

    <section
      v-if="selectedRole"
      class="panel"
      style="margin-top:18px"
    >
      <h2>{{ selectedRole }} Details</h2>

      <div
        v-for="user in filteredUsers"
        :key="user.email"
        class="wide-option"
        style="margin-bottom:10px"
      >
        <strong>{{ user.name }}</strong>

        <p>{{ user.email }}</p>
      </div>
    </section>

    <p
      v-if="error"
      class="error"
    >
      {{ error }}
    </p>

  </AppShell>
</template>

<script setup lang="ts">
const { request } = useApi();
const { requireRole } = useRoleAccess();

const overview = ref<any>(null);
const error = ref("");

const selectedRole = ref("");

const users = [
  {
    role: "TEACHER",
    name: "John Teacher",
    email: "teacher1@gmail.com"
  },
  {
    role: "TEACHER",
    name: "Mary Teacher",
    email: "teacher2@gmail.com"
  },
  {
    role: "TEACHER",
    name: "David Teacher",
    email: "teacher3@gmail.com"
  },
  {
    role: "STUDENT",
    name: "Ari Student",
    email: "student1@gmail.com"
  },
  {
    role: "STUDENT",
    name: "Sam Student",
    email: "student2@gmail.com"
  },
  {
    role: "ADMIN",
    name: "Nina Admin",
    email: "admin@gmail.com"
  }
];

const filteredUsers = computed(() =>
  users.filter(
    user => user.role === selectedRole.value
  )
);

onMounted(async () => {
  const redirect = requireRole(["ADMIN"]);

  if (redirect) return;

  try {
    overview.value =
      await request("/admin/overview");
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      "Admin access requires an ADMIN account.";
  }
});
</script>