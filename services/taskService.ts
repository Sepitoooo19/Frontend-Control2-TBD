import axios from 'axios'
import type { Task, FilterDTO } from '~/types/types'

const apiBase = import.meta.env.VITE_API_BASE || '/api'

export async function getTasks(): Promise<Task[]> {
  const res = await axios.get<Task[]>(`${apiBase}/tasks`)
  return res.data
}

export async function getTaskById(id: number): Promise<Task> {
  const res = await axios.get<Task>(`${apiBase}/tasks/${id}`)
  return res.data
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'status' | 'userId'>): Promise<Task> {
  const res = await axios.post<Task>(`${apiBase}/tasks`, task)
  return res.data
}

export async function updateTask(id: number, task: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>): Promise<Task> {
  const res = await axios.put<Task>(`${apiBase}/tasks/${id}`, task)
  return res.data
}

export async function deleteTask(id: number): Promise<{ success: boolean; message: string }> {
  const res = await axios.delete(`${apiBase}/tasks/${id}`)
  return res.data
}

export async function getTasksByStatus(status: Task['status']): Promise<Task[]> {
  const res = await axios.get<Task[]>(`${apiBase}/tasks/status/${status}`)
  return res.data
}

// Ejemplo de filtro avanzado, si lo implementas en el backend
export async function filterTasks(filter: FilterDTO): Promise<Task[]> {
  const res = await axios.post<Task[]>(`${apiBase}/tasks/filter`, filter)
  return res.data
}