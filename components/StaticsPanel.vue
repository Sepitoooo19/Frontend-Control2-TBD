<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getUserTaskCountBySector,
  getNearestPendingTaskToUser,
  getSectorWithMostCompletedNearby,
  getAvgDistanceOfCompletedTasks,
  getPendingTasksHeatmap,
} from '~/services/statisticsService'
import type { Sector } from '~/types/types'

const stats = ref<{
  userBySector: Record<string, number> | null,
  nearestPending: { id: number, title: string, distance: number, sector: string } | null,
  sectorWithMostCompletedNearby: { sector: Sector, count: number } | null,
  avgCompleted: number | null,
  pendingHeatmap: Array<{ sector: Sector, pendingCount: number }> | null,
}>({
  userBySector: null,
  nearestPending: null,
  sectorWithMostCompletedNearby: null,
  avgCompleted: null,
  pendingHeatmap: null,
})

const error = ref('')
const radiusKm = ref(5) // default radius for sector with most completed

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
  <div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <h3 class="font-bold text-lg mb-2">Tareas del usuario por sector</h3>
      <pre>{{ stats.userBySector }}</pre>

      <h3 class="font-bold text-lg mb-2">Tarea pendiente más cercana al usuario</h3>
      <template v-if="stats.nearestPending">
        <div>
          <strong>{{ stats.nearestPending.title }}</strong> (ID: {{ stats.nearestPending.id }})<br />
          Distancia: {{ stats.nearestPending.distance.toFixed(2) }} km<br />
          Sector: {{ stats.nearestPending.sector }}
        </div>
      </template>
      <template v-else>
        <div>No hay tareas pendientes cercanas.</div>
      </template>

      <h3 class="font-bold text-lg mb-2">Sector con más tareas completadas en {{ radiusKm }} km</h3>
      <template v-if="stats.sectorWithMostCompletedNearby">
        <div>
          Sector: {{ stats.sectorWithMostCompletedNearby.sector.name }}<br />
          Tareas completadas: {{ stats.sectorWithMostCompletedNearby.count }}
        </div>
      </template>
      <template v-else>
        <div>No hay sectores con tareas completadas en este radio.</div>
      </template>

      <h3 class="font-bold text-lg mb-2">Promedio de distancia de tareas completadas respecto al usuario</h3>
      <div v-if="stats.avgCompleted !== null">
        {{ stats.avgCompleted.toFixed(2) }} km
      </div>
      <div v-else>
        No hay tareas completadas.
      </div>

      <h3 class="font-bold text-lg mb-2">Concentración de tareas pendientes en sectores</h3>
      <template v-if="stats.pendingHeatmap && stats.pendingHeatmap.length">
        <ul>
          <li v-for="item in stats.pendingHeatmap" :key="item.sector.id">
            {{ item.sector.name }}: {{ item.pendingCount }} pendientes
          </li>
        </ul>
      </template>
      <div v-else>
        No hay datos de concentración de tareas pendientes.
      </div>
    </div>
  </div>
</template>