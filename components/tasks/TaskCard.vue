<template>
  <tr class="task-card-row">
    <td>{{ task.title }}</td>
    <td>{{ task.description.substring(0, 50) }}{{ task.description.length > 50 ? '...' : '' }}</td>
    <td>{{ task.sectorName || task.sectorId }}</td>
    <td>{{ formatDate(task.dueDate) }}</td>
    <td>
      <span :class="task.status === 'COMPLETED' ? 'status-completed' : 'status-pending'">
        {{ task.status }}
      </span>
    </td>
    <td>{{ task.location }}</td>
    <td>
      <AppButton size="sm" variant="secondary" @click="$emit('edit', task)" class="mr-2">Editar</AppButton>
      <AppButton 
        v-if="task.status === 'PENDING'" 
        size="sm" 
        variant="success" 
        @click="$emit('complete', task.id)"
        :loading="isUpdatingStatus"
        class="mr-2">
        Completar
      </AppButton>
      <AppButton 
        size="sm" 
        variant="danger" 
        @click="$emit('delete', task.id)"
        :loading="isDeleting">
        Eliminar
      </AppButton>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Task } from '~/types/types';
import { formatDate } from '~/utils/formats';
import AppButton from '~/components/common/AppButton.vue';

defineProps<{
  task: Task;
  isUpdatingStatus?: boolean;
  isDeleting?: boolean;
}>();

defineEmits(['edit', 'complete', 'delete']);
</script>

<style scoped>
.status-completed { color: green; font-weight: bold; }
.status-pending { color: orange; font-weight: bold; }
.mr-2 { margin-right: 0.5rem; }
/* No se necesitan estilos de tr aquí si la tabla global ya los maneja */
</style>