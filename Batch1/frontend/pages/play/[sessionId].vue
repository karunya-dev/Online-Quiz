<template>
  <div class="join-page">
    <header class="site-nav">
      <BrandLogo />
      <div class="nav-actions">
        <NuxtLink class="btn btn-outline" to="/dashboard">Dashboard</NuxtLink>
        <NuxtLink class="btn btn-primary" to="/join">Enter code</NuxtLink>
      </div>
    </header>

    <main class="dashboard" style="color: var(--ink)">
      <section class="panel">
        <p class="eyebrow">Session management service</p>
        <h1>{{ resource?.title || "Live session" }}</h1>
        <p v-if="pin" class="success">Share PIN {{ pin }} with students.</p>
        <p>{{ resource?.subject }} · {{ resource?.grade }} · {{ session?.mode }}</p>
      </section>

      <div class="card-grid" style="margin-top: 18px; grid-template-columns: 1.2fr 0.8fr">
        <section class="panel">
          <template v-if="!participantId">
            <h2>Waiting for participants</h2>
            <p>Students and guests join this session from the Enter Code page.</p>
          </template>
          <template v-else-if="currentQuestion">
            <p class="eyebrow">Question {{ questionIndex + 1 }} of {{ resource.questions.length }}</p>
            <h2>{{ currentQuestion.text }}</h2>
            <div class="form-grid">
              <button
                v-for="option in currentQuestion.options"
                :key="option"
                class="wide-option"
                :style="answer === option ? 'border-color: var(--pink); background: #fff0fa' : ''"
                @click="answer = option"
              >
                {{ option }} <span>{{ answer === option ? "Selected" : "" }}</span>
              </button>
            </div>
            <button class="btn btn-primary" style="margin-top: 18px" @click="submit">Submit response</button>
            <p v-if="feedback" class="success">{{ feedback }}</p>
          </template>
          <template v-else>
            <h2>Quiz complete</h2>
            <p class="success">Your result is ready and the report has been updated.</p>
           <NuxtLink
  class="btn btn-primary"
  to="/results"
>
  View Result
</NuxtLink>
          </template>
        </section>

        <section class="panel">
          <h2>Leaderboard</h2>
          <div v-for="row in leaderboard" :key="row.id" class="wide-option" style="margin-bottom: 10px">
            <strong>#{{ row.rank }} {{ row.participant_name }}</strong>
            <span>{{ row.score }} pts</span>
          </div>
          <p v-if="!leaderboard.length">No responses yet.</p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const sessionId = route.params.sessionId as string;
const participantId = route.query.participant as string | undefined;
const pin = route.query.pin as string | undefined;
const session = ref<any>(null);
const resource = ref({
  title: "General Knowledge Quiz",
  subject: "General",
  grade: "8",
  questions: [
    {
      id: "Q1",
      text: "Capital of India?",
      options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
      correct: "Delhi"
    },
    {
      id: "Q2",
      text: "2 + 2 = ?",
      options: ["3", "4", "5", "6"],
      correct: "4"
    },
    {
      id: "Q3",
      text: "Largest planet?",
      options: ["Mars", "Earth", "Jupiter", "Venus"],
      correct: "Jupiter"
    },
    {
      id: "Q4",
      text: "HTML stands for?",
      options: ["Hyper Text Markup Language", "High Text", "Home Tool", "None"],
      correct: "Hyper Text Markup Language"
    },
    {
      id: "Q5",
      text: "CSS is used for?",
      options: ["Styling", "Database", "Server", "Storage"],
      correct: "Styling"
    },
    {
      id: "Q6",
      text: "JS means?",
      options: ["JavaScript", "JavaServer", "JSON", "None"],
      correct: "JavaScript"
    },
    {
      id: "Q7",
      text: "5 × 5 = ?",
      options: ["20", "25", "30", "15"],
      correct: "25"
    },
    {
      id: "Q8",
      text: "Sun is a?",
      options: ["Planet", "Star", "Moon", "Galaxy"],
      correct: "Star"
    },
    {
      id: "Q9",
      text: "Earth revolves around?",
      options: ["Moon", "Mars", "Sun", "Jupiter"],
      correct: "Sun"
    },
    {
      id: "Q10",
      text: "PostgreSQL is a?",
      options: ["Database", "Browser", "Language", "OS"],
      correct: "Database"
    }
  ]
});
const leaderboard = computed(() => {
  return [
    {
      participant_name: "You",
      score: score.value
    },
    {
      participant_name: "Paru",
      score: 8
    },
    {
      participant_name: "john",
      score: 6
    },
    {
      participant_name: "Akresh",
      score: 4
    }
  ]
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
});
const score = ref(0);
const quizResults = ref<any[]>([]);
const answered = ref<string[]>([]);
const answer = ref("");
const feedback = ref("");

const answersPayload = ref<{ questionId: string; answer: string; responseTimeMs?: number }[]>([]);

const questionIndex = computed(() => resource.value?.questions?.findIndex((question: any) => !answered.value.includes(question.id)) ?? 0);
const currentQuestion = computed(() => resource.value?.questions?.find((question: any) => !answered.value.includes(question.id)));



async function submit() {
  if (!currentQuestion.value || !answer.value) return;

  const selectedAnswer = answer.value;

  const isCorrect =
    selectedAnswer === currentQuestion.value.correct;

  if (isCorrect) {
    score.value++;
  }

  quizResults.value.push({
    question: currentQuestion.value.text,
    selected: selectedAnswer,
    correctAnswer: currentQuestion.value.correct,
    correct: isCorrect
  });

  answered.value.push(
    currentQuestion.value.id
  );

  answer.value = "";

  const remaining =
    resource.value.questions.filter(
      (q: any) =>
        !answered.value.includes(q.id)
    ).length;

  if (remaining === 0) {

    localStorage.setItem(
      "quizScore",
      String(score.value)
    );

    localStorage.setItem(
      "quizTotal",
      String(resource.value.questions.length)
    );

    localStorage.setItem(
      "quizReview",
      JSON.stringify(quizResults.value)
    );

    await navigateTo("/results");
  }
}

onMounted(() => {});
</script>
