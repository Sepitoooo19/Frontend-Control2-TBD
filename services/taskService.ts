import axios from 'axios'
import type { Task, FilterDTO } from '~/types/types'

const apiBase = import.meta.env.VITE_API_BASE || '/'

// Helper para extraer el array de tasks (permite ambos formatos)
function extractTasks(data: any): Task[] {
  if (Array.isArray(data)) return data
  if ('tasks' in data && Array.isArray(data.tasks)) return data.tasks
  return []
}

export async function getTasks(): Promise<Task[]> {
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  if (!userId || !token) return []
  const res = await axios.get(`${apiBase}/users/${userId}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return extractTasks(res.data)
}

export async function getTaskById(id: number): Promise<Task> {
  const res = await axios.get<Task>(`${apiBase}/tasks/${id}`)
  return res.data
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'status' | 'userId'>): Promise<Task> {
  const token = localStorage.getItem('token')
  const res = await axios.post<Task>(`${apiBase}/tasks`, task, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export async function updateTask(id: number, task: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>): Promise<Task> {
  const token = localStorage.getItem('token')
  const res = await axios.put<Task>(`${apiBase}/tasks/${id}`, task, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export async function deleteTask(id: number): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem('token')
  const res = await axios.delete(`${apiBase}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export async function getTasksByStatus(status: Task['status']): Promise<Task[]> {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  if (!userId || !token) return []
  const res = await axios.get(`${apiBase}/users/${userId}/tasks?status=${status}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return extractTasks(res.data)
}

// Ejemplo de filtro avanzado, si lo implementas en el backend
export async function filterTasks(filter: FilterDTO): Promise<Task[]> {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  if (!userId || !token) return []
  const res = await axios.post(`${apiBase}/users/${userId}/tasks/filter`, filter, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return extractTasks(res.data)
}

export async function getAllTasks() {
  const res = await axios.get(`${apiBase}/tasks`)
  return extractTasks(res.data)
}