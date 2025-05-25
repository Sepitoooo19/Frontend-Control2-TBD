<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTasks } from '~/services/taskService'
import type { Task } from '~/types/types'

const notifications = ref<Task[]>([])

onMounted(async () => {
  notifications.value = [] // Limpia antes de cargar
  const tasks = await getTasks()
  const now = new Date()
  notifications.value = tasks.filter(task => {
    if (task.status !== 'PENDING' || !task.dueDate) return false
    const due = new Date(task.dueDate)
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    // Entre hoy y 2 días
    return diff <= 2 && diff >= 0
  })
})

// Helper para mostrar la fecha de manera local y amigable
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}
</script>

<template>
  <div v-if="notifications.length > 0" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
    <p class="font-bold">¡Atención! Tareas próximas a vencer:</p>
    <ul>
      <li v-for="task in notifications" :key="task.id">
        “{{ task.title }}” vence el {{ formatDate(task.dueDate) }}
      </li>
    </ul>
  </div>
</template>