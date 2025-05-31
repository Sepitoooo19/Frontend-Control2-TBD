import type { Sector } from '~/types/types'

export async function getSectors(): Promise<Sector[]> {
  const config = useRuntimeConfig()
  
  const res = await $fetch<Sector[]>('/sectors', {
    baseURL: config.public.apiBase,
    method: 'GET'
  })
  return res
}

export async function getSectorById(id: number): Promise<Sector> {
  const config = useRuntimeConfig()
  
  const res = await $fetch<Sector>(`/sectors/${id}`, {
    baseURL: config.public.apiBase,
    method: 'GET'
  })
  return res
}

export async function createSector(sector: Omit<Sector, 'id'>): Promise<Sector> {
  const config = useRuntimeConfig()
  
  const res = await $fetch<Sector>('/sectors', {
    baseURL: config.public.apiBase,
    method: 'POST',
    body: sector
  })
  return res
}

export async function updateSector(id: number, sector: Omit<Sector, 'id'>): Promise<Sector> {
  const config = useRuntimeConfig()
  
  const res = await $fetch<Sector>(`/sectors/${id}`, {
    baseURL: config.public.apiBase,
    method: 'PUT',
    body: sector
  })
  return res
}

export async function deleteSector(id: number): Promise<{ success: boolean; message: string }> {
  const config = useRuntimeConfig()
  
  const res = await $fetch<{ success: boolean; message: string }>(`/sectors/${id}`, {
    baseURL: config.public.apiBase,
    method: 'DELETE'
  })
  return res
}