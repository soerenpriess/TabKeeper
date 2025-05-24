<template>
    <div
      class="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50"
      @click.self="$emit('cancel')"
    >
      <div
        class="bg-slate-900 text-white rounded border-slate-600 border-1 p-6 m-6 max-w-md w-full shadow-lg animate-fadeIn"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
        <div class="mb-4">
          <slot />
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 border rounded hover:bg-gray-100 hover:text-black transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 bg-red-500/50 text-white rounded hover:bg-red-500 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String
  })
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease forwards;
  }
  </style>
  