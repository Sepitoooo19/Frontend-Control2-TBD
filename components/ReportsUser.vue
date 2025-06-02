<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  getUserTaskCountBySector,
  getNearestPendingTaskToUser,
  getSectorWithMostCompletedNearby,
  getAvgDistanceOfCompletedTasks,
  getSectorWithMostCompletedNearby5k,
  getNearestPendingTaskToUserAllUsers,
} from '~/services/staticsService';
import { getMyTasks } from '~/services/taskService';
import type { Sector, Task } from '~/types/types';

// Tipo extendido para tareas que pueden venir con campos adicionales
interface NearestPendingTaskAllUsers extends Task {
  userName?: string;
  distance?: number;
}

type UserStats = {
  userBySector: Array<{ sector_name: string, task_count: number }> | null,
  nearestPending: { id: number, title: string, distance: number, sector: string } | null,
  sectorWithMostCompletedNearby: { sector: Sector, count: number } | null,
  avgCompleted: number | null,
  sectorWithMostCompletedNearby5k: { sector: Sector, count: number } | null,
  nearestPendingAllUsers: NearestPendingTaskAllUsers | null,
};

const stats = ref<UserStats>({
  userBySector: null,
  nearestPending: null,
  sectorWithMostCompletedNearby: null,
  avgCompleted: null,
  sectorWithMostCompletedNearby5k: null,
  nearestPendingAllUsers: null,
});

const myPendingTasks = ref<Task[]>([]);
const error = ref('');
const isLoading = ref(true);
const userLocationAvailable = ref(false);
const userRole = ref<string | null>(null);

