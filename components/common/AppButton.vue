<template>
  <button :type="type" :class="['btn', btnClass]" :disabled="disabled || loading" @click="$emit('click', $event)">
    <AppSpinner v-if="loading" small />
    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
import AppSpinner from './AppSpinner.vue';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
});

defineEmits(['click']);

const btnClass = computed(() => ({
  [`btn-${props.variant}`]: true,
  [`btn-${props.size}`]: props.size !== 'md',
}));
</script>

<style scoped>
/* .btn ya está en main.css, aquí solo especificidades si son necesarias */
.btn-link {
  font-weight: 400;
  color: #007bff;
  text-decoration: none;
  background-color: transparent;
  border: none;
}
.btn-link:hover {
  color: #0056b3;
  text-decoration: underline;
}
/* Loading spinner integration */
.btn .spinner-border-sm {
  width: 1em;
  height: 1em;
  border-width: .2em;
  vertical-align: -0.125em; /* Alinear mejor con el texto */
}
</style>