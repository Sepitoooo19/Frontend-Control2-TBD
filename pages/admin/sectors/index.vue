<template>
  <div class="container max-w-3xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Sectores</h2>
      <router-link to="/sectors/create" class="btn btn-primary">Crear Sector</router-link>
    </div>
    <SectorList @edit="onEdit" @delete="onDelete" />
  </div>
</template>
<script setup lang="ts">
import SectorList from '~/components/sectors/SectorList.vue'
definePageMeta({ middleware: 'auth-role' })

// Si necesitas lógica para editar/eliminar, puedes manejarla aquí o en el componente
const onEdit = (sector) => {
  // router.push(`/sectors/${sector.id}/edit`)
}
const onDelete = (id) => {
  // lógica de borrado (usualmente delegada al componente)
}
</script>