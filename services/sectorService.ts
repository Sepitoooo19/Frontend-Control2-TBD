import type { Sector } from '~/types/types';

// Ya no se necesita API_BASE_URL aquí, se usará la instancia de $axios
// ni la función getToken(), el interceptor de axios se encarga del token.

export async function getSectors(): Promise<Sector[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get(`/sectors`);
  return response.data;
}

export async function getSectorById(id: number): Promise<Sector> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get(`/sectors/${id}`);
  return response.data;
}

export async function createSector(sector: { name: string; location: string }): Promise<Sector> {
  const { $axios } = useNuxtApp();
  const response = await $axios.post(`/sectors`, sector);
  return response.data;
}

export async function updateSector(id: number, sector: { name: string; location: string }): Promise<Sector> {
  const { $axios } = useNuxtApp();
  const response = await $axios.put(`/sectors/${id}`, sector);
  return response.data;
}

export async function deleteSector(id: number): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.delete(`/sectors/${id}`);
}