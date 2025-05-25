<template>
  <div class="login-form-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Usuario:</label>
        <AppInput type="text" id="username" v-model="credentials.username" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <AppInput type="password" id="password" v-model="credentials.password" required />
      </div>
      <AppButton type="submit" :disabled="loading">
        <AppSpinner v-if="loading" size="sm" />
        <span v-else>Ingresar</span>
      </AppButton>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="register-link">
        <p>¿No tienes cuenta? <NuxtLink to="/register">Regístrate aquí</NuxtLink></p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login as loginService } from '~/services/authService';
import { useUserStore } from '~/stores/auth';
import AppInput from '~/components/common/AppInput.vue';
import AppButton from '~/components/common/AppButton.vue';
import AppSpinner from '~/components/common/AppSpinner.vue';
import type { User } from '~/types/types'; // Para el tipo de usuario si el login devolviera más info
import { getProfile } from '~/services/userService';


const credentials = ref({
  username: '',
  password: '',
});
const loading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const userStore = useUserStore();
const { $toast } = useNuxtApp();

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await loginService(credentials.value.username, credentials.value.password);
    // Backend devuelve: { token: string, role: string }
    // Para obtener id y name, necesitamos llamar a getProfile
    userStore.token = response.token; // Guardar token temporalmente para getProfile
    localStorage.setItem('token', response.token); // Axios interceptor lo necesita

    const userProfile = await getProfile(); // Llama a /users/user
    
    userStore.setUser({
      id: userProfile.id,
      name: userProfile.name,
      role: userProfile.role, // El rol de userProfile es el definitivo
      token: response.token,
    });

    $toast.success('¡Inicio de sesión exitoso!');

    if (userProfile.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  } catch (error: any) {
    // El interceptor de axios ya debería mostrar el toast de error
    // errorMessage.value = error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
    console.error("Error en handleLogin:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-form-container {
  max-width: 400px;
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
.error-message {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
.register-link {
  margin-top: 1.5rem;
  text-align: center;
}
.register-link p {
  font-size: 0.9rem;
}
</style>