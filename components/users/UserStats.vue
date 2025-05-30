<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="bg-blue-100 rounded p-4 text-center">
      <div class="text-lg font-bold">{{ stats.tasks }}</div>
      <div class="text-gray-700">Tareas asignadas</div>
    </div>
    <div class="bg-green-100 rounded p-4 text-center">
      <div class="text-lg font-bold">{{ stats.completed }}</div>
      <div class="text-gray-700">Tareas completadas</div>
    </div>
    <div class="bg-yellow-100 rounded p-4 text-center">
      <div class="text-lg font-bold">{{ stats.sectors }}</div>
      <div class="text-gray-700">Sectores asignados</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  tasks: 0,
  completed: 0,
  sectors: 0
})

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8090'
    const res = await axios.get(`${apiBase}/users/${userId}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    stats.value.tasks = res.data?.tasks ?? 0
    stats.value.completed = res.data?.completed ?? 0
    stats.value.sectors = res.data?.sectors ?? 0
  } catch (e) {
    // Puedes agregar manejo de error aquí si lo deseas
  }
})
</script>