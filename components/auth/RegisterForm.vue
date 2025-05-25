<template>
  <div class="register-form-container">
    <h2>Registro de Usuario</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="reg-username">Usuario:</label>
        <AppInput type="text" id="reg-username" v-model="userData.username" required />
      </div>
      <div class="form-group">
        <label for="reg-name">Nombre Completo:</label>
        <AppInput type="text" id="reg-name" v-model="userData.name" required />
      </div>
      <div class="form-group">
        <label for="reg-password">Contraseña:</label>
        <AppInput type="password" id="reg-password" v-model="userData.password" required />
      </div>
       <div class="form-group">
        <label for="reg-role">Rol:</label>
        <select id="reg-role" v-model="userData.role" class="form-control" required>
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
      <div class="form-group">
        <ClientOnly>
          <MapInput label="Tu Ubicación:" v-model="userData.location" />
        </ClientOnly>
        <small v-if="!userData.location">Selecciona tu ubicación en el mapa.</small>
      </div>

      <AppButton type="submit" :disabled="loading">
        <AppSpinner v-if="loading" size="sm" />
        <span v-else>Registrarse</span>
      </AppButton>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
       <div class="login-link">
        <p>¿Ya tienes cuenta? <NuxtLink to="/login">Inicia sesión aquí</NuxtLink></p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register as registerService } from '~/services/authService';
import AppInput from '~/components/common/AppInput.vue';
import AppButton from '~/components/common/AppButton.vue';
import AppSpinner from '~/components/common/AppSpinner.vue';
import MapInput from '~/components/common/MapInput.vue'; // Importar el componente de mapa

const userData = ref({
  username: '',
  password: '',
  name: '',
  role: 'USER', // Rol por defecto
  location: '', // WKT: "POINT(longitud latitud)"
});
const loading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const { $toast } = useNuxtApp();

const handleRegister = async () => {
  if (!userData.value.location) {
    $toast.error('Por favor, selecciona tu ubicación en el mapa.');
    return;
  }
  loading.value = true;
  errorMessage.value = '';
  try {
    // El backend AuthController.java espera: username, password, role, name, location
    const response = await registerService(userData.value);
    if (response.success) {
      $toast.success(response.message || '¡Registro exitoso! Ahora puedes iniciar sesión.');
      router.push('/login');
    } else {
      // El interceptor de axios ya debería mostrar el toast de error si es un error HTTP
      // errorMessage.value = response.message || 'Error en el registro.';
    }
  } catch (error: any) {
     console.error("Error en handleRegister:", error);
    // errorMessage.value = error.response?.data?.message || 'Error al registrar. Intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-form-container {
  max-width: 500px; /* Un poco más ancho para el mapa */
  margin: 50px auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-control { /* Estilo para el select */
  display: block;
  width: 100%;
  padding: .65rem .9rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  box-sizing: border-box;
}
.error-message {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
.login-link {
  margin-top: 1.5rem;
  text-align: center;
}
.login-link p {
  font-size: 0.9rem;
}
</style>