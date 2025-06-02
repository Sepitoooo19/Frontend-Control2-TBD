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

export async function updateUserMap(
  userId: number, 
  updates: { location: string }
): Promise<{ success: boolean; message?: string }> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')
  
  // Validación básica
  if (!token) throw new Error('Autenticación requerida')
  if (!updates.location || !updates.location.startsWith('POINT(')) {
    throw new Error('Formato WKT inválido para la ubicación')
  }

  try {
    return await $fetch('/users/me', {
      baseURL: config.public.apiBase,
      method: 'PUT',
      body: updates,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  } catch (error: any) {
    console.error('Error en updateUserMap:', error)
    
    // Extraer mensaje de error del backend si existe
    const backendMessage = error.data?.message || 
                         error.response?.data?.message
    
    throw new Error(backendMessage || 'Error al actualizar ubicación')
  }
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