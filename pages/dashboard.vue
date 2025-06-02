<template>
  <div class="container mx-auto py-10 px-4">
    <div class="bg-gradient-to-r from-blue-100 to-blue-300 rounded-xl p-8 mb-10 shadow flex flex-col items-center">
      <h1 class="text-3xl font-extrabold mb-2 text-blue-800 flex items-center gap-2">
        <span>👋</span> Dashboard de Usuario
      </h1>
      <h2 class="text-lg font-medium mb-2 text-blue-700">Bienvenido, <span class="text-blue-900">{{ userName }}</span></h2>
      <p class="text-gray-700 text-center max-w-2xl">
        Aquí puedes ver tus tareas recientes, estadísticas y tus sectores asignados. ¡Accede rápido a tus recursos!
      </p>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/auth'
import TaskList from '~/components/tasks/TaskList.vue'
import UserSectors from '~/components/users/UserSectors.vue'
import UserStats from '~/components/users/UserStats.vue'
import { getMyTasks } from '~/services/taskService'
import type { Task } from '~/types/types'

const userStore = useUserStore()
const router = useRouter()
const userName = userStore.userName || 'Usuario'
const tasks = ref<Task[]>([])

definePageMeta({ layout: 'user', middleware: 'auth-role' })

onMounted(async () => {
  // Verifica sesión válida
  const userId = localStorage.getItem('userId')
  if (!userId) {
    router.push('/login')
    return
  }
  tasks.value = await getMyTasks()
  if (tasks.value.length > 5) tasks.value = tasks.value.slice(0, 5)
})
</script>