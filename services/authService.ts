import type { User } from '~/types/types'; // Asumiendo que tienes una interfaz User para la respuesta del registro si es necesario

// Se usará la instancia de $axios inyectada por el plugin
// Ya no es necesario importar axios directamente aquí para las peticiones principales

export const login = async (username: string, password: string) => {
  const { $axios } = useNuxtApp();
  const config = useRuntimeConfig(); // Para la URL base si $axios no la tuviera configurada por defecto
  
  // $axios ya tiene la baseURL configurada desde el plugin
  const response = await $axios.post(`/auth/login`, { username, password });
  // El backend devuelve directamente el cuerpo con token y rol en caso de éxito.
  // Si hay error, axios por defecto lanzará una excepción.
  return response.data; // Asume que response.data es { token: string, role: string }
};

export const register = async (userData: any) => { // userData debería tener una interfaz más específica
  const { $axios } = useNuxtApp();
  const config = useRuntimeConfig();
  
  // userData debe incluir: username, password, role, name, location (WKT)
  // Ejemplo: userData = { username: "test", password: "123", role: "USER", name: "Test User", location: "POINT(0 0)" }
  const response = await $axios.post(`/auth/register`, userData);
  return response.data; // Asume que response.data es { success: boolean, message: string }
};

export const logout = async () => {
  const { $axios } = useNuxtApp();
  const token = localStorage.getItem('token'); // El token JWT se llama 'token' en tu authRole y localStorage
  
  if (token) {
    try {
      // Opcional: Notificar al backend para invalidar el token
      // Esta URL '/auth/logout' debe existir en tu backend si quieres invalidar el token del lado del servidor
      await $axios.post('/auth/logout', {}); // $axios ya incluye el token en headers por el interceptor
    } catch (error) {
      console.error('Error al cerrar sesión en el backend:', error);
      // Continuar con el borrado local incluso si el backend falla
    }
  }
  // Eliminar el token y rol del localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('role'); // También borra el rol
  // Podrías también resetear el store de Pinia aquí si es necesario
  // const userStore = useUserStore(); // Suponiendo que tienes un store para el usuario
  // userStore.clearUser(); 
};

export const updatePassword = async (userId: number, newPassword: string) => {
  const { $axios } = useNuxtApp();
  const response = await $axios.patch(`/auth/user/${userId}/password`, { newPassword });
  return response.data; // Asume { success: boolean }
}