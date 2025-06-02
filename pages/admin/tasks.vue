<template>
  <div class="flex flex-col gap-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Gestión de Tareas (Admin)</h1>
      <nuxt-link to="/tasks/createAdmin" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Nueva Tarea
      </nuxt-link>
    </div>

    <!-- Mapa de tareas -->
    <div class="rounded-lg border border-gray-200 shadow-md">
      <TaskMap :tasks="tasks" />
    </div>

    <!-- Lista de tareas -->
    <TaskList
      :tasks="tasks"
      :is-admin="true"
      @deleted="loadTasks"
      @completed="loadTasks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TaskList from '~/components/tasks/TaskList.vue'
import TaskMap from '~/components/tasks/TaskMap.vue' // Nuevo componente
import { getAllTasks } from '~/services/taskService'
import type { Task } from '~/types/types'

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
})

const tasks = ref<Task[]>([])

const loadTasks = async () => {
  tasks.value = await getAllTasks()
}

onMounted(loadTasks)
</script>