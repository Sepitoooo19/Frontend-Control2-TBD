import { useRuntimeConfig } from '#app'
import type { Sector, Task } from '~/types/types'

const getToken = () => localStorage.getItem('token')
const getUserId = () => localStorage.getItem('userId')
const getUserLocation = () => localStorage.getItem('userLocationWKT') // Debe guardarse al editar perfil

// 1. ¿Cuántas tareas ha hecho el usuario por sector?
export async function getUserTaskCountBySector(): Promise<Record<string, number>> {
  const config = useRuntimeConfig()
  const token = getToken()
  if (!token) throw new Error('No autenticado')
  // Este endpoint asume que es /tasks/mis-tareas-por-sector
  return await $fetch('/tasks/mis-tareas-por-sector', {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
}

// 2. ¿Cuál es la tarea más cercana al usuario (pendiente)?
export async function getNearestPendingTaskToUser(): Promise<{ id: number, title: string, distance: number, sector: string } | null> {
  const config = useRuntimeConfig()
  const token = getToken()
  const userLocation = getUserLocation()
  if (!token || !userLocation) return null
  try {
    return await $fetch(`/tasks/tarea-pendiente-cerca/${encodeURIComponent(userLocation)}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return null
    }
    throw err
  }
}

// 3. ¿Cuál es el sector con más tareas completadas en un radio de 2km?
export async function getSectorWithMostCompletedNearby(radiusKm = 2): Promise<{ sector: Sector, count: number } | null> {
  const config = useRuntimeConfig()
  const token = getToken()
  const userLocation = getUserLocation()
  if (!token || !userLocation) return null
  // El endpoint debe distinguir 2km/5km, aquí usamos 2km
  const res = await $fetch(`/tasks/sector-mas-tareas-2k/${encodeURIComponent(userLocation)}`, {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (Array.isArray(res) && res.length > 0) {
    // Asume que el backend retorna [{sector: ..., count: ...}]
    return res[0]
  }
  return null
}

// 4. ¿Cuál es el promedio de distancia de las tareas completadas respecto a la ubicación del usuario?
export async function getAvgDistanceOfCompletedTasks(): Promise<number | null> {
  const config = useRuntimeConfig()
  const token = getToken()
  const userLocation = getUserLocation()
  if (!token || !userLocation) return null
  const res = await $fetch(`/tasks/promedio-distancia-tareas-completadas/${encodeURIComponent(userLocation)}`, {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
  return typeof res === 'number' ? res : null
}

// 5. ¿En qué sectores se concentran la mayoría de las tareas pendientes? (heatmap)
export async function getPendingTasksHeatmap(): Promise<Array<{ sector: Sector, pendingCount: number }>> {
  const config = useRuntimeConfig()
  const token = getToken()
  if (!token) throw new Error('No autenticado')
  return await $fetch('/tasks/sectores-con-mas-tareas-pendientes', {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
}

// 6. ¿Cuál es la tarea pendiente más cercana a la ubicación del usuario? (Para todos los usuarios)
export async function getNearestPendingTaskToUserAllUsers(): Promise<Task | null> {
  const config = useRuntimeConfig()
  const token = getToken()
  const userLocation = getUserLocation()
  if (!token || !userLocation) return null
  return await $fetch(`/tasks/tarea-pendiente-mas-cerca-allusers/${encodeURIComponent(userLocation)}`, {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
}

// 7. ¿Cuántas tareas ha realizado cada usuario por sector? (Admin)
export async function getTasksByUserPerSector(): Promise<any[]> {
  const config = useRuntimeConfig()
  const token = getToken()
  if (!token) throw new Error('No autenticado')
  return await $fetch('/tasks/tareas-usuarios-por-sector', {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
}

// 8. ¿Cuál es el sector con más tareas completadas dentro de un radio de 5km?
export async function getSectorWithMostCompletedNearby5k(): Promise<{ sector: Sector, count: number } | null> {
  const config = useRuntimeConfig()
  const token = getToken()
  const userLocation = getUserLocation()
  if (!token || !userLocation) return null
  const res = await $fetch(`/tasks/sector-mas-tareas-5k/${encodeURIComponent(userLocation)}`, {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (Array.isArray(res) && res.length > 0) {
    return res[0]
  }
  return null
}

// 9. ¿Cuál es el promedio de distancia entre tareas completadas y el punto registrado del usuario?
// (ya cubierto por getAvgDistanceOfCompletedTasks)