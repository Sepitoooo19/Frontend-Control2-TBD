<template>
  <div class="auth-layout">
    <main class="auth-container">
      <h1 class="text-center mb-4">Bienvenido a UdeSantiago</h1>
      <slot />
      <p class="text-center text-muted">Por favor, inicia sesión o regístrate para continuar.</p>
      <div class="text-center mt-3">
        <NuxtLink to="/login" class="btn btn-primary me-2">Iniciar Sesión</NuxtLink>
        <NuxtLink to="/register" class="btn btn-secondary">Registrarse</NuxtLink>
      </div>
    </main>
    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} UdeSantiago - TBD</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #e9ecef;
}
.auth-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.app-footer {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  color: #6c757d;
  border-top: 1px solid #e7e7e7;
}
</style>