<template>
  <div :class="['spinner-border', { 'spinner-border-sm': small }]" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  small: Boolean,
});
</script>

<style scoped>
.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: .25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: .2em;
}
@keyframes spinner-border {
  to { transform: rotate(360deg); }
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>