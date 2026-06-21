<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Assignment Management</p>
        <h1>Assignments</h1>
      </div>
    </header>

    <section class="card-grid">
      <article class="panel">
        <h3>Science Systems Check</h3>
        <p>Class: Grade 8 Science</p>
        <p>Due Date: 25-Jun-2026</p>

        <div class="cta-row">
          <button class="btn btn-primary">
            View
          </button>

          <button class="btn btn-outline">
            Delete
          </button>
        </div>
      </article>

      <article class="panel">
        <h3>Math Quiz</h3>
        <p>Class: Grade 7 A</p>
        <p>Due Date: 28-Jun-2026</p>

        <div class="cta-row">
          <button class="btn btn-primary">
            View
          </button>

          <button class="btn btn-outline">
            Delete
          </button>
        </div>
      </article>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
import { ref } from "vue";

const assignmentName = ref("");

function createAssignment() {
  alert("Assignment Created");
}
</script>