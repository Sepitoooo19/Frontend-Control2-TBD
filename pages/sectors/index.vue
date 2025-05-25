<template>
  <div>
    <h1>Sectores</h1>
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando sectores...</span>
      </div>
    </div>
    <div v-else-if="sectors.length === 0" class="alert alert-info">
      No hay sectores disponibles.
    </div>
    <div v-else class="list-group">
      <div v-for="sector in sectors" :key="sector.id" class="list-group-item">
        <h5 class="mb-1">{{ sector.name }}</h5>
        <p class="mb-1 small text-muted">Ubicación (WKT): {{ sector.location }}</p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Sector } from '~/types/types';
import { getSectors } from '~/services/sectorService';
import { useNuxtApp } from '#app';

const { $toast } = useNuxtApp();

definePageMeta({
  middleware: 'auth-role', // O permitir acceso público si los sectores son información pública
});
useHead({
  title: 'Sectores',
});

const sectors = ref<Sector[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    sectors.value = await getSectors();
  } catch (error) {
    console.error("Error cargando sectores:", error);
    $toast.error('No se pudieron cargar los sectores.');
  } finally {
    loading.value = false;
  }
});

// const router = useRouter();
// const viewTasksForSector = (sectorId: number) => {
//   router.push(`/tasks?sectorId=${sectorId}`); // O una ruta específica
// };
</script>