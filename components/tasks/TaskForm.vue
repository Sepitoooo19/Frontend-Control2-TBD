<template>
  <form @submit.prevent="submitForm" class="task-form">
    <div class="form-group">
      <label for="title">Título:</label>
      <AppInput id="title" v-model="editableTask.title" required />
    </div>
    <div class="form-group">
      <label for="description">Descripción:</label>
      <textarea id="description" v-model="editableTask.description" rows="4" required></textarea>
    </div>
    <div class="form-group">
      <label for="dueDate">Fecha de Vencimiento:</label>
      <AppInput type="datetime-local" id="dueDate" v-model="editableTask.dueDate" required />
    </div>
    <div class="form-group">
      <label for="sector">Sector:</label>
      <select id="sector" v-model.number="editableTask.sectorId" required>
        <option disabled value="">Selecciona un sector</option>
        <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
          {{ sector.name }}
        </option>
      </select>
      <small v-if="sectorsLoading">Cargando sectores...</small>
    </div>
     <div class="form-group">
      <label for="status">Estado:</label>
      <select id="status" v-model="editableTask.status" required>
        <option value="PENDING">Pendiente</option>
        <option value="COMPLETED">Completada</option>
      </select>
    </div>
    <div class="form-group">
      <ClientOnly>
        <MapInput label="Ubicación de la Tarea:" v-model="editableTask.location" />
      </ClientOnly>
       <small v-if="!editableTask.location">Selecciona la ubicación de la tarea en el mapa.</small>
    </div>

    <div class="form-actions">
      <AppButton type="submit" :disabled="loading || !isFormValid" class="btn-primary">
        <AppSpinner v-if="loading" size="sm"/>
        <span v-else>{{ isEditMode ? 'Actualizar Tarea' : 'Crear Tarea' }}</span>
      </AppButton>
      <AppButton type="button" @click="$emit('cancel')" class="btn-secondary">
        Cancelar
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, defineProps, defineEmits } from 'vue';
import type { Task, TaskCreateDTO, TaskUpdateDTO, Sector } from '~/types/types';
import { getSectors } from '~/services/sectorService';
import { createTask, updateTask } from '~/services/taskService';
import AppInput from '~/components/common/AppInput.vue';
import AppButton from '~/components/common/AppButton.vue';
import AppSpinner from '~/components/common/AppSpinner.vue';
import MapInput from '~/components/common/MapInput.vue'; // Importar
import { formatDateTimeForInput, parseDateTimeFromInput } from '~/utils/formats'; // Necesitarás crear estas funciones

const props = defineProps<{
  task?: Task | null; // Tarea existente para edición
}>();

const emit = defineEmits(['success', 'cancel']);
const { $toast } = useNuxtApp();

const editableTask = ref<Partial<TaskCreateDTO & { id?: number; status?: string }>>({ // Incluir status para edición
  title: '',
  description: '',
  dueDate: '', // Se manejará como string en formato 'yyyy-MM-ddTHH:mm'
  sectorId: undefined,
  location: '', // WKT
  status: 'PENDING', // Default para creación
});

const sectors = ref<Sector[]>([]);
const sectorsLoading = ref(false);
const loading = ref(false);

const isEditMode = computed(() => !!props.task && !!props.task.id);

const isFormValid = computed(() => {
  return editableTask.value.title &&
         editableTask.value.description &&
         editableTask.value.dueDate &&
         editableTask.value.sectorId &&
         editableTask.value.location;
});


onMounted(async () => {
  sectorsLoading.value = true;
  try {
    sectors.value = await getSectors();
  } catch (error) {
    $toast.error('Error al cargar sectores.');
    console.error(error);
  } finally {
    sectorsLoading.value = false;
  }

  if (isEditMode.value && props.task) {
    editableTask.value = {
      id: props.task.id,
      title: props.task.title,
      description: props.task.description,
      // El backend devuelve LocalDateTime, formatear para input datetime-local
      dueDate: formatDateTimeForInput(props.task.dueDate),
      status: props.task.status,
      sectorId: props.task.sectorId,
      location: props.task.location,
    };
  } else {
     // Para nuevas tareas, inicializar con una fecha por defecto si se desea, e.g., mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    editableTask.value.dueDate = formatDateTimeForInput(tomorrow.toISOString());
    editableTask.value.status = 'PENDING';
  }
});

// Watch por si la prop 'task' cambia externamente
watch(() => props.task, (newTask) => {
  if (isEditMode.value && newTask) {
    editableTask.value = {
      id: newTask.id,
      title: newTask.title,
      description: newTask.description,
      dueDate: formatDateTimeForInput(newTask.dueDate),
      status: newTask.status,
      sectorId: newTask.sectorId,
      location: newTask.location,
    };
  } else if (!newTask) { // Si se deselecciona la tarea para edición (ej. modo creación)
     editableTask.value = { title: '', description: '', dueDate: formatDateTimeForInput(new Date().toISOString()), sectorId: undefined, location: '', status: 'PENDING' };
  }
}, { deep: true });


const submitForm = async () => {
  if (!isFormValid.value) {
    $toast.error('Por favor, completa todos los campos requeridos, incluyendo la ubicación.');
    return;
  }
  loading.value = true;

  // El backend espera un ISO string para LocalDateTime
  // La función formatDateTimeForInput ya debería dar el formato correcto para el input
  // y el v-model lo mantiene como string. Si dueDate fuera un objeto Date,
  // necesitaríamos .toISOString().
  const payload: TaskCreateDTO | TaskUpdateDTO = {
    title: editableTask.value.title!,
    description: editableTask.value.description!,
    // Asegurar que dueDate es un ISO String para el backend si TaskEntity lo espera así.
    // El input datetime-local devuelve "YYYY-MM-DDTHH:mm", que suele ser aceptable.
    dueDate: editableTask.value.dueDate!,
    sectorId: editableTask.value.sectorId!,
    location: editableTask.value.location!,
    status: editableTask.value.status as "PENDING" | "COMPLETED", // Asegurar que el tipo es correcto
  };

  try {
    if (isEditMode.value && editableTask.value.id) {
      await updateTask(editableTask.value.id, payload as TaskUpdateDTO);
      $toast.success('Tarea actualizada exitosamente.');
    } else {
      await createTask(payload as TaskCreateDTO);
      $toast.success('Tarea creada exitosamente.');
    }
    emit('success');
  } catch (error: any) {
    console.error('Error al guardar tarea:', error);
    // El interceptor de axios debería manejar el toast
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
.task-form {
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
input[type="text"],
input[type="datetime-local"],
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
textarea {
  resize: vertical;
}
.form-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>