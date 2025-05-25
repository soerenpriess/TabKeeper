<template>
  <div @click="showNewTabSetForm" class="w-full px-4 py-2 mb-4 rounded-lg bg-slate-900 border-slate-600 border-1 text-white text-center hover:scale-105 hover:bg-slate-950 transition-all ease-in-out cursor-pointer">
    Add new TabSet
  </div>
  <ul class="space-y-3 max-h-[400px] overflow-auto">
    <li v-for="set in tabSets" :key="set.id">
      <TabSetItem
        :set="set"
        :expanded="expandedStates[set.id]"
        @toggle-expand="toggleExpand"
        @delete-set="deleteSet"
        @open-tabs="openTabs"
        @delete-tab="deleteTab"
        @update-set="updateSet"
      />
    </li>
  </ul>
  <TabSetForm
    v-if="isNewTabSetModalVisible"
    @close="closeForm"
    @save="saveSet"
  />
</template>

<script setup>
import TabSetItem from './TabSetItem.vue'
import { ref, reactive } from 'vue'
import TabSetForm from './TabSetForm.vue'

const isNewTabSetModalVisible = ref(false)

const props = defineProps({
  tabSets: Array
})

const expandedStates = reactive({})

function toggleExpand(setId) {
  expandedStates[setId] = !expandedStates[setId]
}


function showNewTabSetForm() {
  isNewTabSetModalVisible.value = true
}

function closeForm() {
  isNewTabSetModalVisible.value = false
}

function saveSet(newSet) {
  emit('save-set', newSet)
  isNewTabSetModalVisible.value = false
}

function deleteSet(setId) {
  emit('delete-set', setId)
}

function openTabs(tabs) {
  emit('open-tabs', tabs)
}

function deleteTab(tabUrl) {
  emit('delete-tab', tabUrl)
}

function updateSet(data) {
  console.log('Updating set:', data)
  emit ('update-set', data)
}

const emit = defineEmits(['save-set', 'delete-set', 'open-tabs', 'delete-tab', 'update-set'])
</script>
