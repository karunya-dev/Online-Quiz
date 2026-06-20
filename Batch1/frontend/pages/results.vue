<template>
  <AppShell>

    <h1>Quiz Result</h1>

    <h2>
      Score: {{ score }} / {{ total }}
    </h2>

    <h3>
      Percentage: {{ percentage }}%
    </h3>

    <h3>{{ performance }}</h3>

    <div
      v-for="item in review"
      :key="item.question"
      class="panel"
      style="margin-top: 12px"
    >
      <h3>{{ item.question }}</h3>

      <p>
        Your Answer: {{ item.selected }}
      </p>

      <p>
        Correct Answer: {{ item.correctAnswer }}
      </p>

      <p>
        {{ item.correct ? "✅ Correct" : "❌ Wrong" }}
      </p>
    </div>

    <section
      class="panel"
      style="margin-top:20px"
    >
      <h2>Leaderboard</h2>

      <ol>
        <li>You - {{ score }}</li>
        <li>Student A - 8</li>
        <li>Student B - 6</li>
      </ol>
    </section>

  </AppShell>
</template>

<script setup lang="ts">

const score =
Number(
  localStorage.getItem("quizScore") || 0
);

const total =
Number(
  localStorage.getItem("quizTotal") || 0
);

const review =
JSON.parse(
  localStorage.getItem("quizReview") || "[]"
);

const percentage =
Math.round(
  (score / total) * 100
);

const performance =
percentage >= 80
  ? "Excellent Performance"
  : percentage >= 50
  ? "Good Performance"
  : "Needs Improvement";

</script>