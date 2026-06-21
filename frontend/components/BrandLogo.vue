<template>
  <NuxtLink class="brand" to="/">
    <span class="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
    <span>{{ compact ? "WG" : "WAYGROUND" }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ compact?: boolean }>();
</script>
