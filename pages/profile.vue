<template>
  <div class="container">
    <h2>Mi Perfil</h2>
    <div v-if="isLoading" class="loading-spinner">Cargando perfil...</div>
    <div v-if="loadError" class="alert alert-danger">{{ loadError }}</div>

    <form v-if="user" @submit.prevent="handleUpdateProfile">
      <div class="form-group">
        <label for="username">Nombre de Usuario:</label>
        <input type="text" id="username" v-model="user.username" disabled />
        <small>El nombre de usuario no se puede cambiar.</small>
      </div>
      <div class="form-group">
        <label for="name">Nombre Completo:</label>
        <input type="text" id="name" v-model="editableProfile.name" required />
      </div>
      <div class="form-group">
        <label for="role">Rol:</label>
        <input type="text" id="role" v-model="user.role" disabled />
      </div>
      <div class="form-group">
        <label for="location">Ubicación (WKT: POINT(lng lat)):</label>
        <input type="text" id="location" v-model="editableProfile.location" required />
        <small>Ej: POINT(-70.6505 -33.4379). Cambiar esto actualizará tu ubicación geográfica.</small>
         </div>
      <button type="submit" :disabled="isUpdatingProfile">
        {{ isUpdatingProfile ? 'Actualizando Perfil...' : 'Actualizar Perfil' }}
      </button>
    </form>

    <hr style="margin: 30px 0;">

    <h3>Cambiar Contraseña</h3>
    <form @submit.prevent="handleChangePassword">
      <div class="form-group">
        <label for="newPassword">Nueva Contraseña:</label>
        <input type="password" id="newPassword" v-model="newPassword" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmar Nueva Contraseña:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <button type="submit" :disabled="isChangingPassword">
        {{ isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getProfile, updateProfile as updateUserProfile } from '~/services/userService';
import { updatePassword as updateUserPassword } from '~/services/authService';
import type { User } from '~/types/types';
import { useUserStore } from '~/stores/auth';

definePageMeta({ layout: 'user', middleware: 'auth-role' })

const user = ref<User | null>(null);
const editableProfile = reactive({
  name: '',
  location: ''
});

const newPassword = ref('');
const confirmPassword = ref('');

const isLoading = ref(false);
const loadError = ref('');
const isUpdatingProfile = ref(false);
const isChangingPassword = ref(false);

const userStore = useUserStore();
const { $toast } = useNuxtApp();

onMounted(async () => {
  isLoading.value = true;
  loadError.value = '';
  try {
    const profileData = await getProfile();
    user.value = profileData;
    editableProfile.name = profileData.name;
    editableProfile.location = profileData.location;
  } catch (error: any) {
    console.error("Error al cargar el perfil:", error);
    loadError.value = error.response?.data?.message || "No se pudo cargar el perfil.";
    $toast.error(loadError.value);
  } finally {
    isLoading.value = false;
  }
});

const validateWKT = (wkt: string): boolean => {
  return /^POINT\(\s*-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s*\)$/.test(wkt);
}

const handleUpdateProfile = async () => {
  if (!user.value) return;
  if (!validateWKT(editableProfile.location)) {
    $toast.error('Formato de ubicación WKT inválido. Debe ser POINT(longitud latitud).');
    return;
  }

  isUpdatingProfile.value = true;
  try {
    const updated = await updateUserProfile(user.value.id, {
      name: editableProfile.name,
      location: editableProfile.location
      // No enviar username ni role, ya que son campos que el usuario no debería poder cambiar directamente aquí
    });
    user.value.name = updated.name; // Actualizar la vista local
    user.value.location = updated.location;
    $toast.success('Perfil actualizado exitosamente.');
  } catch (error: any) {
    console.error("Error al actualizar perfil:", error);
    $toast.error(error.response?.data?.message || 'Error al actualizar el perfil.');
  } finally {
    isUpdatingProfile.value = false;
  }
};

const handleChangePassword = async () => {
  if (!user.value) return;
  if (newPassword.value !== confirmPassword.value) {
    $toast.error('Las contraseñas no coinciden.');
    return;
  }
  if (newPassword.value.length < 6) { // Ejemplo de validación simple
    $toast.error('La nueva contraseña debe tener al menos 6 caracteres.');
    return;
  }

  isChangingPassword.value = true;
  try {
    await updateUserPassword(user.value.id, newPassword.value);
    $toast.success('Contraseña actualizada exitosamente.');
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error: any) {
    console.error("Error al cambiar contraseña:", error);
    $toast.error(error.response?.data?.message || 'Error al cambiar la contraseña.');
  } finally {
    isChangingPassword.value = false;
  }
};
</script>

<style scoped>
/* Estilos para el formulario de perfil y cambio de contraseña */
.loading-spinner {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}
</style>