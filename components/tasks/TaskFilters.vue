<template>
  <div class="task-filters mb-3 p-3 border rounded">
    <div class="row g-2 align-items-end">
      <div class="col-md-4">
        <label for="filterStatus" class="form-label">Estado:</label>
        <select id="filterStatus" v-model="internalFilters.status" class="form-select">
          <option value="">Todos</option>
          <option value="PENDING">Pendiente</option>
          <option value="COMPLETED">Completada</option>
        </select>
      </div>
      <div class="col-md-4">
         <label for="filterSector" class="form-label">Sector:</label>
        <select id="filterSector" v-model="internalFilters.sectorId" class="form-select">
          <option :value="undefined">Todos</option>
          <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
            {{ sector.name }}
          </option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="filterKeyword" class="form-label">Palabra clave:</label>
        <input
          id="filterKeyword"
          v-model.trim="internalFilters.word"
          type="text"
          class="form-control"
          placeholder="Buscar por título/descripción..."
        />
      </div>
      <div class="col-12 col-md-auto mt-3 mt-md-0">
        <AppButton variant="primary" @click="applyFilters" class="w-100">Filtrar</AppButton>
      </div>
       <div class="col-12 col-md-auto mt-3 mt-md-0">
        <AppButton variant="secondary" @click="clearFilters" class="w-100">Limpiar</AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Sector } from '~/types/types';
import { getSectors } from '~/services/sectorService'; // Asumiendo que tienes este servicio

interface Filters {
  status?: string;
  word?: string;
  sectorId?: number;
}

const emit = defineEmits(['filter']);

const internalFilters = ref<Filters>({
  status: '',
  word: '',
  sectorId: undefined,
});

const sectors = ref<Sector[]>([]);

const loadSectors = async () => {
  try {
    sectors.value = await getSectors();
  } catch (error) {
    console.error("Error cargando sectores para filtro:", error);
  }
};

onMounted(loadSectors);

const applyFilters = () => {
  // Emitir solo los filtros que tienen valor
  const activeFilters: Partial<Filters> = {};
  if (internalFilters.value.status) activeFilters.status = internalFilters.value.status;
  if (internalFilters.value.word) activeFilters.word = internalFilters.value.word;
  if (internalFilters.value.sectorId) activeFilters.sectorId = internalFilters.value.sectorId;
  emit('filter', activeFilters);
};

const clearFilters = () => {
  internalFilters.value = { status: '', word: '', sectorId: undefined };
  emit('filter', {}); // Emitir objeto vacío para resetear
};

// Opcional: emitir filtro al cambiar (debounced)
// import { debouncedWatch } from '@vueuse/core';
// debouncedWatch(internalFilters, applyFilters, { debounce: 500, deep: true });
</script>

<style scoped>
/* Estilos para form-select, etc., se espera que estén en main.css */
.form-select { /* Ya definido en main.css para 'select' */
}
.task-filters .form-label {
  margin-bottom: 0.25rem;
  font-size: 0.9em;
}
</style>