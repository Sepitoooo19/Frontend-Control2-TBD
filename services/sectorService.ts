import axios from 'axios'
import type { Sector } from '~/types/types'

const apiBase = import.meta.env.VITE_API_BASE || '/api'

export async function getSectors(): Promise<Sector[]> {
  const res = await axios.get<Sector[]>(`${apiBase}/sectors`)
  return res.data
}

export async function getSectorById(id: number): Promise<Sector> {
  const res = await axios.get<Sector>(`${apiBase}/sectors/${id}`)
  return res.data
}

export async function createSector(sector: Omit<Sector, 'id'>): Promise<Sector> {
  const res = await axios.post<Sector>(`${apiBase}/sectors`, sector)
  return res.data
}

export async function updateSector(id: number, sector: Omit<Sector, 'id'>): Promise<Sector> {
  const res = await axios.put<Sector>(`${apiBase}/sectors/${id}`, sector)
  return res.data
}

export async function deleteSector(id: number): Promise<{ success: boolean; message: string }> {
  const res = await axios.delete(`${apiBase}/sectors/${id}`)
  return res.data
}