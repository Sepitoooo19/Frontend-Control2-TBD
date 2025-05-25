<template>
  <div class="container tasks-page">
    <h1>Mis Tareas</h1>

    <div class="actions-bar mb-3">
      <NuxtLink to="/task-create" class="btn btn-primary">Crear Nueva Tarea</NuxtLink>
    </div>

    <TaskFilters @filters-changed="applyFilters" class="mb-3" />

    <div v-if="loadingTasks" class="text-center">
      <AppSpinner />
      <p>Cargando tareas...</p>
    </div>
    <div v-else-if="errorLoadingTasks" class="alert alert-danger">
      Error al cargar tareas: {{ errorLoadingTasks }}
    </div>
    <div v-else>
      <div v-if="tasks.length === 0" class="alert alert-info">
        No tienes tareas asignadas o que coincidan con los filtros.
      </div>
      <TaskList v-else :tasks="tasks" @edit-task="editTask" @delete-task="confirmDeleteTask" @toggle-complete="toggleCompleteTask" />
    </div>

    <AppModal :is-open="showDeleteConfirmation" @close="showDeleteConfirmation = false">
      <template #header>Confirmar Eliminación</template>
      <template #body>
        <p>¿Estás seguro de que deseas eliminar la tarea "{{ taskToDelete?.title }}"?</p>
      </template>
      <template #footer>
        <AppButton @click="deleteConfirmed" class="btn-danger" :disabled="deleting">
          <AppSpinner v-if="deleting" size="sm"/> Eliminar
        </AppButton>
        <AppButton @click="showDeleteConfirmation = false" class="btn-secondary" :disabled="deleting">Cancelar</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/auth';
import { getMyTasks, deleteTask as deleteTaskService, updateTask as updateTaskService, filterTasks as filterTasksService } from '~/services/taskService';
import type { Task, TaskUpdateDTO } from '~/types/types';
import TaskList from '~/components/tasks/TaskList.vue';
import TaskFilters from '~/components/tasks/TaskFilters.vue';
import AppModal from '~/components/common/AppModal.vue';
import AppButton from '~/components/common/AppButton.vue';
import AppSpinner from '~/components/common/AppSpinner.vue';

definePageMeta({
  middleware: 'auth-role', // Asegura que el usuario esté logueado
});

const userStore = useUserStore();
const router = useRouter();
const { $toast } = useNuxtApp();

const tasks = ref<Task[]>([]);
const loadingTasks = ref(true);
const errorLoadingTasks = ref<string | null>(null);

const showDeleteConfirmation = ref(false);
const taskToDelete = ref<Task | null>(null);
const deleting = ref(false);

const currentFilters = ref<{ status?: string, word?: string, sectorId?: number }>({});

const fetchTasks = async () => {
  loadingTasks.value = true;
  errorLoadingTasks.value = null;
  try {
    if (!userStore.userId) { // Asegurarse que el userId está disponible
       // Podrías intentar cargarlo desde localStorage aquí si no está en el store al inicio
      userStore.loadUserFromLocalStorage();
      if(!userStore.userId) {
        $toast.error("No se pudo identificar al usuario. Por favor, reintenta iniciar sesión.");
        router.push('/login'); // O manejar de otra forma
        return;
      }
    }
    // Si hay filtros aplicados, usar filterTasks, sino getMyTasks (o adaptar getMyTasks para que acepte filtros)
    // Por ahora, `getMyTasks` no toma filtros. Usaremos `filterTasks` que es más flexible
    // y el backend TaskController no tiene un GET /tasks/my-tasks.
    // El endpoint /tasks/user/{userId} podría ser la base para "mis tareas" filtradas.
    // El servicio `filterTasks` ya existe y parece más apropiado.
    // Necesitaremos asegurar que `filterTasks` también pueda filtrar por el `userId` del usuario logueado
    // si no es un admin. Esto debería manejarse en el backend o añadiendo `userId` a los params.
    // Por ahora, asumimos que `filterTasks` devuelve las tareas del usuario si no es admin,
    // o que el backend en `/tasks/filter` ya infiere el usuario.

    // Para simplificar, si no hay filtros activos, llamamos a `getMyTasks`.
    // Si hay filtros, usamos `filterTasks`. `getMyTasks` DEBE ser ajustado en `taskService.ts`
    // para usar el `userId` del store si el endpoint es `/tasks/user/{userId}`.
    // O el backend debe tener `/tasks/assigned-to-me` como se sugirió.
    // Asumamos que `/tasks/assigned-to-me` existe para `getMyTasks`.

    if (Object.keys(currentFilters.value).length > 0 && (currentFilters.value.status || currentFilters.value.word || currentFilters.value.sectorId)) {
      // Para que filterTasks devuelva solo las del usuario, necesitaría un param más o que el backend lo infiera.
      // Si filterTasks es solo para admins, entonces esta lógica debe cambiar.
      // Por ahora, asumimos que filterTasks es accesible y filtra las tareas del usuario logueado.
      tasks.value = await filterTasksService(currentFilters.value);
    } else {
      tasks.value = await getMyTasks();
    }

  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    errorLoadingTasks.value = error.response?.data?.message || error.message || 'Error desconocido';
    // $toast ya lo maneja el interceptor
  } finally {
    loadingTasks.value = false;
  }
};

const applyFilters = (filters: { status?: string, word?: string, sectorId?: number }) => {
  currentFilters.value = filters;
  fetchTasks();
};

const editTask = (task: Task) => {
  router.push(`/task/${task.id}/edit`);
};

const confirmDeleteTask = (task: Task) => {
  taskToDelete.value = task;
  showDeleteConfirmation.value = true;
};

const deleteConfirmed = async () => {
  if (!taskToDelete.value) return;
  deleting.value = true;
  try {
    await deleteTaskService(taskToDelete.value.id);
    $toast.success(`Tarea "${taskToDelete.value.title}" eliminada.`);
    tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value!.id);
    showDeleteConfirmation.value = false;
    taskToDelete.value = null;
  } catch (error) {
    console.error('Error deleting task:', error);
    // $toast ya lo maneja el interceptor
  } finally {
    deleting.value = false;
  }
};

const toggleCompleteTask = async (task: Task) => {
  const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
  const updatePayload: TaskUpdateDTO = { status: newStatus };
  try {
    const updatedTask = await updateTaskService(task.id, updatePayload);
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
    $toast.success(`Tarea "${task.title}" marcada como ${newStatus.toLowerCase()}.`);
  } catch (error) {
    console.error('Error updating task status:', error);
    // $toast ya lo maneja el interceptor
  }
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
.tasks-page {
  padding: 1.5rem;
}
.actions-bar {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
}
.text-center {
  text-align: center;
  margin-top: 2rem;
}
</style>