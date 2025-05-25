<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { createTask, updateTask, getTaskById } from '~/services/taskService';
import { getSectors } from '~/services/sectorService';
import { useRouter } from 'vue-router';
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils';

const props = defineProps({
  taskId: { type: Number, default: null }
});
const emit = defineEmits(['saved']);

const router = useRouter();
const sectors = ref([]);
const form = ref({ title: '', description: '', dueDate: '', sectorId: '', location: '' });
const lat = ref('');
const lng = ref('');
const error = ref('');
const isEdit = ref(false);

onMounted(async () => {
  sectors.value = await getSectors();
  if (props.taskId) {
    isEdit.value = true;
    const task = await getTaskById(props.taskId);
    form.value = { ...task, sectorId: task.sectorId ?? '', dueDate: task.dueDate?.substring(0, 10) };
    const coords = wktToLatLng(task.location);
    if (coords) {
      lat.value = coords.lat;
      lng.value = coords.lng;
    }
  }
});

const handleSubmit = async () => {
  error.value = '';
  if (!lat.value || !lng.value) {
    error.value = "Debes ingresar la ubicación";
    return;
  }
  form.value.location = latLngToWKT(Number(lat.value), Number(lng.value));
  try {
    if (isEdit.value && props.taskId) {
      await updateTask(props.taskId, { ...form.value, sectorId: Number(form.value.sectorId) });
    } else {
      await createTask({ ...form.value, sectorId: Number(form.value.sectorId) });
    }
    emit('saved');
    router.push('/tasks');
  } catch (e) {
    error.value = "Error al guardar la tarea";
  }
};
</script>
<template>
  <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto">
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
    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
      {{ isEdit ? 'Actualizar' : 'Crear' }} Tarea
    </button>
    <span v-if="error" class="text-red-600 ml-2">{{ error }}</span>
  </form>
</template>