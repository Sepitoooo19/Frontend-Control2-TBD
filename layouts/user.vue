<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <header class="fixed top-0 left-0 w-full z-50 bg-blue-600 text-white h-16 flex items-center shadow-md">
      <div class="container mx-auto flex flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold">Usuario - Gestor de Tareas</h1>
        <ul class="flex flex-row items-center space-x-4">
          <li><NuxtLink to="/home-user" class="hover:text-blue-200 transition-colors">Inicio</NuxtLink></li>
          <li><NuxtLink to="/profile" class="hover:text-blue-200 transition-colors">Mi Perfil</NuxtLink></li>
          <li><NuxtLink to="/tasks" class="hover:text-blue-200 transition-colors">Tareas</NuxtLink></li>
          <li><NuxtLink to="/tasks/create" class="hover:text-blue-200 transition-colors">Crear Tarea</NuxtLink></li>
          <li><NuxtLink to="/reports" class="hover:text-blue-200 transition-colors">Reportes</NuxtLink></li>
          <li>
            <button 
              @click="handleLogout" 
              class="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-3 rounded transition-colors text-sm" 
              aria-label="Cerrar Sesión"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </header>

    <main class="flex-grow w-full pt-16 pb-8">
      <div class="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
    
    <footer class="bg-gray-800 text-white py-6 text-sm mt-auto">
      <div class="container mx-auto text-center">
        <p>&copy; {{ new Date().getFullYear() }} Gestor de Tareas. Todos los derechos reservados.</p>
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
  color: #bfdbfe;
}
</style>