<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Task, Sector } from '~/types/types'
import { createTask, updateTask, getTaskById } from '~/services/taskService'
import { getSectors } from '~/services/sectorService'
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils'
import AppInput from '~/components/common/AppInput.vue'
import AppButton from '~/components/common/AppButton.vue'

const props = defineProps<{ taskId?: number }>()
const emit = defineEmits(['saved'])
const sectors = ref<Sector[]>([])
const form = ref<Partial<Omit<Task, 'id' | 'createdAt' | 'status' | 'userId'>>>({ title: '', description: '', dueDate: '', sectorId: undefined, location: '' })
const lat = ref('')
const lng = ref('')
const loading = ref(false)
const error = ref('')
const isEditMode = ref(false)

onMounted(async () => {
  sectors.value = await getSectors()
  if (props.taskId) {
    isEditMode.value = true
    const task = await getTaskById(props.taskId)
    form.value = { 
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.substring(0, 10),
      sectorId: task.sectorId,
      location: task.location
    }
    const coords = wktToLatLng(task.location)
    lat.value = coords?.lat?.toString() ?? ''
    lng.value = coords?.lng?.toString() ?? ''
  }
})

const handleSubmit = async () => {
  error.value = ''
  if (!lat.value || !lng.value || form.value.sectorId === undefined) {
    error.value = 'Debes ingresar todos los campos obligatorios.'
    return
  }
  const finalTask: Omit<Task, 'id' | 'createdAt' | 'status' | 'userId'> = {
    title: form.value.title || '',
    description: form.value.description || '',
    dueDate: form.value.dueDate || '',
    sectorId: Number(form.value.sectorId),
    location: latLngToWKT(Number(lat.value), Number(lng.value)),
  }
  loading.value = true
  try {
    if (isEditMode.value && props.taskId) {
      await updateTask(props.taskId, finalTask)
    } else {
      await createTask(finalTask)
    }
    emit('saved')
  } catch (e) {
    error.value = 'Error al guardar la tarea'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto bg-white p-6 rounded-xl shadow space-y-4">
    <AppInput label="Título" v-model="form.title" required />
    <AppInput label="Descripción" v-model="form.description" required />
    <AppInput label="Fecha límite" type="date" v-model="form.dueDate" required />
    <div>
      <label class="block mb-1 font-medium text-gray-700">Sector</label>
      <select v-model="form.sectorId" class="w-full rounded-lg border px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
        <option disabled value="">Seleccione un sector</option>
        <option v-for="sector in sectors" :value="sector.id" :key="sector.id">{{ sector.name }}</option>
      </select>
    </div>
    <div class="flex gap-2">
      <AppInput label="Latitud" v-model="lat" type="number" step="any" required />
      <AppInput label="Longitud" v-model="lng" type="number" step="any" required />
    </div>
    <div class="flex justify-end gap-2">
      <AppButton type="submit" :loading="loading" variant="primary">
        {{ isEditMode ? 'Actualizar' : 'Guardar' }} Tarea
      </AppButton>
    </div>
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </form>
</template>