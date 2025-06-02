<template>
  <form @submit.prevent="handleLogin" class="space-y-5">
    <AppInput label="Usuario" v-model="username" required />
    <AppInput label="Contraseña" type="password" v-model="password" required />
    <AppButton type="submit" class="w-full" :loading="loading">Ingresar</AppButton>
    <transition name="fade">
      <p v-if="loginError" class="text-red-500 text-center">{{ loginError }}</p>
    </transition>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login as loginService } from '~/services/authService'
import { getUserLocation } from '~/services/userService' // Importamos el servicio
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
    // 1. Hacer login primero
    const { token, role } = await loginService({ 
      username: username.value, 
      password: password.value 
    })
    
    // Guardar token y rol
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    
    // 2. Obtener la ubicación después del login exitoso
    try {
      const locationData = await getUserLocation()
      if (locationData.success && locationData.location) {
        localStorage.setItem('userLocationWKT', locationData.location)
      }
    } catch (locationError) {
      console.warn('No se pudo obtener la ubicación:', locationError)
      // No es crítico si falla, solo mostramos advertencia
    }

    // Redirigir según el rol
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