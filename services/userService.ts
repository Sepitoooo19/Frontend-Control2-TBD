import type { User } from '~/types/types';

export async function getProfile(): Promise<User> {
  const { $axios } = useNuxtApp();
  // UserController.java tiene GET /users/user
  const response = await $axios.get<User>('/users/user');
  return response.data;
}

export async function updateProfile(userId: number, userUpdates: Partial<Pick<User, 'name' | 'location' | 'username' | 'role'>>): Promise<User> {
  const { $axios } = useNuxtApp();
  // UserController.java tiene PUT /users/{id} que espera un Map.
  // El frontend debe asegurar que solo envía campos modificables por el usuario (name, location).
  // El cambio de 'username' o 'role' por el propio usuario usualmente no se permite o tiene un flujo especial.
  // Por ahora, mantenemos la flexibilidad del backend, pero el frontend debería restringirlo si es necesario.
  const payload: Record<string, string> = {};
  if (userUpdates.name !== undefined) payload.name = userUpdates.name;
  if (userUpdates.location !== undefined) payload.location = userUpdates.location;
  // Username y Role rara vez son actualizables por el propio usuario desde un simple "updateProfile"
  // if (userUpdates.username) payload.username = userUpdates.username;
  // if (userUpdates.role) payload.role = userUpdates.role;


  const response = await $axios.put<User>(`/users/${userId}`, payload);
  return response.data;
}

// Para administradores
export async function getUsers(): Promise<User[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get<User[]>('/users');
  return response.data;
}

// Para administradores
export async function getUserById(id: number): Promise<User> {
  const { $axios } = useNuxtApp();
  // UserController.java GET /users/{id} está protegido con @PreAuthorize("hasRole('ADMIN')")
  const response = await $axios.get<User>(`/users/${id}`);
  return response.data;
}

// Para administradores
export async function deleteUserById(id: number): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.delete(`/users/${id}`);
}

// Para administradores
export async function updateUserAsAdmin(id: number, userData: Partial<User>): Promise<User> {
  const { $axios } = useNuxtApp();
  const payload: Record<string, string> = {};
  if (userData.name) payload.name = userData.name;
  if (userData.location) payload.location = userData.location;
  if (userData.username) payload.username = userData.username;
  if (userData.role) payload.role = userData.role;
  // UserController.java tiene PUT /users/{id} que espera un Map
  const response = await $axios.put<User>(`/users/${id}`, payload);
  return response.data;
}

// Para el propio usuario (o admin para otros)
export async function updatePasswordForUser(userId: number, newPassword: string): Promise<{ success: boolean, message?: string }> {
  const { $axios } = useNuxtApp();
  // AuthController.java tiene PATCH /auth/user/{id}/password
  const response = await $axios.patch<{ success: boolean, message?: string }>(`/auth/user/${userId}/password`, { newPassword });
  return response.data;
}