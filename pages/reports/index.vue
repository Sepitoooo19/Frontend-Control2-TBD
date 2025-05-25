<template>
  <div>
    <h1>Mis Reportes</h1>
    <div v-if="loading" class="text-center my-5"><div class="spinner-border"></div></div>

    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">Tareas por Sector (Mis Tareas)</div>
          <div class="card-body">
            <ul v-if="tasksBySector.length" class="list-group">
              <li v-for="stat in tasksBySector" :key="stat.sectorId" class="list-group-item d-flex justify-content-between align-items-center">
                {{ stat.sectorName }}
                <span class="badge bg-primary rounded-pill">{{ stat.totalTasks }}</span>
              </li>
            </ul>
            <p v-else>No hay datos de tareas por sector.</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">Distancia Promedio a Tareas Completadas</div>
          <div class="card-body">
            <p v-if="avgDistanceStats">
              La distancia promedio es: <strong>{{ avgDistanceStats.averageDistance.toFixed(2) }} km</strong> (aprox.)
            </p>
            <p v-else>No hay datos o no se pudieron calcular.</p>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTasksCountByUserPerSector, getAverageDistanceToCompletedTasks } from '~/services/taskService';
import type { TaskStatsBySector } from '~/types/types';
import { useNuxtApp } from '#app';

const { $toast } = useNuxtApp();

definePageMeta({
  middleware: 'auth-role',
});
useHead({
  title: 'Mis Reportes',
});

const loading = ref(true);
const tasksBySector = ref<TaskStatsBySector[]>([]);
const avgDistanceStats = ref<{ averageDistance: number } | null>(null);

onMounted(async () => {
  loading.value = true;
  try {
    const [sectorStats, distanceStats] = await Promise.allSettled([
      getTasksCountByUserPerSector(), // Asume que este endpoint filtra por el usuario autenticado
      getAverageDistanceToCompletedTasks() // Asume que este endpoint filtra por el usuario autenticado
    ]);

    if (sectorStats.status === 'fulfilled') {
      tasksBySector.value = sectorStats.value;
    } else {
      console.error("Error cargando tareas por sector:", sectorStats.reason);
      $toast.error('No se pudieron cargar estadísticas de tareas por sector.');
    }

    if (distanceStats.status === 'fulfilled') {
      avgDistanceStats.value = distanceStats.value;
    } else {
      console.error("Error cargando distancia promedio:", distanceStats.reason);
      $toast.error('No se pudieron cargar estadísticas de distancia promedio.');
    }

  } catch (error) { // Catch para errores no manejados por Promise.allSettled individualmente
    console.error("Error general cargando reportes:", error);
    $toast.error('Error al cargar algunos reportes.');
  } finally {
    loading.value = false;
  }
});
</script>