// services/authService.ts

import { useRuntimeConfig } from '#app'; // O '#imports', ambas son válidas en Nuxt 3

/**
 * Decodifica un token JWT para inspeccionar su payload.
 * NOTA: Esto NO verifica la firma del token; solo es para leer los claims en el cliente.
 * La verificación de la firma debe hacerse en el backend.
 * @param token El token JWT como string.
 * @returns El payload decodificado como objeto, o null si hay un error.
 */
function decodeJWT(token: string): any | null {
  try {
    const payloadBase64Url = token.split('.')[1];
    if (!payloadBase64Url) {
      console.error('Token JWT inválido: no se encontró el payload.');
      return null;
    }
    // Convertir Base64URL a Base64 estándar
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decodificar Base64 y luego parsear JSON
    const jsonPayload = atob(payloadBase64);
    const decoded = JSON.parse(jsonPayload);
    return decoded;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

/**
 * Registra un nuevo usuario.
 */
export async function register(data: {
  username: string;
  password: string;
  role: string;
  name: string;
  location: string; // WKT string, ej: "POINT(long lat)"
}): Promise<any> {
  const config = useRuntimeConfig();
  console.log('Intentando registrar usuario con datos:', data);
  try {
    const response = await $fetch('/auth/register', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: data
    });
    console.log('Respuesta del registro:', response);
    return response;
  } catch (error: any) {
    // $fetch ya lanza un error para respuestas no-2xx
    // El componente que llama debe manejar este error
    console.error('Error en el servicio de registro:', error.data?.message || error.message || error);
    throw error; 
  }
}

/**
 * Inicia sesión de un usuario.
 * Guarda token, rol, userId y ubicación en localStorage.
 */
export async function login(credentials: {
  username: string;
  password: string;
}): Promise<any> {
  const config = useRuntimeConfig();
  console.log('Intentando iniciar sesión para:', credentials.username);

  // La llamada $fetch lanzará un error para respuestas no 2xx, 
  // que el componente LoginForm debe manejar.
  const loginResponse = await $fetch('/auth/login', {
    baseURL: config.public.apiBase,
    method: 'POST',
    body: credentials
  }) as any; // Asumimos que loginResponse tiene { token, role, location? }

  const token = loginResponse?.token;
  const role = loginResponse?.role;
  const locationWKT = loginResponse?.location;

  if (token && typeof token === 'string') {
    localStorage.setItem('token', token);
    console.log('✅ Token guardado en localStorage.');

    if (role && typeof role === 'string') {
      localStorage.setItem('role', role);
      console.log(`✅ Rol ('${role}') guardado en localStorage.`);
    } else {
      console.warn('⚠️ Rol no encontrado o inválido en la respuesta del login. Limpiando rol anterior.');
      localStorage.removeItem('role');
    }

    const decodedToken = decodeJWT(token);
    if (decodedToken) {
      console.log('JWT decodificado:', decodedToken);
      // Priorizar IDs numéricos específicos (userId, id, user_id) antes que 'sub'.
      const userId = decodedToken.userId || decodedToken.id || decodedToken.user_id || decodedToken.sub;
      if (userId !== undefined && userId !== null) {
        localStorage.setItem('userId', userId.toString());
        console.log(`✅ UserId ('${userId.toString()}') extraído del JWT y guardado.`);
      } else {
        console.error('❌ No se pudo extraer un userId válido del JWT. Limpiando userId anterior.');
        localStorage.removeItem('userId');
      }
    } else {
      console.error('❌ No se pudo decodificar el JWT. Limpiando userId anterior.');
      localStorage.removeItem('userId');
    }

    if (locationWKT && typeof locationWKT === 'string' && locationWKT.toUpperCase().startsWith('POINT')) {
      localStorage.setItem('userLocationWKT', locationWKT);
      console.log(`✅ userLocationWKT ('${locationWKT}') guardado desde respuesta del login.`);
    } else {
      console.warn('⚠️ No se encontró una "location" (string WKT válida) en la respuesta del login. Limpiando ubicación anterior.');
      localStorage.removeItem('userLocationWKT');
    }
  } else {
    console.error('❌ Token no encontrado o inválido en la respuesta del login. Limpiando datos de sesión.');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userLocationWKT');
  }

  return loginResponse; // Devuelve la respuesta completa del login
}

/**
 * Actualiza la contraseña de un usuario.
 * @param userId El ID del usuario.
 * @param newPassword La nueva contraseña.
 */
export async function updatePassword(userId: number, newPassword: string): Promise<any> {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('token');

  if (!token) {
    const authError = new Error('Usuario no autenticado para actualizar contraseña.');
    console.error(authError.message);
    throw authError;
  }

  console.log(`Intentando actualizar contraseña para usuario ID: ${userId}`);
  try {
    // El backend AuthController tiene @PatchMapping("/user/{id}/password") bajo @RequestMapping("/auth")
    // por lo que la ruta completa es /auth/user/{id}/password
    const response = await $fetch(`/auth/user/${userId}/password`, {
      baseURL: config.public.apiBase,
      method: 'PATCH', // Usar PATCH según tu AuthController
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: { newPassword: newPassword } // El backend espera un objeto con "newPassword"
    });
    console.log('Respuesta de actualización de contraseña:', response);
    return response;
  } catch (error: any) {
    console.error('Error en el servicio de actualizar contraseña:', error.data?.message || error.message || error);
    throw error;
  }
}