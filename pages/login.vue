<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-200 to-green-50 p-6">
    <div class="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10">
      <LoginForm />
    </div>
  </div>
</template>
<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'

definePageMeta({
  layout: 'auth',
  middleware: ['guess']
});
</script>