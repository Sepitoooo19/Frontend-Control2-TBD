<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth-role' });
</script>
<template>
  <div>
    <main class="p-6">
      <h2 class="text-2xl font-bold mb-4">Mis Tareas</h2>
      <ul class="list-disc ml-8">
        <li><router-link to="/tasks">Ver y gestionar mis tareas</router-link></li>
        <li><router-link to="/profile">Ver/editar mi perfil</router-link></li>
        <li><router-link to="/statistics">Consultas y estadísticas</router-link></li>
      </ul>
    </main>
  </div>
</template>