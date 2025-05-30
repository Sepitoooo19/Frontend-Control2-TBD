<template>
  <div>
    <div v-if="loading" class="text-gray-500">Cargando sectores...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="sectors.length === 0" class="text-gray-500">No tienes sectores asignados.</div>
    <ul v-else class="space-y-2">
      <li v-for="sector in sectors" :key="sector.id" class="p-2 bg-gray-100 rounded">
        <strong>{{ sector.name }}</strong>
        <div class="text-sm text-gray-600">Ubicación: {{ sector.location }}</div>
      </li>
    </ul>
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
    // Obtén el token del localStorage
    const token = localStorage.getItem('token')
    // Si tienes el userId en el store, úsalo aquí (ajusta si tu endpoint es diferente)
    const userId = localStorage.getItem('userId')
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8090'
    const res = await axios.get(`${apiBase}/users/${userId}/sectors`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    sectors.value = res.data?.sectors || []
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Error al cargar los sectores.'
  } finally {
    loading.value = false
  }
})
</script>