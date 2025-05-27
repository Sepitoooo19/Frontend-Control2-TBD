<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '~/types/types'
import { updateUser } from '~/services/userService'
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils'
import AppInput from '~/components/common/AppInput.vue'
import AppButton from '~/components/common/AppButton.vue'
import { useUserStore } from '~/stores/auth'

const userStore = useUserStore()

const profile = ref<User>({
  id: userStore.userId ?? 0,
  username: userStore.userName,
  name: userStore.userName,
  role: userStore.userRole || 'USER',
  location: ""
})

const lat = ref('')
const lng = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

onMounted(() => {
  const coords = wktToLatLng(profile.value.location)
  lat.value = coords?.lat?.toString() ?? ''
  lng.value = coords?.lng?.toString() ?? ''
})

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  if (!lat.value || !lng.value) {
    error.value = 'Debes ingresar latitud y longitud válidas.'
    return
  }
  loading.value = true
  try {
    await updateUser(profile.value.id, {
      name: profile.value.name,
      location: latLngToWKT(Number(lat.value), Number(lng.value))
    })
    success.value = 'Perfil actualizado correctamente.'
  } catch (e) {
    error.value = 'Error al actualizar perfil.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto bg-white p-6 rounded-xl shadow space-y-4">
    <AppInput label="Nombre" v-model="profile.name" required />
    <div class="flex gap-2">
      <AppInput label="Latitud" v-model="lat" type="number" step="any" required />
      <AppInput label="Longitud" v-model="lng" type="number" step="any" required />
    </div>
    <div class="flex justify-end gap-2">
      <AppButton type="submit" variant="primary" :loading="loading">Actualizar Perfil</AppButton>
    </div>
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <p v-if="success" class="text-green-600">{{ success }}</p>
  </form>
</template>