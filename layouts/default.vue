<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-blue-700 text-white px-6 py-4 shadow">
      <div class="container mx-auto flex justify-between items-center">
          <li><NuxtLink to="/home-user" class="hover:underline">Inicio</NuxtLink></li>
          <li><NuxtLink to="/tasks" class="hover:underline">Mis Tareas</NuxtLink></li>
          <li><NuxtLink to="/profile" class="hover:underline">Perfil</NuxtLink></li>
          <li><NuxtLink to="/statistics" class="hover:underline">Estadísticas</NuxtLink></li>
      </div>
    </header>
    <main class="flex-1 container mx-auto py-8">
      <slot />
    </main>
    <footer class="bg-gray-800 text-white py-4 text-center">
      &copy; {{ new Date().getFullYear() }} Sistema de Tareas
    </footer>
  </div>
</template>