<template>
  <div class="bg-slate-950 rounded-lg p-2 flex items-center mt-1 relative group">
    <img v-if="tab?.favIconUrl" :src="tab.favIconUrl" class="w-6 h-6" />
    <div v-else class="w-6 h-6"></div>
    <div class="flex flex-col ml-2 min-w-0">
      <p class="text-slate-400 truncate max-w-xs">{{ tab.title }}</p>
      <p class="text-slate-600 text-[9px] truncate max-w-xs" :title="tab.url">{{ tab.url }}</p>
    </div>
    <div class="absolute inset-0 rounded-lg overflow-hidden pointer-events-none group-hover:pointer-events-auto">
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
      </div>
      <div
        class="absolute right-5 top-0 h-full w-1/3 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          class="bg-indigo-500/80 text-white px-2 py-1 rounded hover:scale-110 hover:bg-indigo-500 transition-all ease-in-out cursor-pointer"
          @click="openTab">
          Open
        </button>
        <button
          class="bg-red-500/80 text-white px-2 py-1 rounded hover:scale-110 hover:bg-red-500 transition-all ease-in-out cursor-pointer"
          @click="deleteTab">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tab: String
})

function openTab() {
  const tabUrl = props.tab.url
  window.open(tabUrl, '_blank')
}

function deleteTab() {
  const tabUrl = props.tab.url
  emit('delete-tab', tabUrl)
}

const emit = defineEmits(['delete-tab'])

</script>