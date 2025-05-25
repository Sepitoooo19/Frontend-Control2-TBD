<template>
  <div>
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '~/components/auth/RegisterForm.vue';

definePageMeta({
  layout: 'auth', // O el layout que uses para páginas sin autenticación
  middleware: ['guess'] // Middleware para redirigir si ya está logueado
});
</script>