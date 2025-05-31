<template>
  <div>
    <!-- Filtro -->
    <div class="flex flex-wrap gap-4 mb-4">
      <select v-model="filters.status" class="rounded border px-3 py-2">
        <option value="">Todos los estados</option>
        <option value="PENDING">Pendiente</option>
        <option value="IN_PROGRESS">En Progreso</option>
        <option value="COMPLETED">Completada</option>
      </select>
      <input
        v-model="filters.word"
        type="text"
        class="rounded border px-3 py-2"
        placeholder="Buscar por título o descripción"
        @keyup.enter="applyFilters"
      />
      <button @click="applyFilters" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Filtrar
      </button>
      <button @click="clearFilters" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
        Limpiar
      </button>
    </div>
    <!-- Tabla -->
    <div class="overflow-x-auto">
      <!-- ... la tabla igual que antes ... -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Task, FilterDTO } from '~/types/types'
import AppButton from '~/components/common/AppButton.vue'
import { deleteTask, filterTasks, getMyTasks } from '~/services/taskService'

const props = defineProps<{ tasks: Task[] }>()
const emit = defineEmits(['deleted'])

const localTasks = ref<Task[]>([...props.tasks])
const filters = ref<FilterDTO>({ status: '', word: '' })
const router = useRouter()

watch(
  () => props.tasks,
  (newTasks) => {
    localTasks.value = [...newTasks]
  }
)

const applyFilters = async () => {
  try {
    const filtered = await filterTasks(filters.value)
    localTasks.value = filtered
  } catch (e) {
    alert('Error filtrando tareas')
  }
}
const clearFilters = async () => {
  filters.value = { status: '', word: '' }
  localTasks.value = await getMyTasks()
}

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