<template>
  <div>
    <h3 class="font-medium mb-2 text-gray-500">Select Tabs</h3>
    <div class="mb-3 flex items-center space-x-2">
      <input
        type="checkbox"
        id="selectAll"
        :checked="allSelected"
        @change="toggleSelectAll"
      />
      <label for="selectAll" class="select-none cursor-pointer text-gray-500">Select All</label>
    </div>
    <ul class="max-h-48 overflow-auto border border-slate-600 rounded p-2 space-y-1">
      <li v-for="tab in currentTabs" :key="tab.id" class="flex items-center space-x-2">
        <input
          type="checkbox"
          :id="tab.id"
          :checked="isSelected(tab)"
          @change="toggleTab(tab)"
        />
        <label :for="tab.id" class="truncate cursor-pointer flex items-center">
          <img :src="tab.favIconUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSIVBzuIOGSoThZERRy1CkWoEGqFVh1MLv2CJg1JioujYF2w8Wgx2HVwcdXNwJcXQBRU3DTr4hVX/glhFjwWOP7Hu3Hu3uA4VGhWtW1DgB6t4hJmZqOr4uhVwQRhABeYwzPLmYekWXw3i6B/v4hH8i/te9qVQKZJzDgM0wXjTDybvHvZ8zLmUJAT0SfNcxhZfE4y5dT7zu8VhnrTkT4kniK5WzTBzxFLa5aTyxmOjXiaOiznHXZzVjY14i/uKx1TvK85xqGUsZJQyKeJQ5lCIiUyKhQzKqRTiKRTy5k//o1wvso5J3aVZQzjfYARo5DlL3B/9e3t6Z/eZSAzwg4y20jJNx4CjQK1XyNt9HAOeB9zP6pjzQp0t4H2zXqYXwC6D7DFlctvA5tfo2cB3b9sKjT3g/o2dKk6P5KLAUGMG2KJQnwE9m8j9G3u4BZ3eKvV6y3ACwcASNm1d/fADdfA/Qm+va13j9AHI06VZgdAOZGc1RZ4CDQ2Cvjvne3d7e+z7t+fMv5/we1iJKB5y3c7QAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+cKBA8KJ+0Q4YwAAABsSURBVDhP7dKxDcAgDERRB0mXyBpZgxUyQ4ZgAtaIUqWKFClS9J9z9yQKXUJ8VY7lq3O4E9gBbP8l7gZ2AFvWxJ3ADmD7L3E3sAPY/kvcDewAtv8SdwM7gO2/xN3ADmD7L3E3sAM4/QF3AjuA7b/E3cAOYPsP8QKvZQnQ5iXQNgAAAABJRU5ErkJggg=='"
               class="w-4 h-4 mr-2"
               alt="favicon"/>
          {{ tab.title || tab.url }}
        </label>
      </li>
    </ul>
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
    selectedTabs.value = newVal.map(t => typeof t === 'string' ? { url: t } : t)
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
  console.log('Selected Tabs:', selectedTabs.value)
  emit('update:selectedTabs', selectedTabs.value)
}

const allSelected = computed(() => {
  return currentTabs.value.length > 0 && selectedTabs.value.length === currentTabs.value.length
})
</script>
