<template>
    <div class="flex flex-col">
      <label class="text-gray-500 text-md mb-1">{{ header }}</label>
      <input
        ref="inputRef"
        v-model="localValue"
        type="text"
        class="text-gray-300 bg-slate-950/40 px-2 py-1 rounded focus:outline-none focus:ring-0 focus:bg-slate-950 hover:bg-slate-950/80 text-lg"
        :required="required "
        @keyup.enter="handleSave"
        @blur="handleSave"
        @keyup.esc="handleCancel"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch, nextTick, defineEmits } from 'vue'
  
  const props = defineProps({
    modelValue: String,
    required: {
      type: Boolean,
      default: false
    },
    header: {
      type: String,
      default: 'Name'
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'close'])
  
  const localValue = ref(props.modelValue)
  const inputRef = ref(null)
  
  watch(() => props.modelValue, (newVal) => {
    localValue.value = newVal
  })
  
  function handleSave() {
    emit('update:modelValue', localValue.value)
    emit('close')
  }
  
  function handleCancel() {
    localValue.value = props.modelValue
    emit('close')
  }
  
  nextTick(() => {
    inputRef.value?.focus()
  })
  </script>
  