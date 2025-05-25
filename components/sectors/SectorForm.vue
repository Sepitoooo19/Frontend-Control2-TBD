<template>
  <form @submit.prevent="submitForm">
    <h3 class="mb-3">{{ isEditMode ? 'Editar' : 'Crear' }} Sector</h3>
    <AppInput
      id="sectorName"
      v-model="form.name"
      label="Nombre del Sector"
      placeholder="Ej: Construcción Centro"
      required
      :error="errors.name"
      class="mb-2"
    />
    <AppInput
      id="sectorLocation"
      v_model="form.location"
      label="Ubicación (Formato WKT)"
      placeholder="POINT(longitud latitud)"
      required
      :error="errors.location"
      class="mb-3"
      help-text="Ej: POINT(-70.6505 -33.4379)"
    />
    <div v-if="errors.general" class="alert alert-danger mt-2 mb-2">
        {{ errors.general }}
    </div>
    <div class="modal-footer">
      <AppButton type="button" variant="secondary" @click="$emit('close')">
        Cancelar
      </AppButton>
      <AppButton type="submit" variant="primary" :loading="loading">
        {{ isEditMode ? 'Actualizar' : 'Guardar' }} Sector
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Sector } from '~/types/types';
import { createSector, updateSector } from '~/services/sectorService';
import { latLngToWKT, wktToLatLng } from '~/utils/wktUtils';
import { useNuxtApp } from '#app';

const { $toast } = useNuxtApp();

interface Props {
  sectorData?: Sector | null;
  isEditMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sectorData: null,
  isEditMode: false,
});

const emit = defineEmits(['close', 'saved']);

const form = ref<{ name: string; location: string }>({
  name: '',
  location: '', // WKT string
});
const loading = ref(false);
const errors = ref({ name: '', location: '', general: '' });

const resetForm = () => {
  if (props.isEditMode && props.sectorData) {
    form.value.name = props.sectorData.name;
    form.value.location = props.sectorData.location;
  } else {
    form.value.name = '';
    form.value.location = '';
  }
  errors.value = { name: '', location: '', general: '' };
};

watch(() => props.sectorData, () => {
  resetForm();
}, { immediate: true, deep: true });

onMounted(() => {
  resetForm();
});


const validateForm = () => {
  errors.value = { name: '', location: '', general: '' };
  let isValid = true;
  if (!form.value.name.trim()) {
    errors.value.name = 'El nombre del sector es requerido.';
    isValid = false;
  }
  if (!form.value.location.trim()) {
    errors.value.location = 'La ubicación es requerida.';
    isValid = false;
  } else if (!wktToLatLng(form.value.location)) {
    errors.value.location = 'Formato WKT inválido. Ej: POINT(-70.65 -33.43)';
    isValid = false;
  }
  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }
  loading.value = true;
  errors.value.general = '';
  try {
    if (props.isEditMode && props.sectorData?.id) {
      await updateSector(props.sectorData.id, { ...form.value });
      $toast.success('Sector actualizado exitosamente!');
    } else {
      await createSector({ ...form.value });
      $toast.success('Sector creado exitosamente!');
    }
    emit('saved');
    emit('close');
  } catch (error: any) {
    console.error('Error guardando sector:', error);
    errors.value.general = error.response?.data?.message || 'Error al guardar el sector.';
    $toast.error(errors.value.general);
  } finally {
    loading.value = false;
  }
};
</script>