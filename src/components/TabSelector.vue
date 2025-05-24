<template>
  <div class="relative">
    <h3 class="mb-3 text-gray-500">Select Tabs</h3>
    <div class="mb-4 flex items-center space-x-3">
      <input type="checkbox" id="selectAll" :checked="allSelected" @change="toggleSelectAll"
        class="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-400 focus:ring-2 cursor-pointer" />
      <label for="selectAll" class="select-none cursor-pointer text-gray-500">
        Select All
      </label>
    </div>

    <transition name="expand">
      <ul v-show="true"
        :class="['overflow-auto border border-slate-700 rounded-lg p-3 space-y-2 bg-slate-900 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800', expanded ? 'expanded-list' : 'collapsed-list']"
        ref="listRef">
        <button type="button" @click="toggleExpanded"
          class="absolute top-1 right-1 px-3 py-1 text-xs pointer-cursor rounded border border-slate-600 text-slate-400 hover:bg-slate-700 bg-slate-950 transition z-20">
          {{ expanded ? 'Collapse' : 'Expand' }}
        </button>

        <li v-for="tab in currentTabs" :key="tab.id"
          class="flex items-center space-x-3 rounded-md px-3 py-2 hover:bg-slate-800 cursor-pointer select-none mt-2 pointer-cursor">
          <input type="checkbox" :id="tab.id" :checked="isSelected(tab)" @change="toggleTab(tab)"
            class="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-400 focus:ring-2 cursor-pointer" />
          <label :for="tab.id" class="flex items-center truncate text-slate-300">
            <img :src="tab.favIconUrl || ''" alt="favicon" class="w-5 h-5 mr-3 flex-shrink-0 rounded-sm"
              loading="lazy" />
            <span class="truncate">{{ tab.title || tab.url }}</span>
          </label>
        </li>
      </ul>
    </transition>
  </div>

</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps({
  selectedTabs: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:selectedTabs'])

const currentTabs = ref([])
const selectedTabs = ref([...props.selectedTabs])
const expanded = ref(false)
const listRef = ref(null)

onMounted(async () => {
  const tabsInWindow = await new Promise(resolve =>
    chrome.tabs.query({ currentWindow: true }, resolve)
  )
  currentTabs.value = tabsInWindow
  selectedTabs.value = [...props.selectedTabs]
})

watch(
  () => props.selectedTabs,
  (newVal) => {
    selectedTabs.value = newVal.map(t => (typeof t === 'string' ? { url: t } : t))
  }
)

function isSelected(tab) {
  return selectedTabs.value.some(t => t.url === tab.url)
}

function toggleTab(tab) {
  const tabObj = { url: tab.url, title: tab.title, favIconUrl: tab.favIconUrl }
  if (isSelected(tab)) {
    selectedTabs.value = selectedTabs.value.filter(t => t.url !== tab.url)
  } else {
    selectedTabs.value.push(tabObj)
  }
  emit('update:selectedTabs', selectedTabs.value)
}

function toggleSelectAll(event) {
  if (event.target.checked) {
    selectedTabs.value = currentTabs.value.map(t => ({
      url: t.url,
      title: t.title,
      favIconUrl: t.favIconUrl
    }))
  } else {
    selectedTabs.value = []
  }
  emit('update:selectedTabs', selectedTabs.value)
}

const allSelected = computed(() => {
  return currentTabs.value.length > 0 && selectedTabs.value.length === currentTabs.value.length
})

function toggleExpanded() {
  expanded.value = !expanded.value
}

</script>

<style scoped>
.collapsed-list {
  max-height: 180px;
  transition: max-height 0.3s ease;
  position: relative;
  z-index: 10;
}

.expanded-list {
  max-height: 80vh;
  transition: max-height 0.3s ease;
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  z-index: 1000;
  background-color: #0f172a;
  overflow-y: auto;
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
}
</style>