<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  getStatsUserBySector,
  getNearestPendingTask,
  getAvgDistanceOfCompleted,
  // ...agrega más funciones según tus queries espaciales
} from '~/services/taskService';

const stats = ref({
  userBySector: null,
  nearestPending: null,
  avgCompleted: null,
  // ...más resultados aquí
});
const error = ref('');

onMounted(async () => {
  try {
    stats.value.userBySector = await getStatsUserBySector();
    stats.value.nearestPending = await getNearestPendingTask();
    stats.value.avgCompleted = await getAvgDistanceOfCompleted();
    // ...llama más funciones según lo que implementes en backend
  } catch {
    error.value = "Error al cargar estadísticas";
  }
});
</script>
<template>
  <div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <h3 class="font-bold text-lg mb-2">Tareas del usuario por sector</h3>
      <pre>{{ stats.userBySector }}</pre>
      <h3 class="font-bold text-lg mb-2">Tarea pendiente más cercana</h3>
      <pre>{{ stats.nearestPending }}</pre>
      <h3 class="font-bold text-lg mb-2">Promedio de distancia de tareas completadas</h3>
      <pre>{{ stats.avgCompleted }}</pre>
      <!-- Agrega más bloques para los otros resultados -->
    </div>
  </div>
</template>