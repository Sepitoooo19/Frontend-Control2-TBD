<template>
  <svg
    :class="[
      'animate-spin',
      small ? 'h-4 w-4' : 'h-6 w-6',
      color || 'text-blue-600'
    ]"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  small: Boolean,
  color: String
})
</script>