<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-gray-900 text-white py-4 w-full">
      <div class="flex justify-between items-center px-4">
        <h1 class="text-2xl font-bold">Admin - Gestor de Tareas</h1>
        <ul class="flex space-x-4">
          <li><NuxtLink to="/admin/dashboard" class="hover:underline">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/admin/users" class="hover:underline">Usuarios</NuxtLink></li>
          <li><NuxtLink to="/admin/tasks" class="hover:underline">Tareas</NuxtLink></li>
          <li><NuxtLink to="/admin/sectors" class="hover:underline">Sectores</NuxtLink></li>
          <li><NuxtLink to="/admin/reports" class="hover:underline">Reportes</NuxtLink></li>
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
        <p>&copy; 2025 Admin - Gestor de Tareas</p>
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