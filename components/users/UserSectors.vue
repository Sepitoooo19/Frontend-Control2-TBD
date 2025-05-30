<template>
  <div class="container mx-auto py-8">
    <h1 class="text-3xl font-bold mb-2 text-blue-800 flex items-center gap-2">
      <span>📍</span> Mis Sectores
    </h1>
    <div class="bg-white rounded-lg shadow p-4 mb-8">
      <div v-if="loading" class="text-center p-4">
        <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" fill="currentColor" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
      <div v-else-if="error" class="text-center p-4 text-red-600">
        {{ error }}
      </div>
      <div v-else>
        <ul>
          <li v-for="sector in sectors" :key="sector.id" class="py-2">
            {{ sector.name }} ({{ sector.location }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Sector {
  id: number
  name: string
  location: string
}

const sectors = ref<Sector[]>([])
const loading = ref<boolean>(true)
const error = ref<string>('')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8090'
    const res = await axios.get(`${apiBase}/users/${userId}/sectors`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // Ajusta aquí según el formato real de respuesta del backend
    sectors.value = res.data.sectors || res.data || []
    if (sectors.value.length > 5) sectors.value = sectors.value.slice(0, 5)
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Error al cargar los sectores.'
  } finally {
    loading.value = false
  }
})
</script>