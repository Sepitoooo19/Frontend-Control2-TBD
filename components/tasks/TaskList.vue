<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white rounded-lg shadow">
      <thead class="bg-blue-100">
        <tr>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">ID</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Título</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Descripción</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Vencimiento</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Estado</th>
          <th v-if="isAdmin" class="py-3 px-4 text-left font-semibold text-blue-800">Usuario</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Sector</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Ubicación</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in localTasks" :key="task.id" class="border-b hover:bg-blue-50 transition">
          <td class="py-2 px-4">{{ task.id }}</td>
          <td class="py-2 px-4">{{ task.title }}</td>
          <td class="py-2 px-4">{{ task.description }}</td>
          <td class="py-2 px-4">{{ task.dueDate }}</td>
          <td class="py-2 px-4">
            <span
              :class="task.status === 'COMPLETED'
                ? 'bg-green-100 text-green-700 px-2 py-1 rounded'
                : task.status === 'IN_PROGRESS'
                  ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded'
                  : 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded'"
            >
              {{ task.status }}
            </span>
          </td>
          <td v-if="isAdmin" class="py-2 px-4">{{ task.userId }}</td>
          <td class="py-2 px-4">{{ task.sectorId }}</td>
          <td class="py-2 px-4 font-mono text-xs text-gray-700">{{ task.location }}</td>
          <td class="py-2 px-4 flex gap-2">
            <AppButton size="sm" variant="secondary" @click="goToEdit(task.id)">Editar</AppButton>
            <AppButton size="sm" variant="danger" @click="handleDelete(task.id)">Eliminar</AppButton>
          </td>
        </tr>
        <tr v-if="!localTasks.length">
          <td :colspan="isAdmin ? 9 : 8" class="py-8 text-center text-gray-400">No hay tareas para mostrar.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Task } from '~/types/types'
import AppButton from '~/components/common/AppButton.vue'
import { deleteTask } from '~/services/taskService'

const props = defineProps<{ tasks: Task[]; isAdmin?: boolean }>()
const emit = defineEmits(['deleted'])

const localTasks = ref<Task[]>([...props.tasks])
const router = useRouter()

watch(
  () => props.tasks,
  (newTasks) => {
    localTasks.value = [...newTasks]
  }
)

const isAdmin = computed(() => props.isAdmin)

const goToEdit = (taskId: number) => {
  router.push(`/tasks/${taskId}/edit`)
}

const handleDelete = async (taskId: number) => {
  if (confirm('¿Seguro que deseas eliminar esta tarea?')) {
    try {
      await deleteTask(taskId)
      localTasks.value = localTasks.value.filter(t => t.id !== taskId)
      emit('deleted', taskId)
    } catch (e) {
      alert('Error al eliminar la tarea')
    }
  }
}
</script>