onMounted(async () => {
  isLoading.value = true;
  error.value = '';
  userRole.value = localStorage.getItem('role');
  userLocationAvailable.value = !!localStorage.getItem('userLocationWKT');

  try {
    // Obtiene cantidad de tareas por sector (array de objetos)
    const userBySectorRaw = await getUserTaskCountBySector();
    stats.value.userBySector = Object.entries(userBySectorRaw).map(([sector_name, task_count]) => ({
      sector_name,
      task_count,
    }));

    // Todas mis tareas pendientes (no depende de ubicación)
    const allTasks = await getMyTasks();
    myPendingTasks.value = allTasks.filter(t => t.status === 'PENDING');

    if (userLocationAvailable.value) {
      try {
        stats.value.nearestPending = await getNearestPendingTaskToUser();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          stats.value.nearestPending = null;
        } else {
          throw err;
        }
      }
      try {
        stats.value.sectorWithMostCompletedNearby = await getSectorWithMostCompletedNearby(2);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          stats.value.sectorWithMostCompletedNearby = null;
        } else {
          throw err;
        }
      }
      try {
        stats.value.avgCompleted = await getAvgDistanceOfCompletedTasks();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          stats.value.avgCompleted = null;
        } else {
          throw err;
        }
      }
      try {
        stats.value.sectorWithMostCompletedNearby5k = await getSectorWithMostCompletedNearby5k();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          stats.value.sectorWithMostCompletedNearby5k = null;
        } else {
          throw err;
        }
      }
      try {
        stats.value.nearestPendingAllUsers = await getNearestPendingTaskToUserAllUsers();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          stats.value.nearestPendingAllUsers = null;
        } else {
          throw err;
        }
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Ocurrió un error desconocido.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-white rounded-xl shadow p-6">
    <h2 class="text-xl font-bold mb-6 text-blue-700">Tu Panel de Estadísticas</h2>
    <div v-if="isLoading" class="text-center text-gray-500 py-4">Cargando estadísticas...</div>
    <div v-if="error && !isLoading" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">Error: </strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-if="!userLocationAvailable && !isLoading && !error && userRole === 'USER'" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">Advertencia:</strong>
      <span class="block sm:inline"> Tu ubicación no está disponible. Algunas estadísticas no se mostrarán o estarán incompletas. Por favor, revisa tu perfil o inicia sesión nuevamente para asegurar que tu ubicación esté registrada.</span>
    </div>

    <div v-if="!isLoading && !error && userRole === 'USER'" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Tareas por sector -->
      <div class="border p-4 rounded-lg">
        <h3 class="font-semibold text-gray-700 mb-2">Mis Tareas por Sector:</h3>
        <ul v-if="stats.userBySector && stats.userBySector.length > 0" class="list-disc ml-5 space-y-1 text-sm">
          <li v-for="row in stats.userBySector" :key="row.sector_name">
            {{ row.sector_name }}: <span class="font-semibold">{{ row.task_count }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-500 text-sm">No hay datos de tareas por sector.</p>
      </div>

      <!-- Todas mis tareas pendientes -->
      <div class="border p-4 rounded-lg">
        <h3 class="font-semibold text-gray-700 mb-2">Todas mis tareas pendientes:</h3>
        <ul v-if="myPendingTasks.length">
          <li v-for="task in myPendingTasks" :key="task.id">
            {{ task.title }} - {{ task.location }}
          </li>
        </ul>
        <p v-else class="text-gray-500 text-sm">No tienes tareas pendientes asignadas.</p>
      </div>

      <!-- Mi tarea pendiente más cercana -->
      <div class="border p-4 rounded-lg">
        <h3 class="font-semibold text-gray-700 mb-2">Mi Tarea Pendiente Más Cercana:</h3>
        <div v-if="userLocationAvailable && stats.nearestPending" class="text-sm space-y-0.5">
          <p>Título: "<span class="font-semibold">{{ stats.nearestPending.title }}</span>"</p>
          <p>Distancia: <span class="font-semibold">{{ stats.nearestPending.distance.toFixed(2) }} km</span></p>
          <p>Sector: <span class="font-semibold">{{ stats.nearestPending.sector }}</span></p>
        </div>
        <p v-else class="text-gray-500 text-sm">
          {{ userLocationAvailable ? 'No tienes tareas pendientes cercanas.' : 'Ubicación no disponible para esta estadística.' }}
        </p>
      </div>

      <!-- Sector más activo cerca (2km, completadas) -->
      <div class="border p-4 rounded-lg">
        <h3 class="font-semibold text-gray-700 mb-2">Sector Más Activo Cerca (2km, completadas):</h3>
        <div v-if="userLocationAvailable && stats.sectorWithMostCompletedNearby" class="text-sm space-y-0.5">
          <p>Sector: <span class="font-semibold">{{ stats.sectorWithMostCompletedNearby.sector.name }}</span></p>
          <p>Tareas Completadas: <span class="font-semibold">{{ stats.sectorWithMostCompletedNearby.count }}</span></p>
        </div>
        <p v-else class="text-gray-500 text-sm">
          {{ userLocationAvailable ? 'No hay datos.' : 'Ubicación no disponible para esta estadística.' }}
        </p>
      </div>

      <!-- Promedio distancia tareas completadas -->
      <div class="border p-4 rounded-lg">
        <h3 class="font-semibold text-gray-700 mb-2">Promedio Distancia (Mis Tareas Completadas):</h3>
         <p v-if="userLocationAvailable && stats.avgCompleted !== null" class="text-sm"><span class="font-semibold">{{ stats.avgCompleted.toFixed(2) }} km</span></p>
        <p v-else class="text-gray-500 text-sm">
          {{ userLocationAvailable ? 'No hay datos.' : 'Ubicación no disponible para esta estadística.' }}
        </p>
      </div>
      
      <!-- Sector más activo cerca (5km, completadas) -->
      <div class="border p-4 rounded-lg">
        <h3 class="font-semibold text-gray-700 mb-2">Sector Más Activo Cerca (5km, completadas):</h3>
        <div v-if="userLocationAvailable && stats.sectorWithMostCompletedNearby5k" class="text-sm space-y-0.5">
           <p>Sector: <span class="font-semibold">{{ stats.sectorWithMostCompletedNearby5k.sector.name }}</span></p>
           <p>Tareas Completadas: <span class="font-semibold">{{ stats.sectorWithMostCompletedNearby5k.count }}</span></p>
        </div>
        <p v-else class="text-gray-500 text-sm">
          {{ userLocationAvailable ? 'No hay datos.' : 'Ubicación no disponible para esta estadística.' }}
        </p>
      </div>

      <!-- Tarea pendiente más cercana (general) -->
      <div class="border p-4 rounded-lg">
        <h3 class="font-semibold text-gray-700 mb-2">Tarea Pendiente Más Cercana (General):</h3>
        <div v-if="userLocationAvailable && stats.nearestPendingAllUsers" class="text-sm space-y-0.5">
          <p>Título: "<span class="font-semibold">{{ stats.nearestPendingAllUsers.title }}</span>"</p>
          <p v-if="stats.nearestPendingAllUsers.userName">Usuario: <span class="font-semibold">{{ stats.nearestPendingAllUsers.userName }}</span></p>
          <p v-if="stats.nearestPendingAllUsers.distance !== undefined">Distancia: <span class="font-semibold">{{ stats.nearestPendingAllUsers.distance?.toFixed(2) }} km</span></p>
        </div>
        <p v-else class="text-gray-500 text-sm">
          {{ userLocationAvailable ? 'No hay tareas pendientes cercanas.' : 'Ubicación no disponible para esta estadística.' }}
        </p>
      </div>
    </div>
    
    <div v-if="!isLoading && !error && userRole !== 'USER'" class="text-gray-600 mt-4 text-center">
      Este panel de estadísticas es para usuarios. Si eres administrador, visita el panel de estadísticas de administrador.
      <span v-if="!userRole"> (O inicia sesión para ver tus estadísticas.)</span>
    </div>
  </div>
</template>