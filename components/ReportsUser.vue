<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  getTasksByUserAndSector,
  getNearestPendingTaskForUser,
  getSectorWithMostCompletedIn2km,
  getAverageDistanceOfCompletedTasks,
  getSectorWithMostCompletedIn5km,
  getNearestPendingTaskAllUsers,
  getAllUserStats
} from '~/services/staticsService';
import { getMyTasks } from '~/services/taskService';
import { getUserLocation } from '~/services/userService';
import type { Sector, Task, NearestPendingTask } from '~/types/types';

interface NearestPendingTaskAllUsers extends Task {
  userName?: string;
  distance?: number;
}

type UserStats = {
  userBySector: Array<{ sector_name: string, task_count: number }> | null;
  nearestPending: NearestPendingTask | null;
  sectorWithMostCompletedNearby: { sector: Sector, count: number } | null;
  avgCompleted: number | null;
  sectorWithMostCompletedNearby5k: { sector: Sector, count: number } | null;
  nearestPendingAllUsers: NearestPendingTaskAllUsers | null;
};

// Estados reactivos
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

// Propiedades computadas
const hasNearestPendingData = computed(() => 
  !!userLocationAvailable.value && !!stats.value.nearestPending
);

const hasSectorMostCompletedData = computed(() => 
  !!userLocationAvailable.value && !!stats.value.sectorWithMostCompletedNearby
);

const hasAvgCompletedData = computed(() => 
  !!userLocationAvailable.value && stats.value.avgCompleted !== null
);

const hasSectorMostCompleted5kData = computed(() => 
  !!userLocationAvailable.value && !!stats.value.sectorWithMostCompletedNearby5k
);

const hasNearestPendingAllUsersData = computed(() => 
  !!userLocationAvailable.value && !!stats.value.nearestPendingAllUsers
);

// Carga inicial de datos
onMounted(async () => {
  isLoading.value = true
  error.value = ''
  userRole.value = localStorage.getItem('role')
  
  // Verificar si tenemos ubicación guardada
  let wktLocation = localStorage.getItem('userLocationWKT')
  userLocationAvailable.value = !!wktLocation

  try {
    const [sectorTasks, allTasks] = await Promise.all([
      getTasksByUserAndSector(),
      getMyTasks()
    ])

    stats.value.userBySector = sectorTasks
    myPendingTasks.value = allTasks.filter(t => t.status === 'PENDING')

    // Si no teníamos ubicación, intentamos obtenerla
    if (!wktLocation) {
      const locationResponse = await getUserLocation()
      if (locationResponse.success && locationResponse.location) {
        wktLocation = locationResponse.location
        localStorage.setItem('userLocationWKT', wktLocation)
        userLocationAvailable.value = true
      } else {
        console.warn('No se pudo obtener la ubicación:')
      }
    }

    // Cargar stats geoespaciales si tenemos ubicación
    if (userLocationAvailable.value) {
      await loadGeospatialStats()
    }
  } catch (e: any) {
    handleError(e)
  } finally {
    isLoading.value = false
  }
})

