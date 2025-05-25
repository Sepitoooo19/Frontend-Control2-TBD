<template>
  <div>
    <h1>Dashboard del Usuario</h1>
    <p>Bienvenido, {{ userProfile?.name || 'Usuario' }}.</p>

    <div class="row">
      <div class="col-md-8">
        <h3 class="mb-3">Resumen de Tareas</h3>
        <div v-if="nearestTask" class="alert alert-info">
          <h4>Próxima Tarea Pendiente Más Cercana:</h4>
          <p><strong>{{ nearestTask.title }}</strong></p>
          <p>Fecha Límite: {{ formatDateTime(nearestTask.dueDate) }}</p>
          <p>Distancia: {{ nearestTask.distance.toFixed(2) }} km (aprox.)</p>
        </div>
        <div v-else-if="loadingNearestTask">
          <p>Cargando tarea más cercana...</p>
        </div>
        <div v-else class="alert alert-secondary">
            No tienes tareas pendientes cercanas o no se pudo obtener la información.
        </div>
      </div>
      <div class="col-md-4">
        <h4>Accesos Rápidos</h4>
        <ul class="list-group">
          <li class="list-group-item"><NuxtLink to="/tasks">Mis Tareas</NuxtLink></li>
          <li class="list-group-item"><NuxtLink to="/profile">Mi Perfil</NuxtLink></li>
          <li class="list-group-item"><NuxtLink to="/sectors">Ver Sectores</NuxtLink></li>
          <li class="list-group-item"><NuxtLink to="/reports">Mis Reportes</NuxtLink></li>
        </ul>
      </div>
    </div>
     <hr class="my-4">
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProfile } from '~/services/userService';
import { getNearestPendingTaskToUser } from '~/services/taskService';
import type { User, NearestTask } from '~/types/types';
import { formatDateTime } from '~/utils/formats'; // [cite: 14]

definePageMeta({
  middleware: ['auth-role'],
});

useHead({
  title: 'Dashboard',
});

const userProfile = ref<User | null>(null);
const nearestTask = ref<NearestTask | null>(null);
const loadingProfile = ref(true);
const loadingNearestTask = ref(true);

onMounted(async () => {
  try {
    userProfile.value = await getProfile();
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
  } finally {
    loadingProfile.value = false;
  }

  try {
    nearestTask.value = await getNearestPendingTaskToUser();
  } catch (error) {
    console.error("Error obteniendo tarea más cercana:", error);
    nearestTask.value = null; // Asegurarse que sea null en caso de error
  } finally {
    loadingNearestTask.value = false;
  }
});
</script>