import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE || '/api'

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