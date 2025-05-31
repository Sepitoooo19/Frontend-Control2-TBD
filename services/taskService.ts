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

export async function filterTasks(filter: FilterDTO): Promise<Task[]> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  if (!userId || !token) return []
  
  const res = await $fetch(`/users/${userId}/tasks/filter`, {
    baseURL: config.public.apiBase,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: filter
  })
  return extractTasks(res)
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
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')
  
  if (!token) {
    console.log('No hay token disponible')
    return []
  }
  
  try {
    // Usar el endpoint que ya funciona para obtener todas las tareas
    const res = await $fetch('/tasks', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('Respuesta del servidor:', res)
    return extractTasks(res)
  } catch (error) {
    console.error('Error obteniendo tareas:', error)
    return []
  }
}