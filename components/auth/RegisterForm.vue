<template>
  <form @submit.prevent="handleRegister" class="space-y-5">
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
    <div>
      <label class="block mb-1 font-medium text-gray-700">Ubicación</label>
      <p class="text-sm text-gray-500 mt-1">Haz clic en el mapa para seleccionar tu ubicación</p>
      <MapPicker 
        :lat="lat"
        :lng="lng"
        @update:lat="updateLat"
        @update:lng="updateLng"
      />
    </div>
    <AppButton type="submit" class="w-full" :loading="loading">Registrarse</AppButton>
    <transition name="fade">
      <p v-if="registerError" class="text-red-500 text-center mt-2">{{ registerError }}</p>
    </transition>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register as registerService } from '~/services/authService'
import AppInput from '~/components/common/AppInput.vue'
import AppButton from '~/components/common/AppButton.vue'
import { latLngToWKT } from '~/utils/wktUtils'
import MapPicker from '~/components/common/MapPicker.vue'

const form = ref({
  username: '',
  password: '',
  name: '',
  role: 'USER',
  location: ''
})

const lat = ref<number>(-33.459229)
const lng = ref<number>(-70.645348)
const loading = ref(false)
const registerError = ref('')
const router = useRouter()

const updateLat = (newLat: number) => {
  lat.value = newLat
  form.value.location = latLngToWKT(lat.value, lng.value)
}

const updateLng = (newLng: number) => {
  lng.value = newLng
  form.value.location = latLngToWKT(lat.value, lng.value)
}

const handleRegister = async () => {
  if (!lat.value || !lng.value) {
    registerError.value = 'Debes seleccionar una ubicación en el mapa'
    return
  }
  form.value.location = latLngToWKT(lat.value, lng.value)
  loading.value = true
  registerError.value = ''
  try {
    const response = await registerService({
      ...form.value,
      location: form.value.location
    })
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