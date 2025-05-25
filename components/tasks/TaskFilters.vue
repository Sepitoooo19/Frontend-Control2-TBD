<template>
  <form class="flex flex-wrap gap-2 items-center mb-4" @submit.prevent="$emit('filter', {status, keyword})">
    <label class="text-gray-700 font-medium">Estado:</label>
    <select v-model="status" class="border rounded px-2 py-1">
      <option value="">Todos</option>
      <option value="PENDING">Pendiente</option>
      <option value="COMPLETED">Completada</option>
    </select>
    <input
      v-model="keyword"
      type="text"
      placeholder="Buscar por título o descripción"
      class="border rounded px-2 py-1"
    />
    <AppButton type="submit" variant="primary" size="sm">Filtrar</AppButton>
    <AppButton type="button" variant="secondary" size="sm" @click="reset">Limpiar</AppButton>
  </form>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '~/components/common/AppButton.vue'
const status = ref('')
const keyword = ref('')
function reset() {
  status.value = ''
  keyword.value = ''
  // Emitir evento para limpiar filtros
  emit('filter', { status: '', keyword: '' })
}
const emit = defineEmits(['filter'])
</script>