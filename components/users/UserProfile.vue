<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { User } from '~/types/types'
import { updateUser, updateUserMap } from '~/services/userService'
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils'
import AppInput from '~/components/common/AppInput.vue'
import AppButton from '~/components/common/AppButton.vue'
import { useUserStore } from '~/stores/auth'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import type { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'

const userStore = useUserStore()

const profile = ref<User>({
  id: userStore.userId ?? 0,
  username: userStore.userName,
  name: userStore.userName,
  role: userStore.userRole || 'USER',
  location: ""
})

const mapRef = ref(null)
const zoom = ref(13)
const center = ref<LatLngTuple>([-34.6037, -58.3816]) // Coordenadas por defecto (Buenos Aires)

const lat = ref<number | null>(null)
const lng = ref<number | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref('')
const isGeolocating = ref(false)

// Inicializar mapa con la ubicación actual del usuario
const initializeMapLocation = () => {
  if (profile.value.location) {
    const coords = wktToLatLng(profile.value.location)
    if (coords) {
      lat.value = coords.lat
      lng.value = coords.lng
      center.value = [coords.lat, coords.lng]
      return
    }
  }
  
  // Si no hay ubicación guardada, intentar geolocalización
  getCurrentLocation()
}

// Obtener ubicación actual del navegador
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    error.value = 'Geolocalización no soportada por tu navegador'
    return
  }

  isGeolocating.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      lat.value = position.coords.latitude
      lng.value = position.coords.longitude
      center.value = [position.coords.latitude, position.coords.longitude]
      isGeolocating.value = false
    },
    (err) => {
      error.value = 'No se pudo obtener tu ubicación actual'
      isGeolocating.value = false
      console.error("Error obteniendo ubicación:", err)
    }
  )
}

onMounted(() => {
  initializeMapLocation()
})

// Actualizar centro del mapa cuando cambian las coordenadas
watch([lat, lng], ([newLat, newLng]) => {
  if (newLat !== null && newLng !== null) {
    center.value = [newLat, newLng]
  }
})

// Manejar clic en el mapa para actualizar ubicación
const handleMapClick = async (e: { latlng: { lat: number; lng: number } }) => {
  const { lat: clickLat, lng: clickLng } = e.latlng
  updateLocation(clickLat, clickLng)
}

// Actualizar ubicación (usado tanto para clic como para arrastre de marcador)
const updateLocation = async (newLat: number, newLng: number) => {
  lat.value = newLat
  lng.value = newLng
  
  try {
    loading.value = true
    const wktLocation = latLngToWKT(newLng, newLat)
    const result = await updateUserMap(userStore.userId!, { location: wktLocation })
    
    if (result.success) {
      profile.value.location = wktLocation
      success.value = 'Ubicación actualizada correctamente'
      error.value = ''
    } else {
      error.value = result.message || 'Error desconocido al actualizar'
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error desconocido al actualizar'
  } finally {
    loading.value = false
  }
}

// Manejar envío del formulario
const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  
  if (lat.value === null || lng.value === null) {
    error.value = 'Debes seleccionar una ubicación en el mapa.'
    return
  }

  loading.value = true
  try {
    const updates = {
      name: profile.value.name,
      location: latLngToWKT(lng.value, lat.value)
    }
    
    const response = await updateUser(profile.value.id, updates)
    
    if (response.success) {
      success.value = 'Perfil actualizado correctamente.'
      profile.value.location = updates.location
    } else {
      error.value = response.success || 'Error desconocido al actualizar el perfil.'
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
    <AppInput 
      label="Nombre" 
      v-model="profile.name" 
      required 
    />
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="block font-medium text-gray-700">Ubicación (Latitud)</label>
        <input 
          v-model.number="lat" 
          type="number" 
          step="any" 
          required
          class="w-full px-3 py-2 border rounded-md" 
        />
      </div>
      <div class="space-y-2">
        <label class="block font-medium text-gray-700">Ubicación (Longitud)</label>
        <input 
          v-model.number="lng" 
          type="number" 
          step="any" 
          required
          class="w-full px-3 py-2 border rounded-md" 
        />
      </div>
    </div>
    
    <div class="flex justify-between items-center">
      <h3 class="font-medium text-gray-700">Selecciona tu ubicación en el mapa</h3>
      <button 
        type="button" 
        @click="getCurrentLocation"
        class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        :disabled="isGeolocating"
      >
        <span v-if="isGeolocating">Buscando...</span>
        <span v-else>Usar mi ubicación actual</span>
      </button>
    </div>
    
    <div class="h-96 rounded-lg overflow-hidden border border-gray-300 relative">
      <div v-if="loading" class="absolute inset-0 bg-black bg-opacity-20 z-10 flex items-center justify-center">
        <div class="bg-white p-4 rounded-lg shadow-lg">
          Guardando ubicación...
        </div>
      </div>
      
      <l-map 
        ref="mapRef" 
        v-model:zoom="zoom" 
        @click="handleMapClick"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <l-marker 
          v-if="lat !== null && lng !== null"
          :lat-lng="[lat, lng]"
          :draggable="!loading"
          @update:lat-lng="(newPos) => updateLocation(newPos.lat, newPos.lng)"
        />
      </l-map>
    </div>
    
    <div class="flex justify-end gap-2">
      <AppButton 
        type="submit" 
        variant="primary" 
        :loading="loading"
      >
        Actualizar Perfil
      </AppButton>
    </div>
    
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <p v-if="success" class="text-green-600">{{ success }}</p>
  </form>
</template>