<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '~/types/types'
import { updateUser } from '~/services/userService'
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils'
import AppInput from '~/components/common/AppInput.vue'
import AppButton from '~/components/common/AppButton.vue'
import { useUserStore } from '~/stores/auth'

const userStore = useUserStore()

// Si tienes la location en el userStore, úsala, si no, podrías pedirla al backend
const profile = ref<User>({
  id: userStore.userId ?? 0,
  username: userStore.userName,
  name: userStore.userName, // Si tienes un campo 'name' real, úsalo aquí
  role: userStore.userRole || 'USER',
  location: "" // Aquí deberías traer la location real si la tienes
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