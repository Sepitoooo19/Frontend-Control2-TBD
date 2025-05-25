<template>
  <table class="w-full">
    <thead>
      <tr>
        <th>Título</th>
        <th>Descripción</th>
        <th>Vencimiento</th>
        <th>Estado</th>
        <th>Usuario</th>
        <th>Sector</th>
        <th>Ubicación</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="task in tasks" :key="task.id">
        <td>{{ task.title }}</td>
        <td>{{ task.description }}</td>
        <td>{{ task.dueDate }}</td>
        <td>{{ task.status }}</td>
        <td>{{ task.userId }}</td>
        <td>{{ task.sectorId }}</td>
        <td>{{ task.location }}</td>
        <td>
          <AppButton size="sm" variant="secondary" @click="$emit('edit', task)">Editar</AppButton>
          <AppButton size="sm" variant="danger" @click="$emit('delete', task.id)">Eliminar</AppButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import type { Task } from '~/types/types'
import AppButton from '~/components/common/AppButton.vue'
defineProps<{ tasks: Task[] }>()
defineEmits(['edit', 'delete'])
</script>