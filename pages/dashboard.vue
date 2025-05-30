<template>
  <div class="container mx-auto py-8">
    <div class="bg-gradient-to-r from-blue-100 to-blue-300 rounded-xl p-8 mb-8 shadow">
      <h1 class="text-3xl font-bold mb-2 text-blue-800 flex items-center gap-2">
        <span>👋</span> Dashboard de Usuario
      </h1>
      <h2 class="text-xl font-semibold mb-2">Bienvenido, <span class="text-blue-700">{{ userName }}</span></h2>
      <p class="text-gray-700">Aquí puedes ver tus tareas, sectores y estadísticas recientes.</p>
    </div>

    <div class="grid gap-6 md:grid-cols-3 mb-8">
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-semibold mb-2 flex items-center gap-1">📝 Tareas recientes</h3>
        <TaskList :tasks="tasks" :limit="5" />
        <div class="mt-2 text-right">
          <NuxtLink to="/tasks" class="text-blue-600 hover:underline">Ver todas mis tareas</NuxtLink>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-semibold mb-2 flex items-center gap-1">📊 Estadísticas rápidas</h3>
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
import { getTasks } from '~/services/taskService'
import type { Task } from '~/types/types'

const userStore = useUserStore()
const router = useRouter()
const userName = userStore.userName || 'Usuario'
const tasks = ref<Task[]>([]) // <-- Tipo explícito

definePageMeta({ layout: 'user', middleware: 'auth-role' })

onMounted(async () => {
  // Verifica sesión válida
  const userId = localStorage.getItem('userId')
  if (!userId) {
    router.push('/login')
    return
  }
  tasks.value = await getTasks()
  if (tasks.value.length > 5) tasks.value = tasks.value.slice(0, 5)
})
</script>