import type { User } from '~/types/types'; // Asegúrate que User esté aquí o en auth.ts
import { useUserStore } from '~/stores/auth'; // Para acceder al token o rol, y potencialmente userId
import type { Task, TaskCreateDTO, TaskUpdateDTO, TaskStatsBySector, NearestTask, CompletedTaskDistanceDTO } from '~/types/types';

// Helper para obtener el userId (esto es un ejemplo, adaptar a cómo se obtiene el ID realmente)
// Podrías decodificar el token JWT si el ID está en el payload y no es un token opaco,
// o tener el ID del usuario en el store de Pinia después del login.
// Por simplicidad, asumiremos que el store de Pinia podría tener el ID.
// O, mejor aún, que el endpoint /tasks/my-tasks o similar exista en el backend
// y use el token para identificar al usuario.

// Si el backend tiene un endpoint específico para "mis tareas" que infiere el usuario del token:
export async function getMyTasks(): Promise<Task[]> {
  const { $axios } = useNuxtApp();
  // Idealmente, el backend tendría un endpoint como '/tasks/my' o '/tasks/assigned-to-me'
  // que no requiere el userId como parámetro explícito.
  // Basado en TaskController.java, no existe tal endpoint directo para rol USER.
  // El endpoint GET /tasks/user/{userId} puede ser usado por el propio usuario.
  // Se necesita el ID del usuario.
  
  // Intenta obtener el ID del usuario (esto es una simplificación)
  // En una app real, el ID se obtendría del store de Pinia o decodificando el JWT
  // después de que el usuario haya iniciado sesión.
  // Por ahora, este es un placeholder para la lógica de obtención del ID del usuario.
  // Este servicio no debería depender directamente del localStorage para el ID si es posible.
  // Lo ideal es que la página que llama a este servicio provea el ID, o el store de Pinia.
  
  // Simulando que obtenemos el userId del store de Pinia o similar
  // Esta parte es crucial y debe ser implementada correctamente en tu flujo de autenticación.
  // EJEMPLO: const userStore = useUserStore(); const userId = userStore.userId;
  // SI NO TIENES userId en el store, necesitarías añadirlo al hacer login.
  // O que el backend proporcione un endpoint dedicado como /api/users/me/id
  
  // Por ahora, si no hay un endpoint dedicado como /tasks/my-tasks, y necesitas el ID:
  // Este enfoque es problemático si no tienes el ID.
  // UNA MEJOR SOLUCIÓN EN BACKEND SERÍA:
  // @GetMapping("/my-tasks") @PreAuthorize("isAuthenticated()") public List<TaskEntity> getMyTasks() { /* obtener usuario del SecurityContext */ }

  // Asumiendo que el backend NO tiene /tasks/my-tasks y SÍ tenemos el userId:
  // const userId = obtenerIdUsuarioDeAlgunaFuenteSegura(); // Implementar esto
  // if (!userId) throw new Error("User ID not available for getMyTasks");
  // const response = await $axios.get<Task[]>(`/tasks/user/${userId}`);

  // DADO EL TaskController.java y la necesidad de simplificar AHORA MISMO sin modificar el backend:
  // La forma más directa sería que el backend implemente un endpoint dedicado
  // como `/tasks/assigned-to-me` que use el token para identificar al usuario.
  // Si ese endpoint `/tasks/assigned-to-me` SÍ existe y funciona como se espera:
  try {
    const response = await $axios.get<Task[]>('/tasks/assigned-to-me');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // El interceptor de axios ya debería manejar esto, pero puedes añadir lógica específica
      console.error('No autorizado para obtener mis tareas, redirigiendo...');
      // navigateTo('/login'); // Asegúrate de que navigateTo esté disponible o maneja el error
    }
    throw error; // Re-lanzar el error para que el componente lo maneje
  }
}


export async function getAllTasksAdmin(): Promise<Task[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get<Task[]>('/tasks');
  return response.data;
}

export async function getTaskById(id: number): Promise<Task> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get<Task>(`/tasks/${id}`);
  return response.data;
}

export async function getTasksBySectorId(sectorId: number): Promise<Task[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get<Task[]>(`/tasks/filter`, { params: { sectorId } });
  return response.data;
}

export async function getTasksByUserId(userId: number): Promise<Task[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get<Task[]>(`/tasks/user/${userId}`);
  return response.data;
}

