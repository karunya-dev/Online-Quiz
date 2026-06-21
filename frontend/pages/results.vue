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

  <div
    v-for="(player, index) in leaderboard"
    :key="player.name"
    style="margin-bottom:10px"
  >
    <strong>
      {{ index + 1 }}.
      {{ player.name }}
      - {{ player.score }}
    </strong>
  </div>
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
total > 0
  ? Math.round((score / total) * 100)
  : 0;

const performance =
percentage >= 80
  ? "Excellent Performance"
  : percentage >= 50
  ? "Good Performance"
  : "Needs Improvement";

  const leaderboard = [
  {
    name: "You",
    score
  },
  {
    name: "Student A",
    score: 8
  },
  {
    name: "Student B",
    score: 6
  }
].sort((a, b) => b.score - a.score);

</script>