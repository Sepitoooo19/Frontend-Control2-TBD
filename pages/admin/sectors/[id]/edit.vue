<template>
  <div class="container max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Editar Sector</h2>
    <SectorForm :sectorData="sectorData" :isEditMode="true" @saved="onSaved" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSectorById } from '~/services/sectorService'
import SectorForm from '~/components/sectors/SectorForm.vue'
definePageMeta({ middleware: 'auth-role' })
const route = useRoute()
const router = useRouter()
const sectorData = ref(null)
onMounted(async () => {
  sectorData.value = await getSectorById(Number(route.params.id))
})
const onSaved = () => router.push('/sectors')
</script>