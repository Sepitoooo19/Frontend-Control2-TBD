<template>
  <div class="container max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Estadísticas y Consultas Espaciales</h2>
    <StaticsPanel />
    <!-- mensaje temporal -->
    <p class="text-gray-600 mt-4">
      Esta sección está en desarrollo. Pronto podrás consultar estadísticas y realizar consultas espaciales.
    </p>
  </div>
</template>
<script setup lang="ts">
import StaticsPanel from '~/components/StaticsPanel.vue'
definePageMeta({ middleware: 'auth-role' })
</script>