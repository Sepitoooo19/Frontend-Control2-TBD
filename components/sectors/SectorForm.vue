<template>
  <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto space-y-4">
    <AppInput label="Nombre del Sector" v-model="form.name" required />
    <AppInput label="Latitud" v-model="lat" type="number" step="any" required />
    <AppInput label="Longitud" v-model="lng" type="number" step="any" required />
    <div class="flex justify-end gap-2">
      <AppButton type="button" variant="secondary" @click="$emit('close')">Cancelar</AppButton>
      <AppButton type="submit" variant="primary" :loading="loading">
        {{ isEditMode ? 'Actualizar' : 'Guardar' }} Sector
      </AppButton>
    </div>
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </form>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Sector } from '~/types/types'
import { createSector, updateSector } from '~/services/sectorService'
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils'
import AppInput from '~/components/common/AppInput.vue'
import AppButton from '~/components/common/AppButton.vue'

const props = defineProps<{
  sectorData?: Sector
  isEditMode?: boolean
}>()
const emit = defineEmits(['close', 'saved'])
const form = ref<Omit<Sector, 'id'>>({ name: '', location: '' })
const lat = ref('')
const lng = ref('')
const error = ref('')
const loading = ref(false)

const resetForm = () => {
  if (props.isEditMode && props.sectorData) {
    form.value.name = props.sectorData.name
    const coords = wktToLatLng(props.sectorData.location)
    lat.value = coords?.lat?.toString() ?? ''
    lng.value = coords?.lng?.toString() ?? ''
  } else {
    form.value.name = ''
    lat.value = ''
    lng.value = ''
  }
  error.value = ''
}

watch(() => props.sectorData, resetForm, { immediate: true, deep: true })

const handleSubmit = async () => {
  error.value = ''
  if (!lat.value || !lng.value) {
    error.value = 'Debes ingresar latitud y longitud.'
    return
  }
  form.value.location = latLngToWKT(Number(lat.value), Number(lng.value))
  loading.value = true
  try {
    if (props.isEditMode && props.sectorData?.id) {
      await updateSector(props.sectorData.id, form.value)
    } else {
      await createSector(form.value)
    }
    emit('saved')
  } catch (e) {
    error.value = 'Error al guardar sector'
  } finally {
    loading.value = false
  }
}
</script>