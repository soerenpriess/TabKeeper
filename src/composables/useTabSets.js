import { ref } from 'vue'

const STORAGE_KEY = 'tabKeeperSets'
const tabSets = ref([])

function normalizeTabs(tabs) {
    if (Array.isArray(tabs)) return tabs
    if (tabs && typeof tabs === 'object') return Object.values(tabs)
    return []
}

export function useTabSets() {
    async function loadTabSets() {
        const data = await chrome.storage.local.get(STORAGE_KEY)
        let loaded = data[STORAGE_KEY]
        let setsArray = []

        if (Array.isArray(loaded)) {
            setsArray = loaded
        } else if (loaded && typeof loaded === 'object') {
            setsArray = Object.values(loaded)
        }

        tabSets.value = setsArray.map(set => ({
            ...set,
            tabs: normalizeTabs(set.tabs)
        }))
    }

    async function saveTabSet(set) {
        set.tabs = set.tabs.map(tab => {
            if (typeof tab === 'object' && tab !== null) return tab
            return { url: tab, title: '', favIconUrl: '' }
        })
        set.tabs = normalizeTabs(set.tabs)
        const index = tabSets.value.findIndex(s => s.id === set.id)
        if (index >= 0) {
            tabSets.value[index] = set
        } else {
            tabSets.value.push(set)
        }
        await chrome.storage.local.set({ [STORAGE_KEY]: tabSets.value })
    }


    async function removeTabSet(id) {
        tabSets.value = tabSets.value.filter(s => s.id !== id)
        await chrome.storage.local.set({ [STORAGE_KEY]: tabSets.value })
    }

    return {
        tabSets,
        loadTabSets,
        saveTabSet,
        removeTabSet
    }
}
