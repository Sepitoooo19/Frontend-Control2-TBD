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