<template>
  <table class="w-full">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Ubicación (WKT)</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="sector in sectors" :key="sector.id">
        <td>{{ sector.name }}</td>
        <td class="font-mono text-xs text-gray-700">{{ sector.location }}</td>
        <td>
          <AppButton size="sm" variant="secondary" @click="$emit('edit', sector)">Editar</AppButton>
          <AppButton size="sm" variant="danger" @click="$emit('delete', sector.id)">Eliminar</AppButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import type { Sector } from '~/types/types'
import AppButton from '~/components/common/AppButton.vue'
defineProps<{ sectors: Sector[] }>()
defineEmits(['edit', 'delete'])
</script>