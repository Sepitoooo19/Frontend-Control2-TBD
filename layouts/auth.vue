<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <main class="flex-grow flex flex-col items-center justify-center">
      <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 class="text-2xl font-bold text-center mb-6">Bienvenido a Gestor de Tareas</h1>
        <slot />
        <p class="text-center text-gray-500 mt-4">Por favor, inicia sesión o regístrate para continuar.</p>
        <div class="flex justify-center gap-4 mt-6">
          <NuxtLink to="/login" class="bg-blue-600 px-4 py-2 rounded text-white font-semibold hover:bg-blue-700">Iniciar Sesión</NuxtLink>
          <NuxtLink to="/register" class="bg-gray-400 px-4 py-2 rounded text-white font-semibold hover:bg-gray-500">Registrarse</NuxtLink>
        </div>
      </div>
    </main>
    <footer class="bg-gray-800 text-white py-4">
      <div class="text-center">
        <p>&copy; {{ new Date().getFullYear() }} Gestor de Tareas</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No scripts extra necesarios
</script>