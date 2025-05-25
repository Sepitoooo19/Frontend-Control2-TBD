<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="inputClass"
    />
    <small v-if="hint">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number | null;
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  inputClass?: string;
  hint?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
});

defineEmits(['update:modelValue']);
</script>