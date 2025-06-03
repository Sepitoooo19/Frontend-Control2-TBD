<template>
  <div class="container mx-auto py-10 px-4">
    <!-- Welcome Banner + Due Soon Notifications -->
    <div class="flex flex-col lg:flex-row gap-6 mb-10">
      <!-- Existing Welcome Banner -->
      <div class="bg-gradient-to-r from-blue-100 to-blue-300 rounded-xl p-8 shadow flex flex-col items-center flex-1">
        <h1 class="text-3xl font-extrabold mb-2 text-blue-800 flex items-center gap-2">
          <span>👋</span> Dashboard de Usuario
        </h1>
        <h2 class="text-lg font-medium mb-2 text-blue-700">Bienvenido, <span class="text-blue-900">{{ userName }}</span></h2>
        <p class="text-gray-700 text-center max-w-2xl">
          Aquí puedes ver tus tareas recientes, estadísticas y tus sectores asignados. ¡Accede rápido a tus recursos!
        </p>
      </div>

      <!-- New Due Soon Notifications -->
      <div class="bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl p-6 shadow flex-1 min-w-[300px]">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">⏰</span>
          <h3 class="text-xl font-bold text-orange-800">Tareas prontas a vencer</h3>
        </div>
        
        <div v-if="dueSoonTasks.length > 0" class="space-y-3">
          <div v-for="task in dueSoonTasks" :key="task.id" class="bg-white/70 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-center">
              <span class="font-mono text-sm text-gray-600">#{{ task.id }}</span>
              <span class="text-xs px-2 py-1 rounded-full" 
                    :class="getUrgencyClass(task.dueDate)">
                {{ getTimeRemaining(task.dueDate) }}
              </span>
            </div>
            <h4 class="font-medium text-gray-800 truncate">{{ task.title }}</h4>
          </div>
        </div>
        
        <div v-else class="text-center py-4 text-gray-500">
          <p>No hay tareas próximas a vencer</p>
        </div>
      </div>
    </div>

    <div class="grid gap-8 md:grid-cols-3">
      <!-- Tareas recientes (más ancho) -->
      <div class="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow border-t-4 border-blue-500 min-w-0">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">📝</span>
          <h3 class="text-xl font-bold text-gray-800 flex-1">Mis tareas recientes</h3>
        </div>
        <TaskList :tasks="tasks" :limit="5" />
        <div class="mt-4 text-right">
          <NuxtLink to="/tasks" class="text-blue-600 hover:underline font-semibold">Ver todas mis tareas</NuxtLink>
        </div>
      </div>
      <!-- Estadísticas -->
      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-t-4 border-green-500">
        <div class="bg-green-100 rounded-full p-3 mb-3">
          <span class="text-2xl">📈</span>
        </div>
        <h4 class="text-base font-bold mb-1 text-gray-700">Estadísticas rápidas</h4>
        <UserStats />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/auth'
import TaskList from '~/components/tasks/TaskList.vue'
import UserStats from '~/components/users/UserStats.vue'
import { 
  getMyTasks,
  isCloseToDueDate,
  getTimeRemaining,
  getUrgencyClass,
  getDueSoonTasks
} from '~/services/taskService'
import type { Task } from '~/types/types'

const userStore = useUserStore()
const router = useRouter()
const userName = userStore.userName || 'Usuario'
const tasks = ref<Task[]>([])

definePageMeta({ layout: 'user', middleware: 'auth-role' })

const dueSoonTasks = computed(() => getDueSoonTasks(tasks.value))

onMounted(async () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    router.push('/login')
    return
  }
  
  tasks.value = (await getMyTasks()).slice(0, 5)
})
</script>

<style scoped>
/* Optional: Add some transitions for smoother hover effects */
.task-card {
  transition: all 0.2s ease;
}
</style>