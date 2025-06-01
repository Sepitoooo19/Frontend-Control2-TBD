<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea
        id="description"
        v-model="form.description"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      ></textarea>
    </div>

    <div>
      <label for="dueDate" class="block text-sm font-medium text-gray-700">Fecha y hora límite</label>
      <input
        id="dueDate"
        v-model="form.dueDate"
        type="datetime-local"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="sectorId" class="block text-sm font-medium text-gray-700">Sector</label>
      <select
        id="sectorId"
        v-model="form.sectorId"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Seleccionar sector</option>
        <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
          {{ sector.name }}
        </option>
      </select>
    </div>

    <!-- Campos separados para latitud y longitud para facilitar la entrada -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="latitude" class="block text-sm font-medium text-gray-700">Latitud</label>
        <input
          id="latitude"
          v-model.number="form.latitude"
          type="number"
          step="any"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="longitude" class="block text-sm font-medium text-gray-700">Longitud</label>
        <input
          id="longitude"
          v-model.number="form.longitude"
          type="number"
          step="any"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>

    <div v-if="isEditing">
      <label for="status" class="block text-sm font-medium text-gray-700">Estado</label>
      <select
        id="status"
        v-model="form.status"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="PENDING">Pendiente</option>
        <option value="COMPLETED">Completada</option>
      </select>
    </div>

    <div class="flex space-x-4">
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Tarea' : 'Crear Tarea') }}
      </button>
      
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { getTaskById, createTask, updateTask } from '~/services/taskService'
import { getSectors } from '~/services/sectorService'
import type { Task, Sector } from '~/types/types'

const props = defineProps<{
  taskId?: number
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const loading = ref(false)
const sectors = ref<Sector[]>([])

const taskId = computed(() => {
  return props.taskId && !isNaN(Number(props.taskId)) ? Number(props.taskId) : null
})

const isEditing = computed(() => taskId.value !== null)

const form = reactive({
  title: '',
  description: '',
  dueDate: '',
  sectorId: '',
  latitude: null as number | null,
  longitude: null as number | null,
  status: 'PENDING' as Task['status']
})

// Función para convertir WKT POINT a lat/lng
const parseLocationFromWKT = (wkt: string) => {
  // Formato: "POINT(longitude latitude)"
  const match = wkt.match(/POINT\(([^)]+)\)/)
  if (match) {
    const coords = match[1].split(' ')
    return {
      longitude: parseFloat(coords[0]),
      latitude: parseFloat(coords[1])
    }
  }
  return { longitude: null, latitude: null }
}

// Función para crear WKT POINT desde lat/lng
const createWKTFromCoords = (latitude: number, longitude: number): string => {
  return `POINT(${longitude} ${latitude})`
}

const loadSectors = async () => {
  try {
    sectors.value = await getSectors()
  } catch (error) {
    console.error('Error cargando sectores:', error)
  }
}

const loadTask = async () => {
  if (!taskId.value) return
  
  try {
    loading.value = true
    console.log('Cargando tarea con ID:', taskId.value)
    
    const task = await getTaskById(taskId.value)
    console.log('Tarea cargada:', task)
    
    // Llenar el formulario
    form.title = task.title || ''
    form.description = task.description || ''
    form.dueDate = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
    form.sectorId = task.sectorId?.toString() || ''
    form.status = task.status || 'PENDING'
    
    // Parsear location WKT a lat/lng
    if (task.location) {
      const coords = parseLocationFromWKT(task.location)
      form.latitude = coords.latitude
      form.longitude = coords.longitude
    }
    
  } catch (error) {
    console.error('Error cargando tarea:', error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    
    // Crear location WKT si tenemos coordenadas
    let location: string | null = null
    if (form.latitude !== null && form.longitude !== null) {
      location = createWKTFromCoords(form.latitude, form.longitude)
    }
    
    const taskData = {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate || null,
      sectorId: form.sectorId ? Number(form.sectorId) : null,
      location: location,
      ...(isEditing.value && { status: form.status })
    }
    
    if (isEditing.value && taskId.value) {
      console.log('Actualizando tarea:', taskId.value, taskData)
      await updateTask(taskId.value, taskData)
    } else {
      console.log('Creando nueva tarea:', taskData)
      await createTask(taskData)
    }
    
    emit('saved')
    
  } catch (error) {
    console.error('Error guardando tarea:', error)
  } finally {
    loading.value = false
  }
}
onMounted(async () => {
  await loadSectors()
  if (isEditing.value) {
    await loadTask()
  }
})
</script>