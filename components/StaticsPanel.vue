<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getUserTaskCountBySector,
  getNearestPendingTaskToUser,
  getSectorWithMostCompletedNearby,
  getAvgDistanceOfCompletedTasks,
  getPendingTasksHeatmap,
} from '~/services/staticsService'
import type { Sector } from '~/types/types'

type Stats = {
  userBySector: Record<string, number> | null,
  nearestPending: { id: number, title: string, distance: number, sector: string } | null,
  sectorWithMostCompletedNearby: { sector: Sector, count: number } | null,
  avgCompleted: number | null,
  pendingHeatmap: Array<{ sector: Sector, pendingCount: number }> | null,
}

const stats = ref<Stats>({
  userBySector: null,
  nearestPending: null,
  sectorWithMostCompletedNearby: null,
  avgCompleted: null,
  pendingHeatmap: null,
})

const error = ref('')
const radiusKm = ref(5)

onMounted(async () => {
  try {
    stats.value.userBySector = await getUserTaskCountBySector()
    stats.value.nearestPending = await getNearestPendingTaskToUser()
    stats.value.sectorWithMostCompletedNearby = await getSectorWithMostCompletedNearby(radiusKm.value)
    stats.value.avgCompleted = await getAvgDistanceOfCompletedTasks()
    stats.value.pendingHeatmap = await getPendingTasksHeatmap()
  } catch {
    error.value = "Error al cargar estadísticas"
  }
})
</script>

<template>
  <div class="bg-white rounded-xl shadow p-6 mb-8">
    <h2 class="text-xl font-bold mb-4 text-blue-700">Panel de Estadísticas</h2>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <h3 class="font-semibold text-gray-700 mb-1">Tareas por Sector (Usuario):</h3>
        <ul class="list-disc ml-5">
          <li v-for="(count, sector) in stats.userBySector" :key="sector">
            {{ sector }}: <span class="font-semibold">{{ count }}</span>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-gray-700 mb-1">Tarea pendiente más cercana:</h3>
        <p v-if="stats.nearestPending">
          “<span class="font-semibold">{{ stats.nearestPending.title }}</span>” a {{ stats.nearestPending.distance.toFixed(2) }} km (Sector: {{ stats.nearestPending.sector }})
        </p>
        <p v-else class="text-gray-400">No hay tareas cercanas.</p>
      </div>
      <div>
        <h3 class="font-semibold text-gray-700 mb-1">Sector con más completadas cerca ({{ radiusKm }}km):</h3>
        <p v-if="stats.sectorWithMostCompletedNearby">
          {{ stats.sectorWithMostCompletedNearby.sector.name }} ({{ stats.sectorWithMostCompletedNearby.count }} completadas)
        </p>
        <p v-else class="text-gray-400">No hay datos.</p>
      </div>
      <div>
        <h3 class="font-semibold text-gray-700 mb-1">Promedio de distancia (tareas completadas):</h3>
        <p v-if="stats.avgCompleted !== null">{{ stats.avgCompleted.toFixed(2) }} km</p>
        <p v-else class="text-gray-400">No hay datos.</p>
      </div>
    </div>
    <div class="mt-4">
      <h3 class="font-semibold text-gray-700 mb-1">Heatmap de tareas pendientes:</h3>
      <ul class="list-disc ml-5">
        <li v-for="row in stats.pendingHeatmap" :key="row.sector.id">
          {{ row.sector.name }}: <span class="font-semibold">{{ row.pendingCount }}</span> pendientes
        </li>
      </ul>
    </div>
  </div>
</template>