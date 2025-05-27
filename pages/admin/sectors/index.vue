<template>
  <div class="container max-w-3xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Sectores</h2>
      <router-link to="/sectors/create" class="btn btn-primary">Crear Sector</router-link>
    </div>
    <SectorList
      :sectors="sectors"
      @edit="onEdit"
      @delete="onDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SectorList from '~/components/sectors/SectorList.vue'
import { getSectors, deleteSector } from '~/services/sectorService'
import type { Sector } from '~/types/types'

definePageMeta({ middleware: 'auth-role' })

const sectors = ref<Sector[]>([])
const router = useRouter()

const fetchSectors = async () => {
  sectors.value = await getSectors()
}

onMounted(fetchSectors)

const onEdit = (sector: Sector) => {
  router.push(`/admin/sectors/${sector.id}/edit`)
}

const onDelete = async (id: number) => {
  await deleteSector(id)
  await fetchSectors() // Refresca la lista
}
</script>