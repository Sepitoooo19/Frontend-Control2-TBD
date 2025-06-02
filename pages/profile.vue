<template>
  <div class="max-w-xl mx-auto py-8">
    <h2 class="text-2xl font-bold mb-6 text-blue-700">Mi Perfil (estaba intentando que mostrara el mapa para poder actualizar la ubicación del usuario pero no lo pescaaa)</h2>
    <div v-if="isLoading" class="text-center text-gray-500 py-4">Cargando perfil...</div>
    <div v-if="loadError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ loadError }}</div>
    <form
      v-if="userReady"
      @submit.prevent="handleUpdateProfile"
      class="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <div>
        <label class="block text-gray-700 font-medium mb-1">ID de Usuario:</label>
        <input type="text" :value="userId" disabled class="w-full border rounded px-3 py-2 bg-gray-100" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">Nombre de Usuario:</label>
        <input type="text" :value="username" disabled class="w-full border rounded px-3 py-2 bg-gray-100" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">Nombre Completo:</label>
        <input type="text" v-model="editableProfile.name" required class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">Ubicación:</label>
        <MapPicker
          :lat="lat"
          :lng="lng"
          @update:lat="onUpdateLat"
          @update:lng="onUpdateLng"
        />
        <div class="text-xs text-gray-500 mt-1">
          La ubicación se guardará como <span class="font-mono">POINT(lng lat)</span> en tu perfil.
        </div>
      </div>
      <div class="flex gap-4">
        <button
          type="submit"
          :disabled="isUpdatingProfile"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {{ isUpdatingProfile ? 'Actualizando Perfil...' : 'Actualizar Perfil' }}
        </button>
        <button
          type="button"
          @click="resetLocation"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { updateProfile as updateUserProfile } from '~/services/userService';
import MapPicker from '~/components/common/MapPicker.vue';

definePageMeta({ layout: 'user', middleware: 'auth-role' });

const { $toast } = useNuxtApp();

const isLoading = ref(false);
const loadError = ref('');
const isUpdatingProfile = ref(false);
const userReady = ref(false);

const userId = ref<number | null>(null);
const username = ref<string | null>(null);

const editableProfile = reactive({
  name: '',
});

const lat = ref<number | undefined>(undefined);
const lng = ref<number | undefined>(undefined);
const initialLat = ref<number | undefined>(undefined);
const initialLng = ref<number | undefined>(undefined);

onMounted(() => {
  isLoading.value = true;
  loadError.value = '';
  try {
    // Intenta tomar todo desde localStorage (robusto, nunca falla si el login guarda)
    const idStr = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const name = localStorage.getItem('name') || '';
    const location = localStorage.getItem('location') || '';

    if (!idStr || !storedUsername) throw new Error('No hay sesión activa.');
    userId.value = Number(idStr);
    username.value = storedUsername;
    editableProfile.name = name;

    if (location) {
      const match = location.match(/POINT\(([^)]+)\)/);
      if (match) {
        const coords = match[1].trim().split(/\s+/);
        lng.value = parseFloat(coords[0]);
        lat.value = parseFloat(coords[1]);
        initialLng.value = lng.value;
        initialLat.value = lat.value;
      }
    }
    userReady.value = true;
  } catch (error: any) {
    console.error("Error al cargar el perfil:", error);
    loadError.value = error.message || "No se pudo cargar el perfil.";
    $toast.error(loadError.value);
  } finally {
    isLoading.value = false;
  }
});

const onUpdateLat = (newLat: number) => {
  lat.value = newLat;
};
const onUpdateLng = (newLng: number) => {
  lng.value = newLng;
};

const resetLocation = () => {
  lat.value = initialLat.value;
  lng.value = initialLng.value;
};

const handleUpdateProfile = async () => {
  if (!userId.value) return;
  if (lat.value === undefined || lng.value === undefined) {
    $toast.error('Selecciona una ubicación en el mapa.');
    return;
  }
  isUpdatingProfile.value = true;
  try {
    const newLocation = `POINT(${lng.value} ${lat.value})`;
    const updated = await updateUserProfile(userId.value, {
      name: editableProfile.name,
      location: newLocation,
    });
    // Guarda cambios en localStorage
    localStorage.setItem('name', updated.name);
    localStorage.setItem('location', updated.location);
    initialLat.value = lat.value;
    initialLng.value = lng.value;
    $toast.success('Perfil actualizado exitosamente.');
  } catch (error: any) {
    console.error("Error al actualizar perfil:", error);
    $toast.error(error.response?.data?.message || 'Error al actualizar el perfil.');
  } finally {
    isUpdatingProfile.value = false;
  }
};
</script>