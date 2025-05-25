<script setup lang="ts">
import { ref } from 'vue';
import { createSector } from '~/services/sectorService';
import { useRouter } from 'vue-router';
import { latLngToWKT } from '~/utils/wktUtils';

const router = useRouter();
const form = ref({ name: '', location: '' });
const lat = ref('');
const lng = ref('');
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  if (!lat.value || !lng.value) {
    error.value = "Debes ingresar ubicación del sector";
    return;
  }
  form.value.location = latLngToWKT(Number(lat.value), Number(lng.value));
  try {
    await createSector(form.value);
    router.push('/sectors');
  } catch (e) {
    error.value = "Error al crear sector";
  }
};
</script>
<template>
  <main class="p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Crear Nuevo Sector</h2>
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
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Crear Sector</button>
      <span v-if="error" class="text-red-600 ml-2">{{ error }}</span>
    </form>
  </main>
</template>