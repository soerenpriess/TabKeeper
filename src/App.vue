<template>
  <div v-if="!loading" class="min-h-[600px] min-w-[300px] bg-slate-800 font-sans">
    <div class="bg-slate-900 px-4 py-3">
       <h1 class="text-xl font-bold mb-2 text-center text-white">Tab Keeper</h1>
       <div class="w-full h-8 bg-slate-700 border-slate-600 border-1 rounded-lg flex justify-evenly items-center relative ">
         <!-- Hintergrund für den aktiven Tab -->
         <div
           class="absolute bg-slate-900 rounded-md h-[calc(100%-0.2rem)] transition-all duration-300 ease-in-out border-slate-600 border-1"
           :style="{
             width: `calc(50% - 0.20rem)`,
             left: activeTab === 'home' ? '0.25rem' : 'calc(50%)'
           }"
         ></div>
         <!-- Tabs -->
         <div
           v-for="tab in tabs"
           :key="tab.id"
           @click="activeTab = tab.id"
           class="w-full h-full flex justify-center items-center relative z-10 cursor-pointer"
         >
           <p class="text-white">{{ tab.label }}</p>
         </div>
       </div>
     </div>
     <div class="p-4">
      <TabSetList
      :tabSets="tabSets"
      @save-set="saveSet"
      @delete-set="deleteSet"
      @open-tabs="openTabs"
      @delete-tab="deleteTab"
      @update-set-name="updateSetName"
    />

    <Modal
      v-if="modalVisible"
      title="Confirm Deletion"
      @confirm="deleteSetConfirm"
      @cancel="modalVisible = false"
    >
      <p>Do you really want to delete the Tab Set <strong>{{ deletingSet?.name }}</strong>?</p>
    </Modal>
     </div>
  </div>
</template>

<script setup>
import TabSetList from './components/TabSetList.vue'
import { onMounted, ref } from 'vue'
import { useTabSets } from './composables/useTabSets'
import Modal from './components/Modal.vue'

const { tabSets, loadTabSets, saveTabSet, removeTabSet } = useTabSets()
const loading = ref(true)
const modalVisible = ref(false)
const deletingSet = ref(null)

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'settings', label: 'Settings' }
]
const activeTab = ref('home')

onMounted(async () => {
  loading.value = true
  await loadTabSets()
  loading.value = false
})

function saveSet(set) {
  saveTabSet(set)
}

function deleteSet(setId) {
  const setToDelete = tabSets.value.find(set => set.id === setId)
  if (setToDelete) {
    modalVisible.value = true
    deletingSet.value = setToDelete
  }
}

function openTabs(tabs) {
  tabs.forEach(tab => {
    chrome.tabs.create({ url: tab.url })
  })
}

function deleteSetConfirm() {
  removeTabSet(deletingSet.value.id)
  modalVisible.value = false
  deletingSet.value = null
}

function deleteTab(tabTitle) {
  console.log('Deleting tab:', tabTitle)
  const setToUpdate = tabSets.value.find(set => set.tabs.some(tab => tab.title === tabTitle))
  console.log('Set to update:', setToUpdate)
  if (setToUpdate) {
    setToUpdate.tabs = setToUpdate.tabs.filter(tab => tab.title !== tabTitle)
    console.log('Updated set:', setToUpdate)
    if (setToUpdate.tabs.length === 0) {
      removeTabSet(setToUpdate.id)
    } else {
      saveTabSet(setToUpdate)
    }
  }
}

function updateSetName(data) {
  console.log('Updating set name:', data)
  const setToUpdate = tabSets.value.find(set => set.id === data.id)
  console.log('Set to update:', setToUpdate)
  if (setToUpdate) {
    setToUpdate.name = data.name
    saveTabSet(setToUpdate)
  }
}

</script>
