<template>
  <div class="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
    <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">Registro de Usuario</h2>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <AppInput label="Usuario" v-model="form.username" required />
      <AppInput label="Nombre Completo" v-model="form.name" required />
      <AppInput label="Contraseña" type="password" v-model="form.password" required />
      <div>
        <label class="block mb-1 font-medium text-gray-700">Rol</label>
        <select v-model="form.role" class="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300" required>
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
      <div class="flex gap-2">
        <AppInput label="Latitud" v-model="lat" type="number" step="any" required />
        <AppInput label="Longitud" v-model="lng" type="number" step="any" required />
      </div>
      <AppButton type="submit" class="w-full" :loading="loading">Registrarse</AppButton>
      <p v-if="registerError" class="text-red-500 text-center mt-2">{{ registerError }}</p>
      <div class="text-center mt-3">
        <NuxtLink to="/login" class="text-blue-600 hover:underline">¿Ya tienes cuenta? Inicia sesión aquí</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register as registerService } from '~/services/authService'
import AppInput from '~/components/common/AppInput.vue'
import AppButton from '~/components/common/AppButton.vue'
import { latLngToWKT } from '~/utils/wktUtils'

const form = ref({
  username: '',
  password: '',
  name: '',
  role: 'USER',
  location: ''
})
const lat = ref('')
const lng = ref('')
const loading = ref(false)
const registerError = ref('')
const router = useRouter()

const handleRegister = async () => {
  if (!lat.value || !lng.value) {
    registerError.value = 'Debes ingresar latitud y longitud.'
    return
  }
  form.value.location = latLngToWKT(Number(lat.value), Number(lng.value))
  loading.value = true
  registerError.value = ''
  try {
    const response = await registerService(form.value)
    if (!response || response.success === false) {
      throw new Error(response?.message || 'Error al registrar')
    }
    alert('Usuario registrado exitosamente')
    router.push('/login')
  } catch (error: any) {
    registerError.value = error?.response?.data?.message || error?.message || 'Error al registrar'
  } finally {
    loading.value = false
  }
}
</script>