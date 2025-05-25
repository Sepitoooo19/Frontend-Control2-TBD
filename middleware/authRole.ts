export default defineNuxtRouteMiddleware((to, from) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') as 'USER' | 'ADMIN' | null : null;

  const loginPath = '/login';
  const homeRoutes: Record<string, string> = {
    USER: '/dashboard',
    ADMIN: '/admin/dashboard',
  };

  if (!token) {
    if (to.path !== loginPath && to.path !== '/register') { // Permitir acceso a register sin token
      return navigateTo(loginPath);
    }
    return;
  }

  if (role && homeRoutes[role]) {
    if (to.path === loginPath || to.path === '/register') {
      return navigateTo(homeRoutes[role]);
    }
    if (to.path === '/') {
      return navigateTo(homeRoutes[role]);
    }

    const allowedRoutesPatterns: Record<string, RegExp[]> = {
      USER: [
        /^\/dashboard(\/.*)?$/,
        /^\/tasks(\/.*)?$/,
        /^\/profile(\/.*)?$/,
        /^\/sectors(\/.*)?$/,
        /^\/reports(\/.*)?$/,
      ],
      ADMIN: [
        /^\/admin(\/.*)?$/,
        // Para que admin también pueda acceder a rutas de USER (ej. ver su propio perfil)
        /^\/dashboard(\/.*)?$/,
        /^\/tasks(\/.*)?$/,
        /^\/profile(\/.*)?$/,
        /^\/sectors(\/.*)?$/,
        /^\/reports(\/.*)?$/,
      ],
    };

    const userAllowedPatterns = allowedRoutesPatterns[role];
    if (userAllowedPatterns) {
      const isAllowed = userAllowedPatterns.some(pattern => pattern.test(to.path));
      if (!isAllowed) {
        return navigateTo(homeRoutes[role]);
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      if (to.path !== loginPath) {
        return navigateTo(loginPath);
      }
    }
  } else if (token && !role) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    if (to.path !== loginPath) {
      return navigateTo(loginPath);
    }
  }
});