<template>
  <ClientOnly>
    <div v-if="isMounted">
      <LMap
        v-model:zoom="zoom"
        :center="center"
        style="height: 300px; width: 100%;"
        @click="onMapClick"
      >
        <LTileLayer :url="tileUrl" :attribution="tileAttribution" />
        <LMarker 
          :lat-lng="[markerLat, markerLng]" 
          draggable 
          @update:lat-lng="updateMarker" 
        />
      </LMap>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  lat?: number | string
  lng?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  lat: 0,
  lng: 0
})

const emit = defineEmits(['update:lat', 'update:lng'])

// Convert props to numbers safely
const toNumber = (value: number | string): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(num) ? 0 : num
}

const zoom = ref(13)
const isMounted = ref(false)
const markerLat = ref(toNumber(props.lat))
const markerLng = ref(toNumber(props.lng))
const center = ref([markerLat.value, markerLng.value])

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tileAttribution = '&copy; OpenStreetMap contributors'

const onMapClick = (e: any) => {
  markerLat.value = e.latlng.lat
  markerLng.value = e.latlng.lng
  emit('update:lat', markerLat.value)
  emit('update:lng', markerLng.value)
}

const updateMarker = ([lat, lng]: [number, number]) => {
  markerLat.value = lat
  markerLng.value = lng
  emit('update:lat', lat)
  emit('update:lng', lng)
}

onMounted(() => {
  isMounted.value = true
})
</script>