<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTasks, deleteTask, updateTask } from '~/services/taskService';
import { useRouter } from 'vue-router';

const tasks = ref([]);
const loading = ref(false);
const error = ref('');
const router = useRouter();

const fetchTasks = async () => {
  loading.value = true;
  try {
    tasks.value = await getTasks();
  } catch (e) {
    error.value = "Error al cargar tareas";
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id: number) => {
  if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
  try {
    await deleteTask(id);
    await fetchTasks();
  } catch {
    alert('Error al eliminar tarea');
  }
};

const markCompleted = async (task: any) => {
  try {
    await updateTask(task.id, { ...task, status: 'COMPLETED' });
    await fetchTasks();
  } catch {
    alert('Error al marcar tarea como completada');
  }
};

onMounted(fetchTasks);
</script>
<template>
  <div>
    <div v-if="loading" class="mt-4">Cargando...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <table v-else class="w-full table-auto">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Vencimiento</th>
          <th>Estado</th>
          <th>Sector</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>{{ task.dueDate }}</td>
          <td>{{ task.status === 'PENDING' ? 'Pendiente' : 'Completada' }}</td>
          <td>{{ task.sectorName || task.sectorId }}</td>
          <td>
            <button @click="router.push(`/task-edit/${task.id}`)" class="text-blue-700 underline mr-2">Editar</button>
            <button @click="handleDelete(task.id)" class="text-red-700 underline">Eliminar</button>
            <button v-if="task.status === 'PENDING'" @click="markCompleted(task)" class="ml-2 text-green-700 underline">Completar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>