// Carga de estadísticas geoespaciales
const loadGeospatialStats = async () => {
  try {
    const geoStats = await Promise.allSettled([
      getNearestPendingTaskForUser(),
      getSectorWithMostCompletedIn2km(),
      getAverageDistanceOfCompletedTasks(),
      getSectorWithMostCompletedIn5km(),
      getNearestPendingTaskAllUsers()
    ]);

    stats.value.nearestPending = getResult(geoStats[0]);
    stats.value.sectorWithMostCompletedNearby = getResult(geoStats[1]);
    stats.value.avgCompleted = getResult(geoStats[2]);
    stats.value.sectorWithMostCompletedNearby5k = getResult(geoStats[3]);
    stats.value.nearestPendingAllUsers = getResult(geoStats[4]);
  } catch (e: any) {
    handleError(e);
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper para extraer resultados de Promise.allSettled
const getResult = <T>(result: PromiseSettledResult<T>): T | null => {
  return result.status === 'fulfilled' ? result.value : null;
};

// Manejo centralizado de errores
const handleError = (error: any) => {
  console.error('Error:', error);
  error.value = error.message || 'Ocurrió un error al cargar las estadísticas.';
};
</script>

<template>
  <div class="bg-white rounded-xl shadow p-6">
    <h2 class="text-xl font-bold mb-6 text-blue-700">Tu Panel de Estadísticas</h2>
    
    <!-- Estado de carga -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-flex items-center space-x-2">
        <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Cargando estadísticas...</span>
      </div>
    </div>
    
    <!-- Mensaje de error -->
    <div v-if="error && !isLoading" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Advertencia de ubicación -->
    <div v-if="!userLocationAvailable && !isLoading && !error && userRole === 'USER'" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Tu ubicación no está disponible. Algunas estadísticas no se mostrarán o estarán incompletas. Por favor, actualiza tu ubicación en el perfil.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div v-if="!isLoading && !error && userRole === 'USER'" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      
      <!-- Tarjeta de Tareas por Sector -->
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 class="font-medium text-gray-700">Mis Tareas por Sector</h3>
        </div>
        <div class="p-4">
          <ul v-if="stats.userBySector?.length" class="divide-y divide-gray-200">
            <li v-for="row in stats.userBySector" :key="row.sector_name" class="py-2 flex justify-between">
              <span class="text-gray-600">{{ row.sector_name }}</span>
              <span class="font-medium">{{ row.task_count }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500 text-sm">No hay datos de tareas por sector.</p>
        </div>
      </div>
      
      <!-- Tarjeta de Tareas Pendientes -->
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 class="font-medium text-gray-700">Mis Tareas Pendientes</h3>
        </div>
        <div class="p-4">
          <ul v-if="myPendingTasks.length" class="space-y-2">
            <li v-for="task in myPendingTasks" :key="task.id" class="text-sm">
              <p class="font-medium">{{ task.title }}</p>
              <p class="text-gray-500 text-xs">{{ task.location }}</p>
            </li>
          </ul>
          <p v-else class="text-gray-500 text-sm">No tienes tareas pendientes.</p>
        </div>
      </div>
      
      <!-- Tarjeta de Tarea Más Cercana -->
      <StatCard 
        title="Mi Tarea Pendiente Más Cercana"
        :hasData="userLocationAvailable && !!stats.nearestPending"
        :noDataMessage="userLocationAvailable ? 'No hay tareas pendientes cercanas' : 'Ubicación no disponible'"
      >
        <template v-if="stats.nearestPending">
          <p class="text-sm"><span class="font-medium">Título:</span> {{ stats.nearestPending.title }}</p>
          <p class="text-sm"><span class="font-medium">Descripción:</span> {{ stats.nearestPending.description }}</p>
          <p class="text-sm"><span class="font-medium">Ubicación:</span> {{ stats.nearestPending.location }}</p>
          <p class="text-sm"><span class="font-medium">Fecha límite:</span> {{ formatDate(stats.nearestPending.dueDate) }}</p>
        </template>
      </StatCard>

      
      <!-- Tarjeta de Sector Más Activo (2km) 
      
      <StatCard 
        title="Sector Más Activo (2km)"
        :hasData="hasSectorMostCompletedData"
        :noDataMessage="userLocationAvailable ? 'No hay datos' : 'Ubicación no disponible'"
      >
        <template v-if="stats.sectorWithMostCompletedNearby">
          <p class="text-sm"><span class="font-medium">Sector:</span> {{ stats.sectorWithMostCompletedNearby.sector.name }}</p>
          <p class="text-sm"><span class="font-medium">Completadas:</span> {{ stats.sectorWithMostCompletedNearby.count }}</p>
        </template>
      </StatCard>
      -->
      <!-- Tarjeta de Distancia Promedio -->
      <StatCard 
        title="Distancia Promedio (Completadas)"
        :hasData="hasAvgCompletedData"
        :noDataMessage="userLocationAvailable ? 'No hay datos' : 'Ubicación no disponible'"
      >
        <template v-if="stats.avgCompleted !== null">
          <p class="text-sm"><span class="font-medium">Distancia promedio:</span> {{ stats.avgCompleted.toFixed(2) }} km</p>
        </template>
      </StatCard>
      
      <!-- Tarjeta de Sector Más Activo (5km) 
      <StatCard 
        title="Sector Más Activo (5km)"
        :hasData="hasSectorMostCompleted5kData"
        :noDataMessage="userLocationAvailable ? 'No hay datos' : 'Ubicación no disponible'"
      >
        <template v-if="stats.sectorWithMostCompletedNearby5k">
          <p class="text-sm"><span class="font-medium">Sector:</span> {{ stats.sectorWithMostCompletedNearby5k.sector.name }}</p>
          <p class="text-sm"><span class="font-medium">Completadas:</span> {{ stats.sectorWithMostCompletedNearby5k.count }}</p>
        </template>
      </StatCard>
      -->
      <!-- Tarjeta de Tarea Más Cercana (General) -->
      <StatCard 
        title="Tarea Más Cercana (General)"
        :hasData="hasNearestPendingAllUsersData"
        :noDataMessage="userLocationAvailable ? 'No hay tareas cercanas' : 'Ubicación no disponible'"
      >
        <template v-if="stats.nearestPendingAllUsers">
          <p class="text-sm"><span class="font-medium">Título:</span> {{ stats.nearestPendingAllUsers.title }}</p>
          <p v-if="stats.nearestPendingAllUsers.userName" class="text-sm">
            <span class="font-medium">Usuario:</span> {{ stats.nearestPendingAllUsers.userName }}
          </p>
          <p v-if="stats.nearestPendingAllUsers.distance !== undefined" class="text-sm">
            <span class="font-medium">Distancia:</span> {{ stats.nearestPendingAllUsers.distance?.toFixed(2) }} km
          </p>
        </template>
      </StatCard>
    </div>
    
    <!-- Mensaje para no usuarios -->
    <div v-if="!isLoading && !error && userRole !== 'USER'" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Panel no disponible</h3>
      <p class="mt-1 text-sm text-gray-500">
        Este panel de estadísticas es exclusivo para usuarios. 
        <span v-if="!userRole">Por favor inicia sesión.</span>
      </p>
    </div>
  </div>
</template>