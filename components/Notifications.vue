<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTasks } from '~/services/taskService';

// Notifica si una tarea está cerca de vencer (por ejemplo, menos de 2 días)
const notifications = ref([]);

onMounted(async () => {
  const tasks = await getTasks();
  const soon = [];
  const now = new Date();
  for (const task of tasks) {
    if (task.status === 'PENDING' && task.dueDate) {
      const due = new Date(task.dueDate);
      const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 2 && diff >= 0) {
        soon.push(task);
      }
    }
  }
  notifications.value = soon;
});
</script>
<template>
  <div v-if="notifications.length > 0" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
    <p class="font-bold">¡Atención! Tareas próximas a vencer:</p>
    <ul>
      <li v-for="task in notifications" :key="task.id">
        "{{ task.title }}" vence el {{ task.dueDate }}
      </li>
    </ul>
  </div>
</template>