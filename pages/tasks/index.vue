<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Mis Tareas</h1>
      <nuxt-link
        to="/tasks/create"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Nueva Tarea
      </nuxt-link>
    </div>
    <div v-if="loading" class="text-center py-8">
      Cargando tareas...
    </div>
    <TaskListUser
      v-else
      :tasks="tasks"
      @deleted="loadTasks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TaskListUser from '~/components/tasks/TaskListUser.vue'
import { getMyTasks } from '~/services/taskService'
import type { Task } from '~/types/types'

definePageMeta({
  layout: 'user',
  middleware: 'auth-role'
})

const tasks = ref<Task[]>([])
const loading = ref(true)

const loadTasks = async () => {
  loading.value = true
  try {
    // El token y userId se obtienen automáticamente en taskService (usa localStorage)
    tasks.value = await getMyTasks()
  } catch (error) {
    console.error('Error cargando tareas:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadTasks)
</script>