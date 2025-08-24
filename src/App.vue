<template>
  <div class="min-h-[600px] min-w-[300px] bg-slate-800 font-sans">
    <template v-if="!loading">
      <div class="bg-slate-900 px-4 py-2 flex items-center justify-start">
        <img src="./../public/logo-transparent.png" alt="Tab Keeper Logo" class="h-8" />
        <h1 class="text-lg font-bold text-center text-white">Tab Keeper</h1>
      </div>
      <div class="p-4 h-full">
        <TabSetList :tabSets="tabSets" @save-set="saveSet" @delete-set="deleteSet" @open-tabs="openTabs"
          @delete-tab="deleteTab" @update-set="updateSet" />
  
        <Modal v-if="modalVisible" title="Confirm Deletion" @confirm="deleteSetConfirm" @cancel="modalVisible = false">
          <p>Do you really want to delete the Tab Set <strong>{{ deletingSet?.name }}</strong>?</p>
        </Modal>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col items-center justify-center h-[600px]">
        <FontAwesomeIcon :icon="faSpinner" class="animate-spin text-white text-3xl" />
      </div>
    </template>
  </div>
</template>

<script setup>
import TabSetList from './components/TabSetList.vue'
import { onMounted, ref } from 'vue'
import { useTabSets } from './composables/useTabSets'
import { useLogger } from './composables/useLogger'
import Modal from './components/Modal.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const { tabSets, loadTabSets, saveTabSet, removeTabSet } = useTabSets()
const { error } = useLogger()
const loading = ref(true)
const modalVisible = ref(false)
const deletingSet = ref(null)

onMounted(async () => {
  loading.value = true
  await loadTabSets()
  setTimeout(() => {
    loading.value = false
  }, 200)
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

function deleteTab(data) {
  const tabUrl = data.tabUrl
  const setId = data.setId

  if (!tabUrl || !setId) {
    error('Invalid data for deleting tab:', data)
    return
  }

  const setToUpdate = tabSets.value.find(set => set.id === setId)

  if (!setToUpdate) {
    error('Set not found for tab deletion:', setId)
    return
  }

  const setHadTab = setToUpdate.tabs.some(tab => tab.url === tabUrl)

  if (!setHadTab) {
    error('Tab not found in set for deletion:', tabUrl)
    return
  }

  setToUpdate.tabs = setToUpdate.tabs.filter(tab => tab.url !== tabUrl)

  if (setToUpdate.tabs.length === 0) {
    removeTabSet(setToUpdate.id)
  } else {
    saveTabSet(setToUpdate)
  }
}

function updateSet(data) {
  const setToUpdateIndex = tabSets.value.findIndex(set => set.id === data.id)
  if (setToUpdateIndex === -1) {
    return
  }
    saveTabSet(data)
}

</script>
