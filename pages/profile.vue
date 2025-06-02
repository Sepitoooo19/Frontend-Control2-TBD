<template>
  <div class="max-w-xl mx-auto py-8">
    <h2 class="text-2xl font-bold mb-6 text-blue-700">Mi Perfil</h2>
    <div v-if="isLoading" class="text-center text-gray-500 py-4">Cargando perfil...</div>
    <div v-if="loadError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ loadError }}</div>
    <form v-if="userReady"
      @submit.prevent="handleUpdateProfile"
      class="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <div>
        <label class="block text-gray-700 font-medium mb-1">ID de Usuario:</label>
        <input type="text" :value="userId" disabled class="w-full border rounded px-3 py-2 bg-gray-100" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">Nombre de Usuario:</label>
        <input
          type="text"
          v-model="editableProfile.username"
          required
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">Nombre Completo:</label>
        <input type="text" v-model="editableProfile.name" required class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">Rol:</label>
        <input type="text" :value="role" disabled class="w-full border rounded px-3 py-2 bg-gray-100" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">Ubicación:</label>
        <MapPicker
          :lat="lat"
          :lng="lng"
          @update:lat="onUpdateLat"
          @update:lng="onUpdateLng"
        />
        <div class="text-xs text-gray-500 mt-1">
          La ubicación se guardará como <span class="font-mono">POINT(lng lat)</span> en tu perfil.
        </div>
      </div>
      <div class="flex gap-4">
        <button
          type="submit"
          :disabled="isUpdatingProfile"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {{ isUpdatingProfile ? 'Actualizando Perfil...' : 'Actualizar Perfil' }}
        </button>
        <button
          type="button"
          @click="resetLocation"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getProfile, updateProfile } from '~/services/userService'
import MapPicker from '~/components/common/MapPicker.vue'

const { $toast } = useNuxtApp()

const isLoading = ref(false)
const loadError = ref('')
const isUpdatingProfile = ref(false)
const userReady = ref(false)

const userId = ref<number | null>(null)
const role = ref<string>('USER') // default a USER
const lat = ref<number | undefined>(undefined)
const lng = ref<number | undefined>(undefined)
const initialLat = ref<number | undefined>(undefined)
const initialLng = ref<number | undefined>(undefined)

const editableProfile = reactive({
  username: '',
  name: '',
})

definePageMeta({
  layout: 'user',
  middleware: 'auth-role'
})

onMounted(async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    // 💡 Llama siempre al backend para obtener el perfil real
    const profile = await getProfile() // GET /users/user
    userId.value = profile.id
    editableProfile.username = profile.username
    editableProfile.name = profile.name
    role.value = profile.role || 'USER'

    // Si la ubicación es WKT tipo "POINT(lng lat)"
    let location = profile.location || ''
    if (location && location.startsWith('POINT(')) {
      const match = location.match(/POINT\(([^)]+)\)/)
      if (match) {
        const coords = match[1].trim().split(/\s+/)
        lng.value = parseFloat(coords[0])
        lat.value = parseFloat(coords[1])
        initialLng.value = lng.value
        initialLat.value = lat.value
      }
    } else {
      // Default/fallback Santiago
      lat.value = -33.45
      lng.value = -70.65
      initialLat.value = lat.value
      initialLng.value = lng.value
    }
    userReady.value = true
  } catch (error: any) {
    console.error("Error al cargar el perfil:", error)
    loadError.value = error.message || "No se pudo cargar el perfil."
    $toast?.error(loadError.value)
  } finally {
    isLoading.value = false
  }
})

const onUpdateLat = (newLat: number) => { lat.value = newLat }
const onUpdateLng = (newLng: number) => { lng.value = newLng }

const resetLocation = () => {
  lat.value = initialLat.value
  lng.value = initialLng.value
}

const handleUpdateProfile = async () => {
  if (!userId.value) return
  if (lat.value === undefined || lng.value === undefined) {
    $toast?.error('Selecciona una ubicación en el mapa.')
    return
  }
  isUpdatingProfile.value = true
  try {
    const newLocation = `POINT(${lng.value} ${lat.value})`
    // Garantiza que el rol es uno permitido por el tipo User
    const safeRole = (role.value === "USER" || role.value === "ADMIN") ? role.value : "USER"
    const updatePayload = {
      username: editableProfile.username,
      name: editableProfile.name,
      role: safeRole as "USER" | "ADMIN",
      location: newLocation,
    }
    const updated = await updateProfile(userId.value, updatePayload)
    // Opcional: guardar en localStorage si quieres
    initialLat.value = lat.value
    initialLng.value = lng.value
    $toast?.success('Perfil actualizado exitosamente.')
  } catch (error: any) {
    console.error("Error al actualizar perfil:", error)
    $toast?.error(error.response?.data?.message || 'Error al actualizar el perfil.')
  } finally {
    isUpdatingProfile.value = false
  }
}
</script>