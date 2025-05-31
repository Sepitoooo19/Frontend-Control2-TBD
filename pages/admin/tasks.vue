<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Gestión de Tareas (Admin)</h1>
    <TaskList :tasks="tasks" :is-admin="true" @deleted="loadTasks"/>
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