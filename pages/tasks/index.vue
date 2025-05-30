<template>
  <div class="container mx-auto py-8">
    <h1 class="text-3xl font-bold mb-2 text-blue-800 flex items-center gap-2">
      <span>📝</span> Mis Tareas
    </h1>
    <div class="bg-white rounded-lg shadow p-4 mb-8">
      <TaskList :tasks="tasks" />
      <div class="mt-2 text-right">
        <NuxtLink to="/tasks/create" class="text-blue-600 hover:underline">Crear nueva tarea</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TaskList from '~/components/tasks/TaskList.vue'
import { getTasks } from '~/services/taskService'
import type { Task } from '~/types/types'

definePageMeta({
  layout: 'user',
  middleware: 'auth-role'
})

const tasks = ref<Task[]>([])

const loadTasks = async () => {
  tasks.value = await getTasks()
  if (tasks.value.length > 5) tasks.value = tasks.value.slice(0, 5)
}

onMounted(loadTasks)
</script>