export async function createTask(task: TaskCreateDTO): Promise<Task> {
  const { $axios } = useNuxtApp();
  // Asegúrate que dueDate se envía en el formato esperado por el backend (ISO string)
  // Si TaskCreateDTO.dueDate es un objeto Date, axios lo serializará a ISO.
  // Si es una string, debe estar ya en formato ISO.
  const response = await $axios.post<Task>('/tasks', task);
  return response.data;
}

export async function updateTask(id: number, task: TaskUpdateDTO): Promise<Task> {
  const { $axios } = useNuxtApp();
  const response = await $axios.put<Task>(`/tasks/${id}`, task);
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.delete(`/tasks/${id}`);
}

export async function filterTasks({ status, word, sectorId }: { status?: string, word?: string, sectorId?: number }): Promise<Task[]> {
  const { $axios } = useNuxtApp();
  const params: Record<string, string | number> = {};
  if (status) params.status = status;
  if (word) params.word = word;
  if (sectorId !== undefined && sectorId !== null) params.sectorId = sectorId;

  const response = await $axios.get<Task[]>('/tasks/filter', { params });
  return response.data;
}

// --- Funciones de Estadísticas (asumen endpoints en /statistics) ---

// RF6.1: ¿Cuántas tareas ha hecho el usuario por sector?
// Este endpoint debe ser para el usuario autenticado o permitir pasar un userId para admin.
// Por ahora, asumimos que es para el usuario autenticado.
export async function getMyTasksCountBySector(): Promise<TaskStatsBySector[]> {
  const { $axios } = useNuxtApp();
  // Backend debería tener: GET /statistics/my-tasks-by-sector
  const response = await $axios.get<TaskStatsBySector[]>('/statistics/my-tasks-by-sector');
  return response.data;
}

// Para Admin: ¿Cuántas tareas ha realizado CADA usuario por sector?
// Backend debería tener: GET /statistics/all-users-tasks-by-sector
export async function getAllUsersTasksCountBySector(): Promise<any[]> { // Definir un tipo más específico para la respuesta
  const { $axios } = useNuxtApp();
  const response = await $axios.get<any[]>('/statistics/all-users-tasks-by-sector');
  return response.data;
}


// RF6.2 / RF6.extra: ¿Cuál es la tarea pendiente más cercana al usuario?
export async function getNearestPendingTaskToUser(): Promise<NearestTask | null> {
  const { $axios } = useNuxtApp();
  // Backend debería tener: GET /statistics/nearest-pending-task (usa la ubicación del usuario autenticado)
  const response = await $axios.get<NearestTask | null>('/statistics/nearest-pending-task');
  return response.data;
}

// RF6.3: ¿Cuál es el sector con más tareas completadas en un radio de X kilómetros del usuario?
export async function getSectorWithMostCompletedTasksInRadius(radiusKm: number): Promise<any> { // Definir tipo específico
  const { $axios } = useNuxtApp();
  // Backend: GET /statistics/sector-most-completed-tasks-radius?radiusKm={radiusKm}
  const response = await $axios.get<any>(`/statistics/sector-most-completed-tasks-radius`, { params: { radiusKm } });
  return response.data;
}


// RF6.4 / RF6.extra: ¿Cuál es el promedio de distancia de las tareas completadas respecto a la ubicación del usuario?
export async function getAverageDistanceToCompletedTasks(): Promise<{ averageDistance: number } | null> {
  const { $axios } = useNuxtApp();
  // Backend: GET /statistics/average-completed-task-distance (usa la ubicación del usuario autenticado)
  const response = await $axios.get<{ averageDistance: number } | null>('/statistics/average-completed-task-distance');
  return response.data;
}

// RF6.5: ¿En qué sectores geográficos se concentran la mayoría de las tareas pendientes?
export async function getPendingTasksConcentration(): Promise<any[]> { // Definir tipo específico, ej: { sectorName: string, location: string, pendingTaskCount: number }[]
  const { $axios } = useNuxtApp();
  // Backend: GET /statistics/pending-tasks-concentration
  const response = await $axios.get<any[]>('/statistics/pending-tasks-concentration');
  return response.data;
}

// getTasksCountByUserPerSector
export async function getTasksCountByUserPerSector(): Promise<any[]> { // Definir un tipo más específico para la respuesta
  const { $axios } = useNuxtApp();
  // Backend debería tener: GET /statistics/tasks-count-by-user-per-sector
  const response = await $axios.get<any[]>('/statistics/tasks-count-by-user-per-sector');
  return response.data;
}