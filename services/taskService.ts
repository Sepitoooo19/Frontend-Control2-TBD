
import type { Task, FilterDTO } from '~/types/types'

// Helper para extraer el array de tasks (permite ambos formatos)
function extractTasks(data: any): Task[] {
  if (Array.isArray(data)) return data
  if ('tasks' in data && Array.isArray(data.tasks)) return data.tasks
  return []
}

export async function getTasks(): Promise<Task[]> {
  const config = useRuntimeConfig()
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  
  console.log('UserId desde localStorage:', userId) // Debug
  console.log('Token desde localStorage:', token) // Debug
  
  if (!userId || !token) {
    console.log('No hay userId o token') // Debug
    return []
  }
  
  const res = await $fetch(`/users/${userId}/tasks`, {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
  return extractTasks(res)
}

export async function getTaskById(id: number): Promise<Task> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')
  
  console.log('Obteniendo tarea ID:', id) // Debug
  console.log('URL completa:', `${config.public.apiBase}/tasks/${id}`) // Debug
  
  const res = await $fetch<Task>(`/tasks/${id}`, {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  return res
}

export async function createTask(task: {
  title: string;
  description: string;
  dueDate: string | null;
  sectorId: number | null;
  location: string | null;
}): Promise<Task> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')
  
  const res = await $fetch<Task>('/tasks', {
    baseURL: config.public.apiBase,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: task
  })
  return res
}

export async function updateTask(id: number, task: {
  title?: string;
  description?: string;
  dueDate?: string | null;
  sectorId?: number | null;
  location?: string | null;
  status?: Task['status'];
}): Promise<Task> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')
  
  console.log('Token para update:', token) // Debug
  console.log('Updating task ID:', id) // Debug
  console.log('Task data:', task) // Debug
  
  if (!token) {
    throw new Error('No hay token de autenticación')
  }
  
  const res = await $fetch<Task>(`/tasks/${id}`, {
    baseURL: config.public.apiBase,
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: task
  })
  return res
}

export async function deleteTask(id: number): Promise<{ success: boolean; message: string }> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')
  
  const res = await $fetch<{ success: boolean; message: string }>(`/tasks/${id}`, {
    baseURL: config.public.apiBase,
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  return res
}

export async function getTasksByStatus(status: Task['status']): Promise<Task[]> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  if (!userId || !token) return []
  
  const res = await $fetch(`/users/${userId}/tasks?status=${status}`, {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
  return extractTasks(res)
}

export async function filterTasks({ status, word }: { status?: string; word?: string }): Promise<Task[]> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')

  // Construye la query string
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (word) params.append('word', word)
  
  console.log('🔗 URL completa:', `${config.public.apiBase}/tasks/filtro?${params.toString()}`)
  
  const res = await $fetch(`/tasks/filtro?${params.toString()}`, {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
  
  console.log('📦 Respuesta raw del backend:', res)
  const extractedTasks = extractTasks(res)
  console.log('📋 Tareas extraídas:', extractedTasks)
  
  return extractedTasks
}

export async function getAllTasks(): Promise<Task[]> {
  const config = useRuntimeConfig()
  
  const res = await $fetch('/tasks', {
    baseURL: config.public.apiBase,
    method: 'GET'
  })
  return extractTasks(res)
}

export async function getMyTasks(): Promise<Task[]> {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('No hay token disponible');
    return [];
  }

  try {
    // Llama al nuevo endpoint
    const res = await $fetch('/tasks/my-tasks', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Respuesta del servidor:', res);
    return extractTasks(res);
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    return [];
  }
}

export async function getTaskDistributionByUserAndSector() {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('No token available');
    return { sectors: [], userData: {} };
  }

  try {
    const res = await $fetch('/tasks/distribution-by-user-sector', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }, // Remove Content-Type
    });

    console.log('Server response:', res);
    return res;
  } catch (error) {
    console.error('Error getting distribution:', error);
    return { sectors: [], userData: {} };
  }
}

export function isCloseToDueDate(task: Task): boolean {
  const now = new Date()
  const dueDate = new Date(task.dueDate)
  const twelveHoursInMs = 12 * 60 * 60 * 1000
  return dueDate.getTime() - now.getTime() <= twelveHoursInMs && 
         dueDate.getTime() > now.getTime()
}

export function getTimeRemaining(dueDate: string): string {
  const now = new Date()
  const due = new Date(dueDate)
  const msRemaining = due.getTime() - now.getTime()
  
  if (msRemaining <= 0) return 'Vencida'
  
  const hours = Math.floor(msRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) return `En ${hours}h ${minutes}m`
  return `En ${minutes}m`
}

export function getUrgencyClass(dueDate: string): string {
  const now = new Date()
  const due = new Date(dueDate)
  const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (hoursLeft <= 3) return 'bg-red-100 text-red-700'
  if (hoursLeft <= 6) return 'bg-orange-100 text-orange-700'
  return 'bg-yellow-100 text-yellow-700'
}

export function getDueSoonTasks(tasks: Task[]): Task[] {
  return tasks
    .filter(task => isCloseToDueDate(task))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}
