<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSectorById, updateSector } from '~/services/sectorService';
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils';

const route = useRoute();
const router = useRouter();
const sectorId = Number(route.params.id);
const form = ref({ name: '', location: '' });
const lat = ref('');
const lng = ref('');
const error = ref('');

onMounted(async () => {
  const sector = await getSectorById(sectorId);
  form.value = { name: sector.name, location: sector.location };
  const coords = wktToLatLng(sector.location);
  if (coords) {
    lat.value = coords.lat;
    lng.value = coords.lng;
  }
});

const handleSubmit = async () => {
  error.value = '';
  if (!lat.value || !lng.value) {
    error.value = "Debes ingresar ubicación del sector";
    return;
  }
  form.value.location = latLngToWKT(Number(lat.value), Number(lng.value));
  try {
    await updateSector(sectorId, form.value);
    router.push('/sectors');
  } catch (e) {
    error.value = "Error al actualizar sector";
  }
};
</script>
<template>
  <main class="p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Editar Sector</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Nombre</label>
        <input v-model="form.name" class="border px-2 py-1 w-full mb-2" required />
      </div>
      <div>
        <label>Latitud</label>
        <input v-model="lat" class="border px-2 py-1 w-full mb-2" required />
      </div>
      <div>
        <label>Longitud</label>
        <input v-model="lng" class="border px-2 py-1 w-full mb-2" required />
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Actualizar Sector</button>
      <span v-if="error" class="text-red-600 ml-2">{{ error }}</span>
    </form>
  </main>
</template>