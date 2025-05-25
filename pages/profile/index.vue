<template>
  <div class="container mt-4">
    <h2>Mi Perfil</h2>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else-if="user" class="card">
      <div class="card-body">
        <form @submit.prevent="handleUpdateProfile">
          <AppInput
            id="profileName"
            v-model="editableUser.name"
            label="Nombre Completo"
            :error="errors.name"
            class="mb-2"
          />
          <AppInput
            id="profileUsername"
            v-model="editableUser.username"
            label="Nombre de Usuario"
            :error="errors.username"
            class="mb-2"
            disabled
          />
           <AppInput
            id="profileLocation"
            v-model="editableUser.location"
            label="Ubicación (WKT: POINT(lon lat))"
            :error="errors.location"
            class="mb-3"
            help-text="Ej: POINT(-70.65 -33.43)"
          />
          <AppButton type="submit" variant="primary" :loading="updatingProfile">Actualizar Perfil</AppButton>
          <div v-if="errors.generalProfile" class="alert alert-danger mt-2">{{ errors.generalProfile }}</div>
        </form>

        <hr class="my-4">

        <form @submit.prevent="handleUpdatePassword">
          <h4>Cambiar Contraseña</h4>
          <AppInput
            id="newPassword"
            v-model="newPassword"
            label="Nueva Contraseña"
            type="password"
            :error="errors.password"
            class="mb-2"
          />
           <AppInput
            id="confirmPassword"
            v-model="confirmPassword"
            label="Confirmar Nueva Contraseña"
            type="password"
            :error="errors.confirmPassword"
            class="mb-3"
          />
          <AppButton type="submit" variant="secondary" :loading="updatingPassword">Cambiar Contraseña</AppButton>
           <div v-if="errors.generalPassword" class="alert alert-danger mt-2">{{ errors.generalPassword }}</div>
        </form>
      </div>
    </div>
    <div v-else class="alert alert-warning">
      No se pudo cargar la información del perfil.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProfile, updateProfile, updatePasswordForUser } from '~/services/userService';
import type { User } from '~/types/types';
import { wktToLatLng } from '~/utils/wktUtils'; // [cite: 12]
import { useNuxtApp } from '#app';

const { $toast } = useNuxtApp();

definePageMeta({
  middleware: 'auth-role',
});
useHead({
  title: 'Mi Perfil',
});

const user = ref<User | null>(null);
const editableUser = ref<{ name: string; username: string; location: string; role?: "USER" | "ADMIN" }>({
  name: '',
  username: '',
  location: '',
});
const newPassword = ref('');
const confirmPassword = ref('');

const loading = ref(true);
const updatingProfile = ref(false);
const updatingPassword = ref(false);

const errors = ref({
  name: '',
  username: '',
  location: '',
  password: '',
  confirmPassword: '',
  generalProfile: '',
  generalPassword: ''
});

onMounted(async () => {
  loading.value = true;
  try {
    const profileData = await getProfile();
    user.value = profileData;
    editableUser.value = {
      name: profileData.name,
      username: profileData.username,
      location: profileData.location,
      role: profileData.role
    };
  } catch (error) {
    console.error("Error al cargar perfil:", error);
    $toast.error("No se pudo cargar el perfil.");
  } finally {
    loading.value = false;
  }
});

const validateProfileForm = () => {
  errors.value.name = '';
  errors.value.location = '';
  errors.value.generalProfile = '';
  let isValid = true;
  if (!editableUser.value.name.trim()) {
    errors.value.name = 'El nombre es requerido.';
    isValid = false;
  }
  if (!editableUser.value.location.trim()) {
    errors.value.location = 'La ubicación es requerida.';
    isValid = false;
  } else if (!wktToLatLng(editableUser.value.location)) { // [cite: 12]
     errors.value.location = "Formato WKT inválido. Debe ser 'POINT(longitud latitud)'";
     isValid = false;
  }
  return isValid;
};

const handleUpdateProfile = async () => {
  if (!user.value || !validateProfileForm()) return;
  updatingProfile.value = true;
  errors.value.generalProfile = '';
  try {
    const dataToUpdate: Partial<User> = {
        name: editableUser.value.name,
        location: editableUser.value.location,
        // No se actualiza username ni role desde aquí usualmente por el usuario
    };
    await updateProfile(user.value.id, dataToUpdate);
    $toast.success('Perfil actualizado exitosamente.');
    // Recargar perfil si es necesario o actualizar user.value localmente
    const updatedProfile = await getProfile();
     user.value = updatedProfile;
    editableUser.value = {
      name: updatedProfile.name,
      username: updatedProfile.username,
      location: updatedProfile.location,
      role: updatedProfile.role
    };
  } catch (error: any) {
    console.error("Error actualizando perfil:", error);
    errors.value.generalProfile = error.response?.data?.message || 'Error al actualizar el perfil.';
    $toast.error(errors.value.generalProfile);
  } finally {
    updatingProfile.value = false;
  }
};

const validatePasswordForm = () => {
    errors.value.password = '';
    errors.value.confirmPassword = '';
    errors.value.generalPassword = '';
    let isValid = true;
    if (!newPassword.value) {
        errors.value.password = 'La nueva contraseña es requerida.';
        isValid = false;
    } else if (newPassword.value.length < 6) {
        errors.value.password = 'La contraseña debe tener al menos 6 caracteres.';
        isValid = false;
    }
    if (newPassword.value !== confirmPassword.value) {
        errors.value.confirmPassword = 'Las contraseñas no coinciden.';
        isValid = false;
    }
    return isValid;
}

const handleUpdatePassword = async () => {
  if (!user.value || !validatePasswordForm()) return;
  updatingPassword.value = true;
  errors.value.generalPassword = '';
  try {
    await updatePasswordForUser(user.value.id, newPassword.value);
    $toast.success('Contraseña actualizada exitosamente.');
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error: any) {
    console.error("Error actualizando contraseña:", error);
    errors.value.generalPassword = error.response?.data?.message || 'Error al actualizar la contraseña.';
    $toast.error(errors.value.generalPassword);
  } finally {
    updatingPassword.value = false;
  }
};
</script>