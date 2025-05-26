<template>
  <div class="container max-w-xl mx-auto">
    <UserProfile />
  </div>
</template>
<script setup lang="ts">
import UserProfile from '~/components/users/UserProfile.vue'
definePageMeta({ middleware: 'auth-role' })
</script>