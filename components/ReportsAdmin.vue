<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  getPendingTasksHeatmap,
  getTasksByUserPerSector,
} from '~/services/staticsService';
import type { Sector } from '~/types/types'; // Asegúrate de que Sector esté bien definido en types

// Interfaz para la estadística de tareas por usuario y sector
interface UserTaskBySector {
  userId: number;
  userName: string;
  sectorId: number;
  sectorName: string;
  taskCount: number;
}

// Interfaz para la estadística de heatmap de tareas pendientes
interface PendingTaskHeatmapItem {
  sector: Sector; // Asume que Sector tiene al menos 'id' y 'name'
  pendingCount: number;
}

type AdminStats = {
  pendingHeatmap: Array<PendingTaskHeatmapItem> | null,
  userTasksBySector: UserTaskBySector[] | null,
};

const stats = ref<AdminStats>({
  pendingHeatmap: null,
  userTasksBySector: null,
});

const errorHeatmap = ref('');
const errorUserTasksBySector = ref('');
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  errorHeatmap.value = '';
  errorUserTasksBySector.value = '';
  let hasGeneralError = false;

  // 1. Cargar Heatmap de Tareas Pendientes
  try {
    stats.value.pendingHeatmap = await getPendingTasksHeatmap();
    if (!stats.value.pendingHeatmap || stats.value.pendingHeatmap.length === 0) {
        // No es un error, pero no hay datos. El template lo manejará.
    }
  } catch (e: any) {
    console.error("Error fetching pending tasks heatmap:", e);
    if (e?.response?.status === 404) {
      // El endpoint no fue encontrado o no devolvió datos específicos.
      errorHeatmap.value = "No se pudieron cargar los datos del heatmap de tareas pendientes (recurso no encontrado o sin datos).";
    } else {
      errorHeatmap.value = e.message || "Error al cargar heatmap de tareas pendientes.";
    }
    hasGeneralError = true; // Marcar que hubo un error para la carga general
  }

  // 2. Cargar Tareas por Usuario y Sector
  try {
    stats.value.userTasksBySector = await getTasksByUserPerSector();
    if (!stats.value.userTasksBySector || stats.value.userTasksBySector.length === 0) {
        // No es un error, pero no hay datos.
    }
  } catch (e: any) {
    console.error("Error fetching tasks by user per sector:", e);
    if (e?.response?.status === 404) {
      errorUserTasksBySector.value = "No se pudieron cargar los datos de tareas por usuario y sector (recurso no encontrado o sin datos).";
    } else {
      errorUserTasksBySector.value = e.message || "Error al cargar tareas por usuario y sector.";
    }
    hasGeneralError = true; // Marcar que hubo un error
  }

  // Si no hubo errores específicos que no sean "no hay datos", y aun así todo está vacío,
  // O si hubo un error general no manejado por los try-catch individuales.
  // Por ahora, los errores individuales se mostrarán por sección.
  // El 'error.value' general podría usarse si ambas fallan de forma catastrófica.

  isLoading.value = false;
});
</script>

<template>
  <div class="bg-white rounded-xl shadow p-6">
    <h2 class="text-xl font-bold mb-6 text-red-700">Panel de Estadísticas (Admin)</h2>
    
    <div v-if="isLoading" class="text-center text-gray-500 py-10">
      <svg class="animate-spin h-8 w-8 text-red-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Cargando estadísticas...
    </div>

    <div v-if="!isLoading" class="grid gap-8 lg:grid-cols-2">
      
      <div class="border p-4 rounded-lg shadow-sm">
        <h3 class="font-semibold text-gray-800 mb-3 text-lg">Concentración de Tareas Pendientes por Sector</h3>
        <div v-if="errorHeatmap" class="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-3">
          {{ errorHeatmap }}
        </div>
        <ul v-if="stats.pendingHeatmap && stats.pendingHeatmap.length > 0" class="list-disc ml-5 space-y-1 text-sm text-gray-700">
          <li v-for="row in stats.pendingHeatmap" :key="row.sector.id">
            <span class="font-medium">{{ row.sector.name }}</span>: <span class="font-semibold text-red-600">{{ row.pendingCount }}</span> pendientes
          </li>
        </ul>
        <p v-else-if="!errorHeatmap && (!stats.pendingHeatmap || stats.pendingHeatmap.length === 0)" class="text-gray-500 text-sm italic">
          No hay datos de concentración de tareas pendientes para mostrar.
        </p>
      </div>

      <div class="border p-4 rounded-lg shadow-sm lg:col-span-1"> 
        <h3 class="font-semibold text-gray-800 mb-3 text-lg">Tareas Realizadas por Usuario y Sector</h3>
        <div v-if="errorUserTasksBySector" class="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-3">
          {{ errorUserTasksBySector }}
        </div>
        <div v-if="stats.userTasksBySector && stats.userTasksBySector.length > 0" class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-100">
              <tr class="border-b">
                <th class="px-4 py-2 text-left font-medium text-gray-600">Usuario</th>
                <th class="px-4 py-2 text-left font-medium text-gray-600">Sector</th>
                <th class="px-4 py-2 text-right font-medium text-gray-600">N° Tareas</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="row in stats.userTasksBySector" :key="row.userId + '-' + row.sectorId" class="hover:bg-gray-50">
                <td class="px-4 py-2 whitespace-nowrap text-gray-700">{{ row.userName }} <span class="text-xs text-gray-500">(ID: {{ row.userId }})</span></td>
                <td class="px-4 py-2 whitespace-nowrap text-gray-700">{{ row.sectorName }} <span class="text-xs text-gray-500">(ID: {{ row.sectorId }})</span></td>
                <td class="px-4 py-2 whitespace-nowrap text-right font-semibold text-red-600">{{ row.taskCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else-if="!errorUserTasksBySector && (!stats.userTasksBySector || stats.userTasksBySector.length === 0)" class="text-gray-500 text-sm italic">
          No hay datos de tareas por usuario y sector para mostrar.
        </p>
      </div>

    </div>
  </div>
</template>