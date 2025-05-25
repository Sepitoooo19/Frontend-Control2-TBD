<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createSector, updateSector, getSectorById } from '~/services/sectorService';
import { useRouter } from 'vue-router';
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils';

const props = defineProps({
  sectorId: { type: Number, default: null }
});
const emit = defineEmits(['saved']);
const router = useRouter();

const form = ref({ name: '', location: '' });
const lat = ref('');
const lng = ref('');
const error = ref('');
const isEdit = ref(false);

onMounted(async () => {
  if (props.sectorId) {
    isEdit.value = true;
    const sector = await getSectorById(props.sectorId);
    form.value = { ...sector };
    const coords = wktToLatLng(sector.location);
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
    if (isEdit.value && props.sectorId) {
      await updateSector(props.sectorId, form.value);
    } else {
      await createSector(form.value);
    }
    emit('saved');
    router.push('/sectors');
  } catch (e) {
    error.value = "Error al guardar sector";
  }
};
</script>
<template>
  <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto">
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
    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
      {{ isEdit ? 'Actualizar' : 'Crear' }} Sector
    </button>
    <span v-if="error" class="text-red-600 ml-2">{{ error }}</span>
  </form>
</template>