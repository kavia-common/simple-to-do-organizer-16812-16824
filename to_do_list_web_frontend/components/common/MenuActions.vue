<template>
  <div class="relative" @keydown.esc="open = false">
    <button class="p-1.5 rounded-md hover:bg-gray-100" @click="open = !open" aria-haspopup="menu" :aria-expanded="open">
      ⋯
    </button>
    <div
      v-if="open"
      class="absolute right-0 mt-2 w-36 card py-1 z-50"
      role="menu"
    >
      <button class="w-full text-left px-3 py-2 hover:bg-gray-50" role="menuitem" @click="emit('rename'); open=false">
        Rename
      </button>
      <button class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50" role="menuitem" @click="emit('remove'); open=false">
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{(e:'rename'):void;(e:'remove'):void;}>()
const open = ref(false)

function onDoc(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest) return
  if (!target.closest('[aria-haspopup="menu"]') && !target.closest('.card')) {
    open.value = false
  }
}
onMounted(() => document.addEventListener('click', onDoc))
onBeforeUnmount(() => document.removeEventListener('click', onDoc))
</script>
