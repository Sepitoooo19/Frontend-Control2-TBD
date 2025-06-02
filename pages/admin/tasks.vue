<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestión de Tareas</h1>
      <NuxtLink 
        to="/tasks/createAdmin" 
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Crear Nueva Tarea
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Mapa (SIEMPRE visible y con altura) -->
      <div class="h-[400px] md:h-[500px] rounded-lg border border-gray-200 shadow-md bg-white">
        <TaskMap :tasks="tasks" />
      </div>
      <!-- Lista de tareas -->
      <div>
        <TaskListAdmin 
          :tasks="tasks"
          @edit="onEdit"
          @delete="onDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TaskListAdmin from '~/components/tasks/TaskList.vue'
import TaskMap from '~/components/tasks/TaskMap.vue'
import { getAllTasks, deleteTask } from '~/services/taskService'
import type { Task } from '~/types/types'

const tasks = ref<Task[]>([])
const router = useRouter()

const fetchTasks = async () => {
  try {
    tasks.value = await getAllTasks()
  } catch (error) {
    console.error('Error loading tasks:', error)
  }
}

const onEdit = (task: Task) => {
  router.push(`/admin/tasks/${task.id}/edit`)
}

const onDelete = async (id: number) => {
  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
    await deleteTask(id)
    await fetchTasks()
  }
}

onMounted(fetchTasks)

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
})
</script>