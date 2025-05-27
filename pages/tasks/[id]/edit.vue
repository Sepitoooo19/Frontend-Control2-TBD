<template>
  <div class="container max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Editar Tarea</h2>
    <TaskForm :taskId="Number(route.params.id)" @saved="onSaved" />
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import TaskForm from '~/components/tasks/TaskForm.vue'
definePageMeta({ middleware: 'auth-role' })
const route = useRoute()
const router = useRouter()
const onSaved = () => router.push('/tasks')
</script>