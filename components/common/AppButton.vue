<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center font-medium rounded shadow focus:outline-none transition',
      variantClasses,
      sizeClasses,
      { 'opacity-60 cursor-not-allowed': disabled || loading }
    ]"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <AppSpinner v-if="loading" small />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppSpinner from './AppSpinner.vue'

const props = defineProps({
  type: { type: String as () => 'button' | 'submit' | 'reset', default: 'button' },
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const variantClasses = computed(() => ({
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  link: 'bg-transparent underline text-blue-600 hover:text-blue-800'
}[props.variant] || ''))

const sizeClasses = computed(() => ({
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}[props.size] || 'px-4 py-2 text-base'))

function onClick(e: Event) {
  emit('click', e)
}
</script>