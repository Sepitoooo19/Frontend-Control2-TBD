import axios from 'axios'
import type { User } from '~/types/types'

const apiBase = import.meta.env.VITE_API_BASE || '/'

export async function getUsers(): Promise<User[]> {
  const res = await axios.get<User[]>(`${apiBase}/users`)
  return res.data
}

export async function deleteUser(id: number): Promise<{ success: boolean; message: string }> {
  const res = await axios.delete(`${apiBase}/users/${id}`)
  return res.data
}

export async function updateUser(id: number, updates: Partial<Omit<User, 'id'>>): Promise<{ success: boolean }> {
  const res = await axios.put(`${apiBase}/users/${id}`, updates)
  return res.data
}

// Obtener perfil usuario autenticado
export async function getProfile(): Promise<User> {
  const res = await axios.get(`${apiBase}/users/me`)
  return res.data
}

// Actualizar perfil usuario
export async function updateProfile(id: number, data: Partial<Pick<User, 'name' | 'location'>>): Promise<User> {
  const res = await axios.put(`${apiBase}/users/${id}`, data)
  return res.data
}