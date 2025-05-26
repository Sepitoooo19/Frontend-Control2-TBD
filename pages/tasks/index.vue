<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TaskList from '~/components/tasks/TaskList.vue'
import { getTasks, deleteTask } from '~/services/taskService'
import type { Task } from '~/types/types'

 definePageMeta({
    layout: 'user',
    middleware: 'auth-role' // Usa el layout de repartidor
  });

const router = useRouter()
const tasks = ref<Task[]>([])

onMounted(async () => {
  tasks.value = await getTasks()
})

const onEdit = (task: Task) => {
  router.push(`/tasks/${task.id}/edit`)
}

const onDelete = async (id: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
    await deleteTask(id)
    tasks.value = tasks.value.filter(task => task.id !== id)
  }
}
</script>

<template>
  <div class="container max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Mis Tareas</h2>
    <TaskList :tasks="tasks" @edit="onEdit" @delete="onDelete" />
  </div>
</template>

<style scoped>
</style>