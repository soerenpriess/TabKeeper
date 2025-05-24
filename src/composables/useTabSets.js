import { ref } from 'vue'

const STORAGE_KEY = 'tabKeeperSets'
const tabSets = ref([])

function normalizeTabs(tabs) {
    if (Array.isArray(tabs)) return tabs // if tabs is already an array, return it
    if (tabs && typeof tabs === 'object') return Object.values(tabs) // if tabs is an object, convert it to an array
    return [] // if tabs is neither, return an empty array
}

export function useTabSets() {
    async function loadTabSets() {
        const data = await chrome.storage.local.get(STORAGE_KEY)
        let loaded = data[STORAGE_KEY]
        let setsArray = []

        if (Array.isArray(loaded)) {
            // when loaded is an array, use it directly
            setsArray = loaded
        } else if (loaded && typeof loaded === 'object') {
            // when loaded is an object, convert it to an array
            setsArray = Object.values(loaded)
        }

        // normalize the tabs in each set
        tabSets.value = setsArray.map(set => ({
            ...set,
            tabs: normalizeTabs(set.tabs)
        }))

        console.log('Loaded tab sets:', tabSets.value)
    }

    async function saveTabSet(set) {
        set.tabs = set.tabs.map(tab => {
            // Falls tab schon ein Objekt ist, gib es zurück
            if (typeof tab === 'object' && tab !== null) return tab
            // Falls tab eine URL ist, mache ein Objekt daraus
            return { url: tab, title: '', favIconUrl: '' }
        })
        set.tabs = normalizeTabs(set.tabs)
        const index = tabSets.value.findIndex(s => s.id === set.id)
        if (index >= 0) {
            tabSets.value[index] = set
        } else {
            tabSets.value.push(set)
        }
        console.log('Saving tab sets:', tabSets.value)
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
