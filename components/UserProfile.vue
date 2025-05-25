<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProfile, updateProfile } from '~/services/userService';
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils';

const user = ref({ username: '', name: '', location: '' });
const lat = ref('');
const lng = ref('');
const success = ref(false);
const error = ref('');

onMounted(async () => {
  try {
    const data = await getProfile();
    user.value = data;
    const coords = wktToLatLng(user.value.location);
    if (coords) {
      lat.value = coords.lat;
      lng.value = coords.lng;
    }
  } catch (e) {
    error.value = "No se pudo cargar el perfil";
  }
});

const handleUpdate = async () => {
  error.value = '';
  user.value.location = latLngToWKT(Number(lat.value), Number(lng.value));
  try {
    await updateProfile(user.value);
    success.value = true;
  } catch (e) {
    error.value = "Error al actualizar perfil";
  }
};
</script>
<template>
  <form @submit.prevent="handleUpdate" class="max-w-md mx-auto">
    <div>
      <label>Usuario</label>
      <input v-model="user.username" disabled class="border px-2 py-1 w-full mb-2" />
    </div>
    <div>
      <label>Nombre</label>
      <input v-model="user.name" class="border px-2 py-1 w-full mb-2" required />
    </div>
    <div>
      <label>Latitud</label>
      <input v-model="lat" class="border px-2 py-1 w-full mb-2" required />
    </div>
    <div>
      <label>Longitud</label>
      <input v-model="lng" class="border px-2 py-1 w-full mb-2" required />
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Actualizar Perfil</button>
    <span v-if="success" class="text-green-600 ml-2">¡Actualizado!</span>
    <span v-if="error" class="text-red-600 ml-2">{{ error }}</span>
  </form>
</template>