<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getSectors, deleteSector } from '~/services/sectorService';
import { useRouter } from 'vue-router';

const sectors = ref([]);
const loading = ref(false);
const error = ref('');
const router = useRouter();

const fetchSectors = async () => {
  loading.value = true;
  try {
    sectors.value = await getSectors();
  } catch (e) {
    error.value = "Error al cargar sectores";
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id: number) => {
  if (!confirm('¿Seguro que deseas eliminar este sector?')) return;
  try {
    await deleteSector(id);
    await fetchSectors();
  } catch {
    alert('Error al eliminar sector');
  }
};

onMounted(fetchSectors);
</script>
<template>
  <div>
    <div v-if="loading" class="mt-4">Cargando...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <table v-else class="w-full table-auto">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Ubicación (WKT)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sector in sectors" :key="sector.id">
          <td>{{ sector.name }}</td>
          <td>{{ sector.location }}</td>
          <td>
            <button @click="router.push(`/sector-edit/${sector.id}`)" class="text-blue-700 underline mr-2">Editar</button>
            <button @click="handleDelete(sector.id)" class="text-red-700 underline">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>