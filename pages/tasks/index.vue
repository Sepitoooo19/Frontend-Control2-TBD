<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMyTasks, deleteTask as deleteTaskService } from '~/services/taskService'
import type { Task } from '~/types/types'

// Configuración de la página
definePageMeta({
  layout: 'user',
  middleware: 'auth-role' // Cambiar a 'authRole' que es el nombre de tu archivo
})

const tasks = ref<Task[]>([])
const loading = ref(true)

const loadTasks = async () => {
  try {
    loading.value = true
    tasks.value = await getMyTasks()
    console.log('Tareas cargadas:', tasks.value)
  } catch (error) {
    console.error('Error cargando tareas:', error)
  } finally {
    loading.value = false
  }
}

// Función para eliminar tarea
const deleteTask = async (taskId: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    return
  }
  
  try {
    await deleteTaskService(taskId)
    // Recargar la lista de tareas después de eliminar
    await loadTasks()
  } catch (error) {
    console.error('Error eliminando tarea:', error)
    alert('Error al eliminar la tarea')
  }
}

onMounted(() => {
  loadTasks()
})
</script>

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

    <div v-else-if="tasks.length === 0" class="text-center py-8 text-gray-500">
      No tienes tareas asignadas.
      <nuxt-link to="/tasks/create" class="text-blue-500 hover:underline ml-2">
        ¡Crea tu primera tarea!
      </nuxt-link>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold">{{ task.title }}</h3>
          <span
            :class="{
              'bg-yellow-100 text-yellow-800': task.status === 'PENDING',
              'bg-blue-100 text-blue-800': task.status === 'IN_PROGRESS',
              'bg-green-100 text-green-800': task.status === 'COMPLETED'
            }"
            class="px-2 py-1 rounded text-xs font-medium"
          >
            {{ task.status === 'PENDING' ? 'Pendiente' : 
               task.status === 'IN_PROGRESS' ? 'En Progreso' : 'Completada' }}
          </span>
        </div>
        
        <p class="text-gray-600 mb-2">{{ task.description }}</p>
        
        <div class="text-sm text-gray-500 mb-4">
          <p v-if="task.dueDate">
            Vence: {{ new Date(task.dueDate).toLocaleString() }}
          </p>
        </div>

        <div class="flex space-x-2">
          <nuxt-link
            :to="`/tasks/${task.id}/edit`"
            class="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Editar
          </nuxt-link>
          <button
            @click="deleteTask(task.id)"
            class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>