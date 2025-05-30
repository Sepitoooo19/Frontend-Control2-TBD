<template>
  <div>
    <TaskList :tasks="tasks" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TaskList from '~/components/tasks/TaskList.vue'
import TaskFilters from '~/components/tasks/TaskFilters.vue'
import TaskNotifications from '~/components/tasks/TaskNotifications.vue'
import { getTasks, filterTasks, deleteTask } from '~/services/taskService'
import type { Task } from '~/types/types'

definePageMeta({
  layout: 'user',
  middleware: 'auth-role'
})

const router = useRouter()
const tasks = ref<Task[]>([])
const filter = ref({ status: '', word: '' })

const loadTasks = async () => {
  if (filter.value.status || filter.value.word) {
    tasks.value = await filterTasks(filter.value)
  } else {
    tasks.value = await getTasks()
  }
}

onMounted(loadTasks)

const onEdit = (task: Task) => router.push(`/tasks/${task.id}/edit`)
const onDelete = async (id: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
    await deleteTask(id)
    await loadTasks()
  }
}
</script>