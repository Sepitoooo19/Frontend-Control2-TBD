import axios from 'axios'
import type { Sector } from '~/types/types'

const apiBase = import.meta.env.VITE_API_BASE || '/api'

// ¿Cuántas tareas ha hecho el usuario por sector?
export async function getUserTaskCountBySector(): Promise<Record<string, number>> {
  const res = await axios.get(`${apiBase}/stats/user-tasks-by-sector`)
  return res.data
}

// ¿Cuál es la tarea más cercana al usuario (pendiente)?
export async function getNearestPendingTaskToUser(): Promise<{ id: number, title: string, distance: number, sector: string }> {
  const res = await axios.get(`${apiBase}/stats/nearest-pending-task`)
  return res.data
}

// ¿Cuál es el sector con más tareas completadas en un radio de X km del usuario?
export async function getSectorWithMostCompletedNearby(radiusKm: number): Promise<{ sector: Sector, count: number }> {
  const res = await axios.get(`${apiBase}/stats/most-completed-sector-nearby`, { params: { radius: radiusKm } })
  return res.data
}

// ¿Cuál es el promedio de distancia de las tareas completadas respecto a la ubicación del usuario?
export async function getAvgDistanceOfCompletedTasks(): Promise<number> {
  const res = await axios.get(`${apiBase}/stats/avg-completed-distance`)
  return res.data
}

// ¿En qué sectores se concentran la mayoría de las tareas pendientes?
export async function getPendingTasksHeatmap(): Promise<Array<{ sector: Sector, pendingCount: number }>> {
  const res = await axios.get(`${apiBase}/stats/pending-heatmap`)
  return res.data
}