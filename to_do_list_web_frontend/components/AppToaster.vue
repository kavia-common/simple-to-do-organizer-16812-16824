<template>
  <div class="fixed bottom-4 right-4 space-y-2 z-50">
    <transition-group name="toast" tag="div">
      <div v-for="t in toasts" :key="t.id" class="card px-4 py-3 flex items-start gap-3 min-w-[240px]"
           :style="{ borderColor: t.type==='error' ? '#fecaca' : '#bfdbfe', background: t.type==='error' ? '#fff1f2' : 'white' }">
        <span v-if="t.type==='error'">⚠️</span>
        <span v-else>✅</span>
        <div class="flex-1">
          <p class="font-semibold">{{ t.title }}</p>
          <p class="text-sm text-gray-600" v-if="t.message">{{ t.message }}</p>
        </div>
        <button class="p-1 rounded hover:bg-gray-100" @click="remove(t.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToaster } from '~/composables/useToaster'
const { toasts, remove } = useToaster()
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all .2s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
