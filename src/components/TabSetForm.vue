<template>
  <div class="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')">
    <div
      class="bg-slate-900 text-white rounded border-slate-600 border-1 p-6 w-full h-full overflow-auto shadow-lg animate-fadeIn"
      @click.stop>
      <h2 class="text-xl font-semibold mb-4">
        Create a new Tab-Set
      </h2>
      <form @submit.prevent="submitForm" class="space-y-4">

        <div class="flex flex-col justify-center px-2">
          <label class="text-gray-500 text-md">Icon</label>
          <div class="w-full flex justify-center items-center py-1">
            <div :class="['w-12 h-12 rounded-full flex justify-center items-center', color]">
              <FontAwesomeIcon :icon="icon" class="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full">
          <div ref="colorScroll"
            class="w-full flex flex-row overflow-x-auto flex-nowrap px-2 py-2 border-b border-slate-600"
            @wheel.prevent="onWheelScroll($event, 'colorScroll')">
            <div v-for="(c, index) in colors" :key="index" :class="[
              c,
              'w-6 h-6 rounded-full flex-shrink-0 mr-2 cursor-pointer hover:scale-110 transition-all ease-in-out',
              c === color ? 'ring-2 ring-indigo-500' : ''
            ]" @click="selectColor(c)"></div>
          </div>

          <div ref="iconScroll" class="w-full flex flex-row overflow-x-auto flex-nowrap px-2 py-2"
            @wheel.prevent="onWheelScroll($event, 'iconScroll')">
            <FontAwesomeIcon v-for="(ic, index) in icons" :key="index" :icon="ic" :class="[
              'inline-block text-white bg-slate-600 rounded-full p-2 flex-shrink-0 mr-2 hover:scale-110 hover:bg-slate-500 transition-all ease-in-out cursor-pointer',
              ic === icon ? 'ring-2 ring-indigo-500' : ''
            ]" @click="selectIcon(ic)" />
          </div>
        </div>

        <TextInput id="name" v-model="name" header="Name" required />

        <TabSelector :selectedTabs="tabs" @update:selectedTabs="tabs = $event" />

        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" @click="$emit('close')"
            class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 hover:text-black hover:scale-110 transition cursor-pointer">
            Cancel
          </button>
          <button type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition cursor-pointer hover:scale-110">
            Save
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMusic, faCartShopping, faCode, faBriefcase, faRocket, faHouse, faFireFlameCurved, faGamepad, faHeart, faStar, faFolder, faCube, faOtter, faCubes } from '@fortawesome/free-solid-svg-icons'

const emit = defineEmits(['close', 'save'])

const name = ref('')
const tabs = ref([])
const icon = ref(faCube)
const color = ref('bg-purple-400')

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
    tabs: tabs.value,
    icon: icon.value,
    color: color.value
  })
}

const colors = [
  'bg-red-400',
  'bg-orange-400',
  'bg-amber-400',
  'bg-yellow-400',
  'bg-lime-400',
  'bg-green-400',
  'bg-emerald-400',
  'bg-teal-400',
  'bg-cyan-400',
  'bg-sky-400',
  'bg-blue-400',
  'bg-indigo-400',
  'bg-violet-400',
  'bg-purple-400',
  'bg-fuchsia-400',
  'bg-pink-400',
  'bg-rose-400',
  'bg-slate-400',
  'bg-gray-400',
  'bg-zinc-400',
  'bg-neutral-400',
  'bg-stone-400',
]

const icons = ref([faMusic, faCartShopping, faCode, faBriefcase, faRocket, faHouse, faFireFlameCurved, faGamepad, faHeart, faStar, faFolder, faCube, faOtter, faCubes])

const colorScroll = ref(null)
const iconScroll = ref(null)

function onWheelScroll(event, refName) {
  const container = refName === 'colorScroll' ? colorScroll.value : iconScroll.value
  if (!container) return

  container.scrollLeft += event.deltaY
}
function selectColor(c) {
  color.value = c
}

function selectIcon(ic) {
  icon.value = ic
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