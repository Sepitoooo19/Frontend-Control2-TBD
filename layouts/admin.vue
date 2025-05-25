<template>
  <div>
    <header class="bg-dark text-white p-3 shadow-sm">
      <nav class="container d-flex justify-content-between align-items-center">
        <NuxtLink to="/admin/dashboard" class="navbar-brand text-white h4 mb-0">Panel de Administración</NuxtLink>
        <div>
          <NuxtLink v-for="item in adminMenu" :key="item.link" :to="item.link" class="nav-link d-inline-block me-3 text-white">
            {{ item.title }}
          </NuxtLink>
           <NuxtLink to="/dashboard" class="nav-link d-inline-block me-3 text-white">Mi Dashboard</NuxtLink>
          <AppButton variant="light" sm @click="handleLogout">Cerrar Sesión</AppButton>
        </div>
      </nav>
    </header>
    <main class="container mt-4">
      <slot />
    </main>
    <footer class="text-center p-3 mt-5 bg-light">
      <p>&copy; {{ new Date().getFullYear() }} Admin - Gestor de Tareas</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { logout } from '~/services/authService';
import { adminMenuOptions, type MenuItem } from '~/utils/navigation'; // [cite: 13]
import { useNuxtApp } from '#app';

const { $toast } = useNuxtApp();
const router = useRouter();

const adminMenu = computed((): MenuItem[] => {
  return adminMenuOptions; // [cite: 13]
});

const handleLogout = async () => {
  await logout();
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
  background-color: #343a40 !important; /* Bootstrap .bg-dark */
}
.text-white {
    color: #fff !important;
}
</style>