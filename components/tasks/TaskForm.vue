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