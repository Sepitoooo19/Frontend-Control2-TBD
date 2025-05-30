<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-blue-600 text-white py-4 w-full shadow">
      <div class="flex justify-between items-center px-4">
        <h1 class="text-2xl font-bold">Usuario - Gestor de Tareas</h1>
        <ul class="flex space-x-4">
          <li><NuxtLink to="/home-user" class="hover:underline">Inicio</NuxtLink></li>
          <li><NuxtLink to="/profile" class="hover:underline">Mi Perfil</NuxtLink></li>
          <li><NuxtLink to="/tasks" class="hover:underline">Tareas</NuxtLink></li>
          <li><NuxtLink to="/tasks/create" class="hover:underline">Crear Tarea</NuxtLink></li>
          <li><NuxtLink to="/statics" class="hover:underline">Estadísticas</NuxtLink></li>
          <li><NuxtLink to="/reports" class="hover:underline">Reportes</NuxtLink></li>
          <li>
            <button @click="handleLogout" class="hover:underline">Cerrar Sesión</button>
          </li>
        </ul>
      </div>
    </header>
    <main class="flex-grow container mx-auto py-8">
      <slot />
    </main>
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto text-center">
        <p>&copy; {{ new Date().getFullYear() }} Gestor de Tareas</p>
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
<style scoped>
header ul {
  display: flex;
  gap: 1rem;
}
</style>