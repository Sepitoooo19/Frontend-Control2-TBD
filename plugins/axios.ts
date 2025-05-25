import axios from "axios";
import { useUserStore } from '~/stores/auth'; // Asegúrate que la ruta sea correcta si el store está en subdirectorio

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const instance = axios.create({
    baseURL: config.public.apiBase as string,
  });

  instance.interceptors.request.use(config => {
    if (typeof window !== 'undefined') { // Asegurar que se ejecuta en el cliente
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    response => response,
    error => {
      // Asegurarse de que nuxtApp.$pinia esté disponible y que useRouter se llame dentro del contexto adecuado
      // Es mejor manejar los toasts y redirecciones en el cliente o a través de un error global de Nuxt si es posible.
      if (typeof window !== 'undefined') {
        const userStore = useUserStore(nuxtApp.$pinia);
        const router = useRouter(); // Esto debería funcionar si el plugin se ejecuta en el contexto correcto
        const { $toast } = nuxtApp; // Acceder a toast desde nuxtApp si se proveyó correctamente

        if (error.response) {
          const status = error.response.status;
          const currentPath = router.currentRoute.value.path;

          if (status === 401) {
            if (currentPath !== '/login' && currentPath !== '/register') {
              if ($toast && typeof $toast.error === 'function') {
                $toast.error('Sesión expirada o no autorizado. Por favor, inicia sesión.');
              } else {
                console.error('Toast no disponible: Sesión expirada o no autorizado.');
              }
              userStore.clearUser();
              // navigateTo es preferible en Nuxt 3 para navegación programática
              return navigateTo('/login');
            }
          } else if (status === 403) {
            if ($toast && typeof $toast.error === 'function') {
              $toast.error('No tienes permiso para acceder a este recurso.');
            } else {
              console.error('Toast no disponible: No tienes permiso.');
            }
            const homeRoute = userStore.userRole === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
            if (currentPath !== homeRoute) {
             return navigateTo(homeRoute);
            }
          } else if (status >= 500) {
             if ($toast && typeof $toast.error === 'function') {
                $toast.error('Error interno del servidor. Inténtalo de nuevo más tarde.');
              } else {
                console.error('Toast no disponible: Error interno del servidor.');
              }
          } else if (status >= 400 && error.response.data && error.response.data.message) {
            if ($toast && typeof $toast.error === 'function') {
                $toast.error(error.response.data.message);
              } else {
                console.error(`Toast no disponible: ${error.response.data.message}`);
              }
          } else {
             if ($toast && typeof $toast.error === 'function') {
                $toast.error('Ocurrió un error inesperado.');
              } else {
                console.error('Toast no disponible: Error inesperado.');
              }
          }
        } else if (error.request) {
          if ($toast && typeof $toast.error === 'function') {
            $toast.error('No se pudo conectar con el servidor. Verifica tu conexión.');
          } else {
            console.error('Toast no disponible: Error de red.');
          }
        } else {
          if ($toast && typeof $toast.error === 'function') {
            $toast.error(`Error: ${error.message}`);
          } else {
            console.error(`Toast no disponible: ${error.message}`);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  // Solo necesitas una forma de proveerlo.
  // nuxtApp.provide('axios', instance); // Elimina esta línea o la de abajo.

  return {
    provide: {
      axios: instance, // Esta es la forma preferida y más común.
    },
  };
});