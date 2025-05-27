<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white rounded-lg shadow">
      <thead class="bg-blue-100">
        <tr>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Título</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Descripción</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Vencimiento</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Estado</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Usuario</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Sector</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Ubicación</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id" class="border-b hover:bg-blue-50 transition">
          <td class="py-2 px-4">{{ task.title }}</td>
          <td class="py-2 px-4">{{ task.description }}</td>
          <td class="py-2 px-4">{{ task.dueDate }}</td>
          <td class="py-2 px-4">
            <span
              :class="task.status === 'COMPLETED'
                ? 'bg-green-100 text-green-700 px-2 py-1 rounded'
                : 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded'"
            >
              {{ task.status }}
            </span>
          </td>
          <td class="py-2 px-4">{{ task.userId }}</td>
          <td class="py-2 px-4">{{ task.sectorId }}</td>
          <td class="py-2 px-4 font-mono text-xs text-gray-700">{{ task.location }}</td>
          <td class="py-2 px-4">
            <AppButton size="sm" variant="secondary" @click="$emit('edit', task)">Editar</AppButton>
            <AppButton size="sm" variant="danger" @click="$emit('delete', task.id)">Eliminar</AppButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import type { Task } from '~/types/types'
import AppButton from '~/components/common/AppButton.vue'
defineProps<{ tasks: Task[] }>()
defineEmits(['edit', 'delete'])
</script>