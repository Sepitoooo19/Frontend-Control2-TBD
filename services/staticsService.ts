import { useRuntimeConfig } from '#app'
import type { Sector, Task, NearestPendingTask } from '~/types/types'

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Authentication required')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// 1. Tareas del usuario por sector
export async function getTasksByUserAndSector(): Promise<Array<{ sector_name: string, task_count: number }>> {
  try {
    const response = await fetch(`${API_BASE}/tasks/mis-tareas-por-sector`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching tasks by sector:', error)
    throw error
  }
}

// 2. Tarea pendiente más cercana al usuario
export async function getNearestPendingTaskForUser(): Promise<NearestPendingTask | null> {
  try {
    const response = await fetch(`${API_BASE}/tasks/tarea-pendiente-cerca`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    
    return await response.json(); // Devuelve exactamente lo que viene del backend
  } catch (error) {
    console.error('Error fetching nearest pending task:', error);
    return null;
  }
}

// 3. Sector con más tareas completadas en 2km
export async function getSectorWithMostCompletedIn2km(): Promise<{ 
  sector: Sector, 
  count: number 
} | null> {
  try {
    const response = await fetch(`${API_BASE}/tasks/sector-mas-tareas-2k`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    
    const data = await response.json()
    return Array.isArray(data) && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error('Error fetching sector stats:', error)
    return null
  }
}

// 4. Promedio distancia tareas completadas
export async function getAverageDistanceOfCompletedTasks(): Promise<number | null> {
  try {
    const response = await fetch(`${API_BASE}/tasks/promedio-distancia-tareas-completadas`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    
    const result = await response.json()
    return result?.average_distance || null
  } catch (error) {
    console.error('Error fetching average distance:', error)
    return null
  }
}

// 5. Tarea pendiente más cercana (todos los usuarios)
export async function getNearestPendingTaskAllUsers(): Promise<Task & { 
  distance?: number, 
  userName?: string 
} | null> {
  try {
    const response = await fetch(`${API_BASE}/tasks/tarea-pendiente-mas-cerca-allusers`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching nearest task for all users:', error)
    return null
  }
}

// 6. Sector con más tareas completadas en 5km
export async function getSectorWithMostCompletedIn5km(): Promise<{ 
  sector: Sector, 
  count: number 
} | null> {
  try {
    const response = await fetch(`${API_BASE}/tasks/sector-mas-tareas-5k`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    
    const data = await response.json()
    return Array.isArray(data) && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error('Error fetching sector stats (5km):', error)
    return null
  }
}

// 7. Promedio distancia con ubicación registrada
export async function getAverageDistanceWithRegisteredLocation(): Promise<number | null> {
  try {
    const response = await fetch(`${API_BASE}/tasks/distancia-promedio-tareas-completadaas-direccion`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    
    const result = await response.json()
    return result?.average_distance || null
  } catch (error) {
    console.error('Error fetching average distance with registered location:', error)
    return null
  }
}


// Método adicional para obtener todas las estadísticas juntas
export async function getAllUserStats(): Promise<{
  tasksBySector: Array<{ sector_name: string, task_count: number }>,
  nearestPendingTask: { id: number, title: string, distance: number, sector: string } | null,
  sectorWithMostCompleted2km: { sector: Sector, count: number } | null,
  avgDistance: number | null,
  sectorWithMostCompleted5km: { sector: Sector, count: number } | null,
  nearestTaskAllUsers: Task & { distance?: number, userName?: string } | null,
  avgDistanceRegistered: number | null
}> {
  try {
    const response = await fetch(`${API_BASE}/tasks/user-stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching all user stats:', error)
    throw error
  }
}