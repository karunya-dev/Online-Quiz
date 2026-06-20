<template>
  <AppShell>
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Live Quiz Hosting</p>
        <h1>Live Sessions</h1>
      </div>
    </header>

```
<section class="card-grid">
  <article class="panel">
    <h3>Science Systems Check</h3>

    <p>Session PIN: 654321</p>
    <p>Status: Active</p>

    <div class="cta-row">
      <button class="btn btn-primary">
        Start Session
      </button>

      <button class="btn btn-outline">
        End Session
      </button>
    </div>
  </article>

  <article class="panel">
    <h3>Math Quiz</h3>

    <p>Session PIN: 987654</p>
    <p>Status: Waiting</p>

    <div class="cta-row">
      <button class="btn btn-primary">
        Start Session
      </button>

      <button class="btn btn-outline">
        End Session
      </button>
    </div>
  </article>
</section>
```

  </AppShell>
</template>


<script setup lang="ts">

const { request } = useApi();

async function startSession() {

  const response = await request("/sessions", {
    method: "POST",
    body: {
      resourceId: selectedQuiz
    }
  });

  alert(
    `PIN: ${response.pinCode}`
  );
}
</script>