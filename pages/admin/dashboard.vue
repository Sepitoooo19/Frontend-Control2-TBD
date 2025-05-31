<template>
  <div class="space-y-8"> <header class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800">Dashboard de Administración</h1>
      <p class="text-lg text-gray-600 mt-2">Bienvenido al panel de control. Aquí tienes un resumen de las acciones disponibles.</p>
    </header>

    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold text-gray-700 mb-2">Gestionar Usuarios</h2>
          <p class="text-gray-600 text-sm mb-4">Ver, editar y eliminar usuarios del sistema.</p>
          <NuxtLink 
            to="/admin/users" 
            class="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
          >
            Ir a Usuarios
          </NuxtLink>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold text-gray-700 mb-2">Gestionar Tareas</h2>
          <p class="text-gray-600 text-sm mb-4">Ver, editar y eliminar todas las tareas asignadas.</p>
          <NuxtLink 
            to="/admin/tasks" 
            class="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
          >
            Ir a Tareas
          </NuxtLink>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold text-gray-700 mb-2">Gestionar Sectores</h2>
          <p class="text-gray-600 text-sm mb-4">Crear, ver, editar y eliminar sectores geográficos.</p>
          <NuxtLink 
            to="/admin/sectors" 
            class="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
          >
            Ir a Sectores
          </NuxtLink>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold text-gray-700 mb-2">Reportes Globales</h2>
          <p class="text-gray-600 text-sm mb-4">Ver estadísticas y reportes del sistema.</p>
          <NuxtLink 
            to="/admin/reports" 
            class="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
          >
            Ir a Reportes
          </NuxtLink>
        </div>
      </div>
    </section>

    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth-role'], // Asegúrate que este middleware exista y funcione como esperas
});

useHead({
  title: 'Admin Dashboard - Gestor de Tareas', // Título más descriptivo
});
</script>

<style scoped>
/* Estilos específicos para esta página si son necesarios, 
   pero idealmente la mayoría vendrán de Tailwind. */
</style>