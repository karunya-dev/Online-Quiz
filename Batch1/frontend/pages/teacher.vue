<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Activity and quiz service</p>
        <h1>Teacher resources</h1>
      </div>
      <NuxtLink class="btn btn-outline" to="/reports">View reports</NuxtLink>
    </header>

    <div class="card-grid" style="grid-template-columns: minmax(320px, 0.9fr) 1.3fr">
      
      <section class="panel">
        <h2>Create quiz</h2>
        <div v-if="selectedQuestions.length" class="panel" style="margin-bottom:16px">
  <h3>Selected Questions ({{ selectedQuestions.length }})</h3>

  <ul>
    <li
      v-for="question in selectedQuestions"
      :key="question.id"
    >
      {{ question.question }}
    </li>
  </ul>
</div>
        <form class="form-grid" @submit.prevent="create">
          <label>Title <input v-model="form.title" class="input" required /></label>
          <label>Subject <input v-model="form.subject" class="input" required /></label>
          <label>Grade <input v-model="form.grade" class="input" required /></label>
          <label>Question <textarea v-model="form.question" class="textarea" required /></label>
          <label>Options, comma separated <input v-model="form.options" class="input" required /></label>
          <label>Correct answer <input v-model="form.correct" class="input" required /></label>
          <button class="btn btn-primary" type="submit">Publish resource</button>
          <p v-if="message" class="success">{{ message }}</p>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </section>

      <section class="panel">
        <h2>Question bank</h2>
        <h3>Saved Questions</h3>

<div
  v-for="question in questionBank"
  :key="question.id"
  class="panel"
  style="margin-bottom: 12px"
>
  <p><strong>{{ question.question }}</strong></p>
  <p>{{ question.subject }} · {{ question.grade }}</p>

  <button
  class="btn btn-outline"
  type="button"
  @click="useQuestion(question)"
>
  Use in Quiz
</button>
<button
  class="btn btn-outline"
  type="button"
  @click="addQuestionToQuiz(question)"
>
  Add to Quiz
</button>
<button
  class="btn btn-outline"
  type="button"
  @click="editQuestion(question)"
>
  Edit
</button>
<button
  class="btn btn-outline"
  type="button"
  @click="deleteQuestion(question.id)"
>
  Delete
</button>
</div>
        <div class="card-grid" style="grid-template-columns: repeat(2, minmax(0, 1fr))">
          <article v-for="resource in resources" :key="resource.id" class="panel resource-card">
            <div>
              <h3>{{ resource.title }}</h3>
              <p>{{ resource.subject }} · {{ resource.grade }}</p>
              <p>{{ resource.question_count || 0 }} question(s)</p></div>
            <div class="cta-row" style="justify-content: flex-start">
              <button class="btn btn-primary" @click="host(resource.id, 'LIVE')">Host live</button>
              <button class="btn btn-outline" @click="host(resource.id, 'SELF_PACED')">Assign</button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
const { request } = useApi();
const { requireRole } = useRoleAccess();
const questionBank = ref<any[]>([]);
const selectedQuestions = ref<any[]>([]);
const editingQuestionId = ref("");
const resources = ref<any[]>([]);
const message = ref("");
const error = ref("");
const form = reactive({
  title: "Science Systems Check",
  subject: "Science",
  grade: "Grade 8",
  question: "Which planet is known as the Red Planet?",
  options: "Earth, Mars, Jupiter, Venus",
  correct: "Mars"
});

async function load() {
  const response = await request<{ resources: any[] }>("/resources");
  resources.value = response.resources;
}
async function loadQuestionBank() {
  const response = await request("/question-bank");

  questionBank.value = response.questions;
}
function useQuestion(question: any) {
  form.subject = question.subject;
  form.grade = question.grade;
  form.question = question.question;
  form.correct = question.correct_answer || "";
}
function addQuestionToQuiz(question: any) {
  selectedQuestions.value.push(question);
}
function editQuestion(question: any) {
  editingQuestionId.value = question.id;

  form.subject = question.subject;
  form.grade = question.grade;
  form.question = question.question;
  form.correct = question.correct_answer || "";
}

async function deleteQuestion(id: string) {
  await request(`/question-bank/${id}`, {
    method: "DELETE"
  });

  await loadQuestionBank();
}
async function create() {
  error.value = "";
  message.value = "";
  try {

    console.log("Selected Questions:", selectedQuestions.value.length);
    await request("/resources", {
      method: "POST",
      body: {
        title: form.title,
        subject: form.subject,
        grade: form.grade,
        questionCount: selectedQuestions.value.length,
        questions: [
          {
            text: form.question,
            options: form.options.split(",").map((item) => item.trim()).filter(Boolean),
            correct: form.correct
          }
        ]
      }
    });
    message.value = "Quiz resource created.";
    await load();
  } catch (err: any) {
    error.value = err?.data?.message || "Could not create quiz";
  }
}


async function host(resourceId: string, mode: "LIVE" | "SELF_PACED") {
  const response = await request<{ sessionId: string; pinCode: string }>("/sessions", {
    method: "POST",
    body: { resourceId, mode }
  });
  await navigateTo(`/play/${response.sessionId}?pin=${response.pinCode}`);
}

onMounted(async () => {
  const redirect = requireRole(["TEACHER"]);
  if (redirect) return;

  await load();
  await loadQuestionBank();
});
</script>
