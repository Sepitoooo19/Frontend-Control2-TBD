<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-green-100 to-green-50">
    <div class="w-full max-w-md mx-auto bg-white/95 rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-2">
      <div class="flex flex-col items-center mb-4">
        <h1 class="text-3xl font-extrabold text-blue-700 tracking-wide">Bienvenido</h1>
        <p class="text-gray-500 text-center text-sm mt-1">Ingresa a tu cuenta para continuar</p>
      </div>
      <LoginForm />
      <div class="mt-6 text-center">
        <NuxtLink
          to="/register"
          class="!text-purple-700 font-semibold underline hover:!text-purple-900 transition-colors"
        >
          ¿No tienes cuenta? Regístrate aquí
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'

definePageMeta({
  layout: 'auth',
  middleware: ['guess']
});
</script>