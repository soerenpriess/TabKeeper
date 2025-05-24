<template>
    <div
      class="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50"
      @click.self="$emit('close')"
    >
      <div
        class="bg-slate-900 text-white rounded border-slate-600 border-1 p-6 m-6 max-w-md w-full shadow-lg animate-fadeIn"
        @click.stop
      >
        <h2 class="text-xl font-semibold mb-4">
          Create a new Tab-Set
        </h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <TextInput
            id="name"
            v-model="name"
            header="Name"
            required
          />
  
          <TabSelector
            :selectedTabs="tabs"
            @update:selectedTabs="tabs = $event"
          />
  
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  import TabSelector from './TabSelector.vue'
  import TextInput from './TextInput.vue'
  
  const emit = defineEmits(['close', 'save'])
  
  const name = ref('')
  const tabs = ref([])
  
  onMounted(() => {
      loadCurrentTabs()
  })
  
  async function loadCurrentTabs() {
    const tabsInWindow = await new Promise(resolve =>
      chrome.tabs.query({ currentWindow: true }, resolve)
    )
    console.log('Tabs in current window:', tabsInWindow)
    tabs.value = tabsInWindow.map(t => ({
      url: t.url,
      title: t.title,
      favIconUrl: t.favIconUrl
    }))
  }
  
  function submitForm() {
    if (!name.value.trim()) {
      alert('Please enter a name for the Tab-Set.')
      return
    }
    emit('save', {
      id: Date.now().toString(),
      name: name.value.trim(),
      tabs: tabs.value
    })
  }
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
  