<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Mis Tareas</h1>
      <AppButton variant="success" @click="openCreateTaskModal">
        <i class="bi bi-plus-lg me-2"></i>Crear Nueva Tarea
      </AppButton>
    </div>

    <TaskFilters @filter="applyTaskFilters" />

    <div v-if="loadingTasks" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando tareas...</span>
      </div>
      <p>Cargando tareas...</p>
    </div>
    <div v-else-if="tasks.length === 0" class="alert alert-info">
      No tienes tareas asignadas o que coincidan con los filtros.
    </div>
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="task in tasks" :key="task.id" class="col">
        <div class="card h-100 shadow-sm" :class="{'border-success': task.status === 'COMPLETED', 'border-warning': task.status === 'PENDING'}">
          <div class="card-body">
            <h5 class="card-title">{{ task.title }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">
              Estado: <span :class="task.status === 'COMPLETED' ? 'text-success' : 'text-warning'">{{ task.status }}</span>
            </h6>
            <p class="card-text small">{{ task.description.substring(0, 100) }}...</p>
            <p class="card-text"><small class="text-muted">Vence: {{ formatDateTime(task.dueDate) }}</small></p>
             <p class="card-text"><small class="text-muted">Sector: {{ task.sectorName || task.sectorId }}</small></p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <AppButton variant="primary" sm @click="viewTaskDetails(task)" class="me-2">Ver Detalles</AppButton>
            <AppButton variant="info" sm @click="openEditTaskModal(task)" class="me-2">Editar</AppButton>
            <AppButton variant="danger" sm @click="confirmDeleteTask(task)">Eliminar</AppButton>
          </div>
        </div>
      </div>
    </div>

    <AppModal v-model="showTaskModal" :title="isEditMode ? 'Editar Tarea' : 'Crear Nueva Tarea'">
      <TaskForm
        :is-edit-mode="isEditMode"
        :task-data="selectedTask"
        @saved="handleTaskSaved"
        @close="closeTaskModal"
      />
    </AppModal>

     <AppModal v-model="showTaskDetailsModal" :title="selectedTask?.title || 'Detalles de Tarea'">
        <div v-if="selectedTask">
            <p><strong>Descripción:</strong> {{ selectedTask.description }}</p>
            <p><strong>Fecha de Vencimiento:</strong> {{ formatDateTime(selectedTask.dueDate) }}</p>
            <p><strong>Estado:</strong> {{ selectedTask.status }}</p>
            <p><strong>Sector:</strong> {{ selectedTask.sectorName || selectedTask.sectorId }}</p>
            <p><strong>Ubicación (WKT):</strong> {{ selectedTask.location }}</p>
            <p><strong>Creada el:</strong> {{ formatDateTime(selectedTask.createdAt) }}</p>
        </div>
        <template #footer>
            <AppButton variant="secondary" @click="showTaskDetailsModal = false">Cerrar</AppButton>
        </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Task, Sector } from '~/types/types';
import { getMyTasks, filterTasks, deleteTask as deleteTaskService } from '~/services/taskService';
import { getSectors } from '~/services/sectorService';
import TaskFilters from '~/components/tasks/TaskFilters.vue';
import TaskForm from '~/components/tasks/TaskForm.vue';
import { formatDateTime } from '~/utils/formats'; // [cite: 14]
import { useNuxtApp } from '#app';

const { $toast } = useNuxtApp();

definePageMeta({
  middleware: ['auth-role'], // Asegura que solo usuarios autenticados accedan
});
useHead({
  title: 'Mis Tareas',
});

const tasks = ref<Task[]>([]);
const sectors = ref<Sector[]>([]);
const loadingTasks = ref(true);
const showTaskModal = ref(false);
const showTaskDetailsModal = ref(false);
const isEditMode = ref(false);
const selectedTask = ref<Task | null>(null);

const fetchTasks = async (filters = {}) => {
  loadingTasks.value = true;
  try {
    // Si hay filtros, usar filterTasks, sino, getMyTasks
    // Nota: getMyTasks asume un endpoint que el backend debe proveer para tareas del usuario actual
    // filterTasks también debería ser adaptado en backend para filtrar por el usuario actual si no es admin
    if (Object.keys(filters).length > 0) {
        // Asegurarse que filterTasks también filtre por el usuario actual si no es admin (lógica de backend)
        tasks.value = await filterTasks(filters);
    } else {
        tasks.value = await getMyTasks(); // O llamar a filterTasks sin params si el backend lo maneja así
    }
    // Enriquecer tareas con nombre del sector
    if (sectors.value.length > 0) {
        tasks.value = tasks.value.map(task => ({
            ...task,
            sectorName: sectors.value.find(s => s.id === task.sectorId)?.name
        }));
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    $toast.error('No se pudieron cargar las tareas.');
    tasks.value = [];
  } finally {
    loadingTasks.value = false;
  }
};

const fetchSectors = async () => {
    try {
        sectors.value = await getSectors();
    } catch (error) {
        console.error("Error fetching sectors:", error);
        $toast.error('No se pudieron cargar los sectores.');
    }
};

onMounted(async () => {
  await fetchSectors();
  await fetchTasks();
});

const applyTaskFilters = (filters: any) => {
  fetchTasks(filters);
};

const openCreateTaskModal = () => {
  isEditMode.value = false;
  selectedTask.value = null;
  showTaskModal.value = true;
};

const openEditTaskModal = (task: Task) => {
  isEditMode.value = true;
  selectedTask.value = { ...task };
  showTaskModal.value = true;
};

const viewTaskDetails = (task: Task) => {
  selectedTask.value = task;
  showTaskDetailsModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
  selectedTask.value = null;
};

const handleTaskSaved = () => {
  closeTaskModal();
  fetchTasks(); // Recargar tareas
};

const confirmDeleteTask = async (task: Task) => {
  if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`)) {
    try {
      await deleteTaskService(task.id);
      $toast.success('Tarea eliminada exitosamente.');
      fetchTasks(); // Recargar
    } catch (error: any) {
      console.error('Error eliminando tarea:', error);
      $toast.error(error.response?.data?.message || 'Error al eliminar la tarea.');
    }
  }
};
</script>