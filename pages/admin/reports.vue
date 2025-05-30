<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Reportes y Estadísticas</h1>
    <StaticsPanel />
  </div>
</template>

<script setup lang="ts">
import StaticsPanel from '~/components/StaticsPanel.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
})
</script>