<template>
  <div class="container">
    <h2>Gestionar Sectores</h2>
    <button @click="showCreateModal = true" class="btn-primary mb-3">Crear Nuevo Sector</button>

    <div v-if="isLoading">Cargando sectores...</div>
    <div v-if="loadError" class="alert alert-danger">{{ loadError }}</div>

    <table v-if="sectors.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Ubicación (WKT)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sector in sectors" :key="sector.id">
          <td>{{ sector.id }}</td>
          <td>{{ sector.name }}</td>
          <td>{{ sector.location }}</td>
          <td>
            <button @click="openEditModal(sector)" class="btn-sm btn-secondary">Editar</button>
            <button @click="handleDeleteSector(sector.id)" class="btn-sm btn-danger" :disabled="isDeleting[sector.id]">
              {{ isDeleting[sector.id] ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
     <div v-if="!isLoading && sectors.length === 0" class="alert alert-info">
      No hay sectores registrados.
    </div>

    <div v-if="showCreateModal || editingSector" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ editingSector ? 'Editar Sector' : 'Crear Nuevo Sector' }}</h3>
        <form @submit.prevent="editingSector ? handleUpdateSector() : handleCreateSector()">
          <div class="form-group">
            <label for="sectorName">Nombre del Sector:</label>
            <input type="text" id="sectorName" v-model="sectorForm.name" required />
          </div>
          <div class="form-group">
            <label for="sectorLocation">Ubicación (WKT: POINT(lng lat)):</label>
            <input type="text" id="sectorLocation" v-model="sectorForm.location" placeholder="Ej: POINT(-70.65 -33.43)" required />
             </div>
          <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : (editingSector ? 'Actualizar Sector' : 'Crear Sector') }}
          </button>
          <button type="button" @click="closeModal" class="btn-secondary" style="margin-left: 10px;">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getSectors, createSector, updateSector, deleteSector as deleteSectorService } from '~/services/sectorService';
import type { Sector } from '~/types/types';

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
});

const sectors = ref<Sector[]>([]);
const isLoading = ref(false);
const loadError = ref('');
const { $toast } = useNuxtApp();

const showCreateModal = ref(false);
const editingSector = ref<Sector | null>(null);
const isSubmitting = ref(false);
const formError = ref('');
const isDeleting = reactive<Record<number, boolean>>({});


const sectorFormDefault = { name: '', location: '' };
const sectorForm = reactive({ ...sectorFormDefault });

const fetchSectorsData = async () => {
  isLoading.value = true;
  loadError.value = '';
  try {
    sectors.value = await getSectors();
  } catch (error: any) {
    console.error("Error al cargar sectores:", error);
    loadError.value = error.response?.data?.message || "No se pudieron cargar los sectores.";
    $toast.error(loadError.value);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchSectorsData);

const closeModal = () => {
  showCreateModal.value = false;
  editingSector.value = null;
  Object.assign(sectorForm, sectorFormDefault);
  formError.value = '';
};

const openEditModal = (sector: Sector) => {
  editingSector.value = { ...sector };
  sectorForm.name = sector.name;
  sectorForm.location = sector.location;
};

const validateSectorForm = (): boolean => {
  if (!sectorForm.name || !sectorForm.location) {
    formError.value = "Nombre y ubicación son requeridos.";
    return false;
  }
   if (!/^POINT\(\s*-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s*\)$/.test(sectorForm.location)) {
    formError.value = "Formato de ubicación WKT inválido. Ej: POINT(-70.65 -33.43)";
    return false;
  }
  formError.value = '';
  return true;
};

const handleCreateSector = async () => {
  if (!validateSectorForm()) return;
  isSubmitting.value = true;
  try {
    await createSector({ name: sectorForm.name, location: sectorForm.location });
    $toast.success('Sector creado exitosamente!');
    fetchSectorsData();
    closeModal();
  } catch (error: any) {
    formError.value = error.response?.data?.message || "Error al crear el sector.";
    $toast.error(formError.value);
  } finally {
    isSubmitting.value = false;
  }
};

const handleUpdateSector = async () => {
  if (!editingSector.value || !validateSectorForm()) return;
  isSubmitting.value = true;
  try {
    await updateSector(editingSector.value.id, { name: sectorForm.name, location: sectorForm.location });
    $toast.success('Sector actualizado exitosamente!');
    fetchSectorsData();
    closeModal();
  } catch (error: any) {
    formError.value = error.response?.data?.message || "Error al actualizar el sector.";
    $toast.error(formError.value);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteSector = async (sectorId: number) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este sector? Esto podría afectar a las tareas asociadas.')) return;
  isDeleting[sectorId] = true;
  try {
    await deleteSectorService(sectorId);
    $toast.success('Sector eliminado exitosamente.');
    fetchSectorsData();
  } catch (error: any)
{
    $toast.error(error.response?.data?.message || 'Error al eliminar el sector.');
  } finally {
    isDeleting[sectorId] = false;
  }
};
</script>

<style scoped>
/* Estilos similares a pages/tasks/index.vue */
.mb-3 { margin-bottom: 1rem; }
.btn-sm {
  padding: 5px 10px;
  font-size: 0.875em;
  margin-right: 5px;
}
</style>