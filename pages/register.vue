<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-blue-100 to-green-50">
    <div class="w-full max-w-lg mx-auto bg-white/95 rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-2">
      <div class="flex flex-col items-center mb-4">
        <h1 class="text-3xl font-extrabold text-blue-700 tracking-wide">Crear cuenta</h1>
        <p class="text-gray-500 text-center text-sm mt-1">Únete y comienza a gestionar tus tareas</p>
      </div>
      <RegisterForm />
      <div class="mt-6 text-center">
        <NuxtLink
          to="/login"
          class="!text-blue-700 font-semibold underline hover:!text-blue-900 transition-colors"
        >
          ¿Ya tienes cuenta? Inicia sesión aquí
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import RegisterForm from '~/components/auth/RegisterForm.vue'

definePageMeta({
  layout: 'auth',
  middleware: ['guess']
});
</script>