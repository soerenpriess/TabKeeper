<!-- components/TabSetItem.vue -->
<template>
  <div class="bg-slate-900 flex flex-col w-full h-fit rounded-lg border-slate-600 border-1">
    <!-- Header with group hover for overlay and buttons -->
    <div class="flex items-center justify-center w-full h-14">
      <!-- Main content area with group hover -->
      <div class="flex items-center justify-center w-full h-full relative group">
        <!-- Icon/Indicator -->
        <div class="flex items-center justify-center w-1/6 ml-3">
          <div class="w-8 h-8 bg-purple-800 rounded-full flex justify-center items-center">
            <FontAwesomeIcon :icon="faMusic" class="text-white" />
          </div>
        </div>
        <!-- Set info -->
        <div class="w-5/6 flex flex-col">
          <p class="text-lg text-white ml-3">{{ set.name }}</p>
          <p class="text-xs text-gray-500 ml-3">{{ set.tabs.length }} Tab(s)</p>
        </div>
        <!-- Overlay with gradient and buttons -->
        <div class="absolute inset-0 rounded-l-lg overflow-hidden pointer-events-none group-hover:pointer-events-auto">
          <!-- Gradient overlay: transparent left, dark right -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
          </div>
          <!-- Buttons appear on hover, right-aligned -->
          <div
            class="absolute right-5 top-0 h-full w-2/3 flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button @click="openTabs(set.tabs)"
              class="bg-indigo-500/80 text-white px-2 py-1 text-[10px] rounded hover:scale-110 hover:bg-indigo-500 transition-all ease-in-out cursor-pointer">
              Open {{ set.tabs.length }} Tab(s)
            </button>
          </div>
        </div>
      </div>
      <!-- Expand/collapse button (right side) -->
      <div
        class="w-1/6 h-full border-l-1 border-slate-600 flex justify-center items-center cursor-pointer hover:bg-slate-950 rounded-r-lg group transition-all ease-in-out"
        @click="$emit('toggle-expand', set.id)">
        <div class="transition duration-300 group-hover:scale-150">
          <FontAwesomeIcon :icon="faChevronDown" class="text-white" :class="{ 'rotate-180': expanded }" />
        </div>
      </div>
    </div>
    <!-- Expandable content -->
    <div class="overflow-hidden transition-all duration-300 ease-in-out"
      :style="{ maxHeight: expanded ? '500px' : '0', opacity: expanded ? 1 : 0 }">

      <div class="border-t-[1px] border-slate-600 w-full"></div>

      <div class="w-full flex">
        <div class="w-1/4 border-r-1 border-slate-600 flex flex-col justify-center px-2 py-1">
          <label class="text-gray-500 text-md">Icon</label>
          <div class="w-full flex justify-center items-center py-1">
            <div class="w-10 h-10 bg-purple-800 rounded-full flex justify-center items-center">
              <FontAwesomeIcon :icon="faMusic" class="text-white text-lg" />
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full h-full">
          <!-- Farbkreise horizontal scrollbar -->
          <div ref="colorScroll"
            class="w-full h-1/2 flex flex-row overflow-x-auto flex-nowrap px-2 py-2 border-b border-slate-600 pr-6"
            @wheel.prevent="onWheelScroll($event, 'colorScroll')">
            <div v-for="(color, index) in colors" :key="index" :class="[
              color,
              'w-6 h-6 rounded-full flex-shrink-0 mr-2 cursor-pointer hover:scale-110 transition-all ease-in-out'
            ]"></div>
          </div>

          <!-- Icons horizontal scrollbar -->
          <div ref="iconScroll" class="w-full h-1/2 flex flex-row overflow-x-auto flex-nowrap px-2 py-2 pr-14"
            @wheel.prevent="onWheelScroll($event, 'iconScroll')">
            <FontAwesomeIcon v-for="(icon, index) in icons" :key="index" :icon="icon"
              class="inline-block text-white bg-slate-600 rounded-full p-2 flex-shrink-0 mr-2 hover:scale-110 hover:bg-slate-500 transition-all ease-in-out cursor-pointer" />
          </div>
        </div>
      </div>

      <div class="border-t-[1px] border-slate-600 w-full mb-1"></div>

      <div class="flex flex-col px-2 py-1">
        <div class="flex flex-col">
          <NameInput v-model="set.name" />
        </div>
      </div>
      <div class="border-t-[1px] border-slate-600 w-full my-1"></div>
      <div class="w-full my-3 flex justify-center items-center">
        <p @click="deleteSet(set.id)"
          class="w-5/6 text-center rounded-lg bg-red-500/60 px-4 py-1 text-gray-300 hover:scale-105 hover:bg-red-500/90 hover:text-white transition-all ease-in-out cursor-pointer">
          Delete TabSet</p>
      </div>
      <div class="border-t-[1px] border-slate-600 w-full my-1"></div>
      <div class="flex flex-col px-2 py-1">
        <div class="flex flex-col">
          <p class="text-gray-500 text-md mb-2">Tab(s)</p>
          <!-- Tab list with custom scrollbar -->
          <div class="max-h-52 overflow-auto scrollbar">
            <TabItem v-for="tab in set.tabs" :key="tab.name" :tab="tab" @delete-tab="deleteTab" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faMusic, faCartShopping, faCode, faBriefcase, faRocket, faHouse, faFireFlameCurved, faGamepad, faHeart, faStar, faFolder, faCube, faOtter, faCubes } from '@fortawesome/free-solid-svg-icons'
import TabItem from './TabItem.vue'
import NameInput from './TextInput.vue'
import { watch, nextTick, ref } from 'vue'

const props = defineProps({
  set: Object,
  expanded: Boolean
})


let emitReady = false
nextTick(() => { emitReady = true })

watch(
  () => props.set.name,
  (newName, oldName) => {
    if (!emitReady) return
    if (newName && newName !== undefined && newName !== null && props.set.id) {
      const data = {
        id: props.set.id,
        name: newName
      }
      emit('update-set-name', data)
    }
  },
  { deep: true, immediate: true }
)

function deleteSet(setId) {
  emit('delete-set', setId)
}

function openTabs(tabs) {
  emit('open-tabs', tabs)
}

function deleteTab(tabTitle) {
  // Emit an event to delete the tab (you can handle this in the parent component)
  emit('delete-tab', tabTitle)
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

  // Scroll horizontal by vertical wheel delta
  container.scrollLeft += event.deltaY
}

const emit = defineEmits(['toggle-expand', 'delete-set', 'open-tabs', 'delete-tab', 'update-set-name'])
</script>