<template>
  <div class="container mx-auto py-10 px-4">
    <div class="bg-gradient-to-r from-red-100 to-red-300 rounded-xl p-8 mb-10 shadow flex flex-col items-center">
      <h1 class="text-3xl font-extrabold mb-2 text-red-800 flex items-center gap-2">
        <span>🛡️</span> Panel de Administración
      </h1>
      <h2 class="text-lg font-medium mb-2 text-red-700">Bienvenido(a) al sistema administrador</h2>
      <p class="text-gray-700 text-center max-w-2xl">
        Gestiona usuarios, tareas, sectores y reportes globales desde este panel centralizado. Accede a las funciones clave del sistema con solo un clic.
      </p>
    </div>

    <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      <!-- Usuarios -->
      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-t-4 border-red-500">
        <div class="bg-red-100 rounded-full p-3 mb-4">
          <span class="text-3xl">👤</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-1">Gestionar Usuarios</h3>
        <p class="text-gray-600 text-sm mb-4 text-center">Ver, editar y eliminar usuarios del sistema.</p>
        <NuxtLink 
          to="/admin/users"
          class="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 text-sm shadow"
        >
          Ir a Usuarios
        </NuxtLink>
      </div>

      <!-- Tareas -->
      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-t-4 border-yellow-500">
        <div class="bg-yellow-100 rounded-full p-3 mb-4">
          <span class="text-3xl">📝</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-1">Gestionar Tareas</h3>
        <p class="text-gray-600 text-sm mb-4 text-center">Ver, editar y eliminar todas las tareas asignadas.</p>
        <NuxtLink 
          to="/admin/tasks"
          class="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 text-sm shadow"
        >
          Ir a Tareas
        </NuxtLink>
      </div>

      <!-- Sectores -->
      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-t-4 border-green-500">
        <div class="bg-green-100 rounded-full p-3 mb-4">
          <span class="text-3xl">🗺️</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-1">Gestionar Sectores</h3>
        <p class="text-gray-600 text-sm mb-4 text-center">Ver, editar y eliminar sectores geográficos.</p>
        <NuxtLink 
          to="/admin/sectors"
          class="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 text-sm shadow"
        >
          Ir a Sectores
        </NuxtLink>
      </div>

      <!-- Reportes -->
      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-t-4 border-blue-500">
        <div class="bg-blue-100 rounded-full p-3 mb-4">
          <span class="text-3xl">📊</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-1">Reportes Globales</h3>
        <p class="text-gray-600 text-sm mb-4 text-center">Ver estadísticas y reportes del sistema.</p>
        <NuxtLink 
          to="/admin/reports"
          class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 text-sm shadow"
        >
          Ir a Reportes
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth-role'],
});

useHead({
  title: 'Admin Dashboard - Gestor de Tareas',
});
</script>