<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <header class="fixed top-0 left-0 w-full z-50 bg-red-600 text-white py-4 shadow-md">
      <div class="container mx-auto flex flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold">Admin - Gestor de Tareas</h1>
        <ul class="flex flex-row items-center space-x-4">
          <li><NuxtLink to="/admin/dashboard" class="hover:text-red-200 transition-colors">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/admin/users" class="hover:text-red-200 transition-colors">Usuarios</NuxtLink></li>
          <li><NuxtLink to="/admin/tasks" class="hover:text-red-200 transition-colors">Tareas</NuxtLink></li>
          <li><NuxtLink to="/admin/sectors" class="hover:text-red-200 transition-colors">Sectores</NuxtLink></li>
          <li><NuxtLink to="/admin/reports" class="hover:text-red-200 transition-colors">Reportes</NuxtLink></li>
          <li>
            <button
              @click="handleLogout"
              class="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-3 rounded transition-colors text-sm"
              aria-label="Cerrar Sesión"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </header>

    <main class="flex-grow w-full pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="container mx-auto">
        <slot />
      </div>
    </main>

    <footer class="bg-gray-800 text-white py-6 text-sm">
      <div class="container mx-auto text-center">
        <p>&copy; {{ new Date().getFullYear() }} Admin - Gestor de Tareas. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  router.push('/login');
};
</script>

<style scoped>
.router-link-active, .router-link-exact-active {
  font-weight: bold;
  color: #fecaca;
}

</style>