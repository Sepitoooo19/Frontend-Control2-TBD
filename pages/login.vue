<template>
  <div>
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue';

definePageMeta({
  layout: 'auth', // O el layout que uses para páginas sin autenticación
  middleware: ['guess'] // Middleware para redirigir si ya está logueado
});
</script>