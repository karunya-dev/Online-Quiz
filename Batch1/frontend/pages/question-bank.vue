<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Question Management</p>
        <h1>Question Bank</h1>
      </div>
    </header>

    <section class="panel">
      <h2>Create Question</h2>

      <form class="form-grid">
        <label>
          Subject
          <input class="input" v-model="subject" />
        </label>

        <label>
          Grade
          <input class="input" v-model="grade" />
        </label>

        <label>
          Difficulty
          <select class="input" v-model="difficulty">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>

        <label>
          Question
          <textarea class="textarea" v-model="question"></textarea>
        </label>

        <label>
          Options
          <input class="input" v-model="options" />
        </label>

        <label>
          Correct Answer
          <input class="input" v-model="correct" />
        </label>

        <label>
          Hint
          <input class="input" v-model="hint" />
        </label>

        <label>
          Explanation
          <textarea class="textarea" v-model="explanation"></textarea>
        </label>

       <button
  type="button"
  class="btn btn-primary"
  @click="saveQuestion"
>
  Save Question
</button>
      </form>
      <h2>Saved Questions</h2>
      <input
  v-model="search"
  class="input"
  placeholder="Search questions..."
  style="margin-bottom:16px"
/>

<div
  v-for="(item, index) in questions.filter(q =>
    q.question.toLowerCase().includes(search.toLowerCase())
  )"
  :key="index"
  class="panel"
  style="margin-bottom: 16px"
>
  <h3>{{ item.question }}</h3>

  <p><strong>Subject:</strong> {{ item.subject }}</p>

  <p><strong>Grade:</strong> {{ item.grade }}</p>

  <p><strong>Difficulty:</strong> {{ item.difficulty }}</p>

  <p><strong>Hint:</strong> {{ item.hint }}</p>

  <p><strong>Explanation:</strong> {{ item.explanation }}</p>
</div>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
const { request } = useApi();
const subject = ref("")
const grade = ref("")
const difficulty = ref("Easy")
const question = ref("")
const options = ref("")
const correct = ref("")
const hint = ref("")
const explanation = ref("")
const questions = ref<any[]>([])
const search = ref("")


async function saveQuestion() {

    await request("/question-bank", {
  method: "POST",
  body: {
    subject: subject.value,
    grade: grade.value,
    difficulty: difficulty.value,
    question: question.value,
    correctAnswer: correct.value,
    hint: hint.value,
    explanation: explanation.value
  }
});

 questions.value.push({
  subject: subject.value,
  grade: grade.value,
  difficulty: difficulty.value,
  question: question.value,
  hint: hint.value,
  explanation: explanation.value
})

  alert("Question Saved Successfully!")
}

async function loadQuestions() {
  const response = await request("/question-bank");

  questions.value = response.questions;
}

onMounted(async () => {
  await loadQuestions();
});

</script>
