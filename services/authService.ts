// Función para decodificar JWT (solo para extraer datos, no para verificar)
function decodeJWT(token: string) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch (error) {
    console.error('Error decodificando JWT:', error)
    return null
  }
}

export async function register(data: {
  username: string
  password: string
  role: string
  name: string
  location: string  // WKT
}): Promise<any> {
  const config = useRuntimeConfig()
  
  const res = await $fetch('/auth/register', {
    baseURL: config.public.apiBase,
    method: 'POST',
    body: data
  })
  return res
}

export async function login(credentials: { username: string, password: string }): Promise<any> {
  const config = useRuntimeConfig()
  
  const res = await $fetch('/auth/login', {
    baseURL: config.public.apiBase,
    method: 'POST',
    body: credentials
  }) as any
  
  const token = res.token
  
  if (token) {
    // Guardar token
    localStorage.setItem('token', token)
    console.log('✅ Token guardado')
    
    // Decodificar JWT para extraer userId
    const decoded = decodeJWT(token)
    console.log('JWT decodificado:', decoded)
    
    // El userId puede estar en diferentes campos del JWT
    const userId = decoded?.sub || decoded?.userId || decoded?.id || decoded?.user_id
    
    if (userId) {
      localStorage.setItem('userId', userId.toString())
      console.log('✅ UserId extraído del JWT y guardado:', userId)
    } else {
      console.error('❌ No se pudo extraer userId del JWT')
      console.log('Contenido del JWT:', decoded)
    }
  }
  
  return res
}

export async function updatePassword(id: number, newPassword: string): Promise<any> {
  const config = useRuntimeConfig()
  
  const res = await $fetch(`/users/${id}/password`, {
    baseURL: config.public.apiBase,
    method: 'PUT',
    body: { password: newPassword }
  })
  return res
}