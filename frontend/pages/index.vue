<template>
  <div class="plum-page">
    <PublicNav />
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow">Online quiz system</p>
        <h1>Quizizz is now <em>Wayground</em></h1>
        <p>
          
        </p>
        <div class="cta-row">
          <NuxtLink class="btn btn-primary" to="/signup">Teachers sign up free</NuxtLink>
          <NuxtLink class="btn btn-outline" to="/join">Students enter code</NuxtLink>
        </div>
      </div>
      <div id="library" class="subject-strip">
        <article v-for="subject in subjects" :key="subject.name" class="subject-card">
          <strong>{{ subject.name }}</strong>
          <span>{{ subject.copy }}</span>
        </article>
      </div>
    </section>
<section id="ai" class="section section-dark">
  <h2>Manage Assessments with Powerful Teaching Tools</h2>

  <p class="section-lead">
    Create quizzes, manage classes, assign assessments, conduct live quiz
    sessions, and analyze student performance through detailed reports from
    a single platform.
  </p>

  <div class="feature-grid">

    <article class="feature-card">
      <h3>Question Bank</h3>
      <ul>
        <li>Create and manage quiz questions.</li>
        <li>Organize questions by subject and topic.</li>
        <li>Reuse questions across multiple assessments.</li>
      </ul>
    </article>

    <article class="feature-card">
      <h3>Live Quiz Sessions</h3>
      <ul>
        <li>Host real-time classroom quizzes.</li>
        <li>Students join using a session code.</li>
        <li>Track participation and quiz progress instantly.</li>
      </ul>
    </article>

    <article class="feature-card">
      <h3>Class Management</h3>
      <ul>
        <li>Create and manage classes.</li>
        <li>Assign quizzes to specific classes.</li>
        <li>Maintain grade-wise classroom organization.</li>
      </ul>
    </article>

  </div>
</section>



   <section id="reports" class="section section-light">
  <div class="split">
    <div class="visual-panel">
      <div class="mini-card">Create Quiz Questions</div>
      <div class="mini-card">Manage Classes</div>
      <div class="mini-card">Assign Assessments</div>
      <div class="mini-card">Generate Reports</div>
    </div>

    <div>
      <p class="eyebrow">Performance Analytics</p>

      <h2 style="text-align: left">
        Assessment Reports and Student Performance
      </h2>

      <p class="section-lead" style="text-align: left; margin-left: 0">
        Monitor quiz performance through detailed reports and analytics.
        Teachers can track student participation, quiz scores, completion
        rates, and overall learning progress to improve classroom outcomes.
      </p>
    </div>
  </div>
</section>

<section class="section section-light">
  <h2>Start Your Online Quiz Journey Today</h2>

  <p class="section-lead">
    Create quizzes, manage classes, conduct live sessions, assign assessments,
    and track student performance through a single integrated platform.
  </p>

  <div class="cta-row">
    <NuxtLink class="btn btn-primary" to="/signup">
      Create Teacher Account
    </NuxtLink>

    <NuxtLink class="btn btn-dark" to="/login">
      Sign In
    </NuxtLink>
  </div>
</section>
  </div>
</template>

<script setup lang="ts">
const subjects = [
  {
    name: "Question Bank",
    copy: "Create, organize and manage quiz questions"
  },
  {
    name: "Classes",
    copy: "Create classes and manage student groups"
  },
  {
    name: "Assignments",
    copy: "Assign quizzes and track submissions"
  },
  {
    name: "Live Sessions",
    copy: "Conduct real-time quizzes with students"
  },
  {
    name: "Reports",
    copy: "Analyze scores and performance statistics"
  },
  {
    name: "Dashboard",
    copy: "Monitor quizzes, classes and activities"
  }
];
const badges = ["Certified", "ISTE", "Level 3", "Privacy", "Schools", "Standards"];
const integrations = ["Google", "Teams", "Canvas", "Schoology", "OpenAI", "Stripe"];
</script>
