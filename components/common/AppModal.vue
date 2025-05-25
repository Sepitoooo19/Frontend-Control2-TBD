<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @mousedown.self="$emit('update:modelValue', false)">
      <div class="modal-content" :style="{ maxWidth: maxWidth }">
        <div v-if="title" class="modal-header">
          <h3>{{ title }}</h3>
          <button @click="$emit('update:modelValue', false)" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean; // Reemplaza a `show` para v-model
  title?: string;
  maxWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: '600px',
});

const emit = defineEmits(['update:modelValue']);

// Cerrar con tecla Escape
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    emit('update:modelValue', false);
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
/* .modal-overlay y .modal-content ya están en main.css */
.btn-close {
  background: none;
  border: none;
  font-size: 1.8rem;
  line-height: 1;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto; /* Alinea a la derecha */
}
.btn-close:hover {
  color: #343a40;
}
</style>