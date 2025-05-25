<template>
  <div class="mb-2">
    <label v-if="label" :for="id" class="block mb-1 font-medium text-gray-700">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'w-full rounded border focus:ring focus:ring-blue-200 focus:outline-none',
        error
          ? 'border-red-500 focus:border-red-600'
          : 'border-gray-300 focus:border-blue-500',
        inputClass
      ]"
    />
    <p v-if="hint" class="text-sm text-gray-400">{{ hint }}</p>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: [String, Number],
  label: String,
  id: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  inputClass: String,
  hint: String,
  error: String
})
defineEmits(['update:modelValue'])
</script>