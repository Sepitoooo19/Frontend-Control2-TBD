<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTaskById, updateTask } from '~/services/taskService';
import { getSectors } from '~/services/sectorService';
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils';

const route = useRoute();
const router = useRouter();
const taskId = Number(route.params.id);
const form = ref({ title: '', description: '', dueDate: '', sectorId: '', location: '' });
const lat = ref('');
const lng = ref('');
const sectors = ref([]);
const error = ref('');

onMounted(async () => {
  const task = await getTaskById(taskId);
  form.value = { ...task, sectorId: task.sectorId ?? '', dueDate: task.dueDate?.substring(0, 10) };
  const coords = wktToLatLng(task.location);
  if (coords) {
    lat.value = coords.lat;
    lng.value = coords.lng;
  }
  sectors.value = await getSectors();
});

const handleSubmit = async () => {
  error.value = '';
  if (!lat.value || !lng.value) {
    error.value = "Debes ingresar ubicación de la tarea";
    return;
  }
  form.value.location = latLngToWKT(Number(lat.value), Number(lng.value));
  try {
    await updateTask(taskId, {
      ...form.value,
      sectorId: Number(form.value.sectorId),
      dueDate: form.value.dueDate
    });
    router.push('/tasks');
  } catch (e) {
    error.value = "Error al actualizar tarea";
  }
};
</script>
<template>
  <main class="p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Editar Tarea</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Título</label>
        <input v-model="form.title" class="border px-2 py-1 w-full mb-2" required />
      </div>
      <div>
        <label>Descripción</label>
        <textarea v-model="form.description" class="border px-2 py-1 w-full mb-2"></textarea>
      </div>
      <div>
        <label>Fecha Vencimiento</label>
        <input type="date" v-model="form.dueDate" class="border px-2 py-1 w-full mb-2" required />
      </div>
      <div>
        <label>Sector</label>
        <select v-model="form.sectorId" class="border px-2 py-1 w-full mb-2" required>
          <option value="">Selecciona un sector</option>
          <option v-for="s in sectors" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div>
        <label>Latitud</label>
        <input v-model="lat" class="border px-2 py-1 w-full mb-2" required />
      </div>
      <div>
        <label>Longitud</label>
        <input v-model="lng" class="border px-2 py-1 w-full mb-2" required />
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Actualizar Tarea</button>
      <span v-if="error" class="text-red-600 ml-2">{{ error }}</span>
    </form>
  </main>
</template>