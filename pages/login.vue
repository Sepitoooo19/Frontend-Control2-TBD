<template>
  <div>
    <LoginForm />
  </div>
</template>
<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'

definePageMeta({
  layout: 'auth',
  middleware: ['guess']
});
</script>