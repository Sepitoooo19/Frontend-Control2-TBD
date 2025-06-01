<template>
  <div class="flex flex-col gap-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Gestión de Tareas (Admin)</h1>
      <nuxt-link
        to="/tasks/create"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Nueva Tarea
      </nuxt-link>
    </div>
    <TaskList
      :tasks="tasks"
      :is-admin="true"
      @deleted="loadTasks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TaskList from '~/components/tasks/TaskList.vue'
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