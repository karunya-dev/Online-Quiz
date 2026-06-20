<template>
  <div class="app-layout">
    <aside class="sidebar">
      <BrandLogo />
      <nav>
        <NuxtLink v-for="item in sidebarItems" :key="item.label" :to="item.to">{{ item.label }}</NuxtLink>
        <button type="button" @click="logout">Log out</button>
      </nav>
    </aside>
    <main class="dashboard">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { logout, user } = useApi();

const roleMenus = {
  ADMIN: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "User Management", to: "/admin" },
    { label: "Reports", to: "/reports" },
    { label: "Analytics", to: "/admin" },
    { label: "Settings", to: "/admin" }
  ],
TEACHER: [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Teacher Resources", to: "/teacher" },
  { label: "Question Bank", to: "/question-bank" },
  { label: "Assignments", to: "/assignments" },
  { label: "Live Sessions", to: "/live-sessions" },
  { label: "Manage Classes", to: "/classes" },
  { label: "Reports", to: "/reports" }
],
  STUDENT: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Join Quiz", to: "/join" },
    { label: "My Assignments", to: "/student" },
    { label: "My Results", to: "/student" },
    { label: "Leaderboard", to: "/student" }
  ]
};

const sidebarItems = computed(() => {
  if (!user.value) return [];
  return roleMenus[user.value.role] || [];
});
</script>
