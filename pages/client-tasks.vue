// ~/services/taskService.ts
import type { Task, TaskCreateDTO, TaskUpdateDTO, Sector } from '~/types/taskTypes'; // Ajusta la ruta si es necesario

const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiBase; // Ejemplo: http://localhost:8080/api

// Función para obtener las tareas del usuario autenticado
// Salida: Lista de tareas del usuario
export const getTasksByUser = async (): Promise<Task[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token de autenticación no encontrado');

  const response = await fetch(`${API_BASE_URL}/tasks/my-tasks`, { // Endpoint de ejemplo
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las tareas del usuario');
  }
  return await response.json();
};

// Función para crear una nueva tarea
// Entrada: datos de la tarea a crear
// Salida: Tarea creada
export const createTask = async (taskData: TaskCreateDTO): Promise<Task> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token de autenticación no encontrado');

  const response = await fetch(`${API_BASE_URL}/tasks`, { // Endpoint de ejemplo
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    // Podrías leer el cuerpo del error para más detalles
    // const errorBody = await response.json();
    // console.error("Error creating task:", errorBody);
    throw new Error('Error al crear la tarea');
  }
  return await response.json();
};

// Función para actualizar una tarea existente
// Entrada: ID de la tarea y datos a actualizar
// Salida: Tarea actualizada
export const updateTask = async (taskUpdateData: TaskUpdateDTO): Promise<Task> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token de autenticación no encontrado');

  const response = await fetch(`${API_BASE_URL}/tasks/${taskUpdateData.id}`, { // Endpoint de ejemplo
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskUpdateData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la tarea');
  }
  return await response.json();
};

// Función para eliminar una tarea
// Entrada: ID de la tarea
// Salida: Vacío o un mensaje de éxito
export const deleteTask = async (taskId: number): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token de autenticación no encontrado');

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, { // Endpoint de ejemplo
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la tarea');
  }
  // No se espera contenido JSON para una respuesta 204 No Content
};

// --- Funciones Adicionales para el Futuro (ejemplos) ---

// Función para obtener una tarea por su ID (podría ser útil para una vista de detalle o edición)
export const getTaskById = async (taskId: number): Promise<Task> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token de autenticación no encontrado');

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener la tarea por ID');
  }
  return await response.json();
};

// Función para obtener todos los sectores geográficos (para un selector en el formulario de tareas)
export const getAllSectors = async (): Promise<Sector[]> => {
  const token = localStorage.getItem('token');
  // Podría no requerir token si los sectores son información pública o semi-pública
  // if (!token) throw new Error('Token de autenticación no encontrado');

  const response = await fetch(`${API_BASE_URL}/sectors`, { // Endpoint de ejemplo
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`, // Si es necesario
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los sectores');
  }
  return await response.json();
};

// --- Podrías añadir aquí funciones para los reportes específicos que necesita el admin/cliente ---
// Ejemplo:
// export const getTasksCountByUserPerSector = async (): Promise<any> => { ... }
// export const getNearestPendingTask = async (): Promise<Task | null> => { ... }