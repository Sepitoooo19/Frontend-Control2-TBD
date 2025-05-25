<template>
  <div>
    <header class="bg-primary text-white p-3 shadow-sm">
      <nav class="container d-flex justify-content-between align-items-center">
        <NuxtLink to="/" class="navbar-brand text-white h4 mb-0">Gestor de Tareas</NuxtLink>
        <div>
          <template v-if="isAuthenticated">
            <NuxtLink v-for="item in currentMenu" :key="item.link" :to="item.link" class="nav-link d-inline-block me-3 text-white">
              {{ item.title }}
            </NuxtLink>
            <AppButton variant="secondary" sm @click="handleLogout">Cerrar Sesión</AppButton>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="nav-link d-inline-block me-3 text-white">Login</NuxtLink>
            <NuxtLink to="/register" class="nav-link d-inline-block text-white">Registro</NuxtLink>
          </template>
        </div>
      </nav>
    </header>
    <main class="container mt-4">
      <slot />
    </main>
    <footer class="text-center p-3 mt-5 bg-light">
      <p>&copy; {{ new Date().getFullYear() }} Mi Aplicación de Tareas</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '~/services/authService';
import { userMenuOptions, adminMenuOptions, type MenuItem } from '~/utils/navigation'; // [cite: 13]
import { useNuxtApp } from '#app';

const { $toast } = useNuxtApp();
const router = useRouter();
const isAuthenticated = ref(false);
const userRole = ref<string | null>(null);

const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    isAuthenticated.value = !!token;
    userRole.value = role;
  }
};

onMounted(() => {
  checkAuth();
  // Escuchar cambios en localStorage o usar un store de Pinia para reactividad
  window.addEventListener('storage', checkAuth);
  // También puedes usar un evento personalizado si el login/logout se manejan dentro de la app
});

const currentMenu = computed((): MenuItem[] => {
  if (userRole.value === 'ADMIN') {
    // Podrías combinar adminMenuOptions y userMenuOptions o tener uno específico
    return [...adminMenuOptions, ...userMenuOptions.filter(item => !adminMenuOptions.some(adminItem => adminItem.link === item.link))];
  }
  return userMenuOptions; // [cite: 13]
});

const handleLogout = async () => {
  await logout();
  isAuthenticated.value = false;
  userRole.value = null;
  $toast.info('Sesión cerrada.');
  await router.push('/login');
};
</script>

<style scoped>
.navbar-brand {
  font-weight: 500;
}
.nav-link:hover {
  text-decoration: underline;
}
header {
  background-color: #007bff !important; /* Usando color de .btn-primary como ejemplo */
}
.text-white {
    color: #fff !important;
}
</style>