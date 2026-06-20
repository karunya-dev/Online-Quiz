<template>
   
  <AppShell>
    <div>
      <h1>Manage Classes</h1>

      <input v-model="className" placeholder="Class Name" />

      <input v-model="grade" placeholder="Grade" />

      <button @click="createClass">
        Create Class
      </button>
      <section style="margin-top: 24px">
  <h2>My Classes</h2>

  <div
    v-for="item in classes"
    :key="item.id"
    class="panel"
    style="margin-bottom: 12px"
  >
    <h3>{{ item.name }}</h3>
    <p>Grade: {{ item.grade }}</p>

    <div>
      <button @click="editClass(item)">
        Edit
      </button>

      <button @click="deleteClass(item.id)">
        Delete
      </button>
    </div>
  </div>
</section>
    </div>
  </AppShell>
     
</template>

<script setup lang="ts">

import { ref } from "vue";
const editingId = ref("");
const className = ref("");
const grade = ref("");
const classes = ref<any[]>([]);

const { request } = useApi();

async function createClass() {

  if (editingId.value) {

    await request(`/classes/${editingId.value}`, {
      method: "PUT",
      body: {
        name: className.value,
        grade: grade.value
      }
    });

    alert("Class Updated");

    editingId.value = "";

  } else {

    await request("/classes", {
      method: "POST",
      body: {
        name: className.value,
        grade: grade.value
      }
    });

    alert("Class Created");
  }

  className.value = "";
  grade.value = "";

  await loadClasses();
}

async function deleteClass(id: string) {

  if (!confirm("Delete this class?")) {
    return;
  }

  await request(`/classes/${id}`, {
    method: "DELETE"
  });

  await loadClasses();
}
async function loadClasses() {
  const response = await request("/classes");

  classes.value = response.classes;
}
onMounted(async () => {
  await loadClasses();
});

function editClass(item: any) {
  editingId.value = item.id;

  className.value = item.name;
  grade.value = item.grade;
}
</script>