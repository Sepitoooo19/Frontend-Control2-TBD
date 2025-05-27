<template>
  <div class="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
    <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <AppInput label="Usuario" v-model="username" required />
      <AppInput label="Contraseña" type="password" v-model="password" required />
      <AppButton type="submit" class="w-full" :loading="loading">Ingresar</AppButton>
      <p v-if="loginError" class="text-red-500 text-center">{{ loginError }}</p>
      <div class="text-center mt-3">
        <NuxtLink to="/register" class="text-blue-600 hover:underline">¿No tienes cuenta? Regístrate aquí</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login as loginService } from '~/services/authService'
import AppInput from '~/components/common/AppInput.vue'
import AppButton from '~/components/common/AppButton.vue'

const username = ref('')
const password = ref('')
const loading = ref(false)
const loginError = ref('')
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  loginError.value = ''
  try {
    const response = await loginService({ username: username.value, password: password.value })
    const { token, role } = response
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    if (role === 'ADMIN') {
      router.push('/home-admin')
    } else {
      router.push('/home-user')
    }
  } catch (error: any) {
    loginError.value = error?.response?.data?.message || 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>