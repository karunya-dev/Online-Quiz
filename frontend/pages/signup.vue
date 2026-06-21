<template>
  <AuthLayout mode="signup">
    <h1>Welcome to Wayground</h1>
    <p>Already have an account? <NuxtLink style="color: #005bd3; font-weight: 900" to="/login">Log in</NuxtLink></p>
    <div class="auth-options">

    </div>
    <form class="form-grid" @submit.prevent="submit">
      <label>Name <input ref="nameInput" v-model="name" class="input" required /></label>
      <label>Email <input v-model="email" class="input" type="email" required /></label>
      <label>Password <input v-model="password" class="input" type="password" minlength="6" required /></label>
      <label>Role
        <select v-model="role" class="select">
          <option value="TEACHER">Teacher</option>
          <option value="STUDENT">Student</option>
          
        </select>
      </label>
      <button class="btn btn-primary" type="submit">Create account</button>
      <p v-if="notice" class="success">{{ notice }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
const { signup } = useApi();
const name = ref("");
const email = ref("");
const password = ref("");
const role = ref("");
const error = ref("");
const notice = ref("");
const nameInput = ref<HTMLInputElement | null>(null);

function activateEmailSignup() {
  error.value = "";
  notice.value = "";
  nameInput.value?.focus();
}

function showComingSoon(provider: string) {
  error.value = "";
  notice.value = `${provider} signup is Coming Soon.`;
}

async function submit() {
  console.log("SIGNUP BUTTON CLICKED");

  error.value = "";
  notice.value = "";

  try {
    console.log("Calling signup API");

    await signup({
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value
    });

    console.log("Signup success");

    await navigateTo("/dashboard");
  } catch (err: any) {
    console.error("Signup Error:", err);
    error.value = JSON.stringify(err, null, 2);
  }
}
</script>
