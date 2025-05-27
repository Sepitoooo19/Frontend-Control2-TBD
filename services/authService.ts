import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE || '/'

export async function register(data: {
  username: string
  password: string
  role: string
  name: string
  location: string  // WKT
}) {
  const res = await axios.post(`${apiBase}/auth/register`, data)
  return res.data
}

export async function login(credentials: { username: string, password: string }) {
  const res = await axios.post(`${apiBase}/auth/login`, credentials)
  return res.data
}

// Cambiar contraseña usuario
export async function updatePassword(id: number, newPassword: string): Promise<{ success: boolean }> {
  const res = await axios.put(`${apiBase}/users/${id}/password`, { password: newPassword })
  return res.data
}