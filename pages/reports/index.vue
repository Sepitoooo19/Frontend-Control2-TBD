<template>
  <section class="p-8">
    <h1 class="text-3xl font-bold mb-4">Reportes</h1>
    <p class="mb-6 text-gray-700">
      En esta sección podrás visualizar y generar reportes relacionados con tus tareas, estadísticas de uso, desempeño y más.
    </p>
    <div class="bg-gray-100 rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-2">Ejemplo de reporte</h2>
      <ul class="list-disc ml-6">
        <li>Reporte de tareas completadas</li>
        <li>Estadísticas de productividad</li>
        <li>Histórico de actividad</li>
      </ul>
      <p class="mt-4 text-sm text-gray-500">
        (Próximamente podrás consultar reportes personalizados desde esta página)
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">  
definePageMeta({ layout: 'user', middleware: 'auth-role' })

</script>