import type { User } from '~/types/types'

export async function getUsers(): Promise<User[]> {
  const config = useRuntimeConfig()
  
  const res = await $fetch<User[]>('/users', {
    baseURL: config.public.apiBase,
    method: 'GET'
  })
  return res
}

export async function deleteUser(id: number): Promise<{ success: boolean; message: string }> {
  const config = useRuntimeConfig()
  
  const res = await $fetch<{ success: boolean; message: string }>(`/users/${id}`, {
    baseURL: config.public.apiBase,
    method: 'DELETE'
  })
  return res
}

export async function updateUser(id: number, updates: Partial<Omit<User, 'id'>>): Promise<{ success: boolean }> {
  const config = useRuntimeConfig()
  
  const res = await $fetch<{ success: boolean }>(`/users/${id}`, {
    baseURL: config.public.apiBase,
    method: 'PUT',
    body: updates
  })
  return res
}

// Obtener perfil usuario autenticado
export async function getProfile(): Promise<User> {
  const config = useRuntimeConfig()
  
  const res = await $fetch<User>('/users/me', {
    baseURL: config.public.apiBase,
    method: 'GET'
  })
  return res
}

// Actualizar perfil usuario
export async function updateProfile(id: number, data: Partial<Pick<User, 'name' | 'location'>>): Promise<User> {
  const config = useRuntimeConfig()
  
  const res = await $fetch<User>(`/users/${id}`, {
    baseURL: config.public.apiBase,
    method: 'PUT',
    body: data
  })
  return res
}

export async function getAllUsers() {
  const config = useRuntimeConfig()
  
  const res = await $fetch('/users', {
    baseURL: config.public.apiBase,
    method: 'GET'
  })
  return res
}