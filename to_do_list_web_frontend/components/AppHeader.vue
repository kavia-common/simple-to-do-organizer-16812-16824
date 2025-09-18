<template>
  <header class="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-gray-200">
    <div class="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 11l3 3L22 4l-2-2-8 8-3-3-2 2 3 3z"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8"/>
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-bold tracking-tight">Ocean To‑do</h1>
          <p class="text-xs text-gray-500 -mt-0.5">Modern organizer</p>
        </div>
      </div>

      <div class="hidden md:flex items-center gap-2">
        <button class="btn btn-outline" @click="$emit('newList')">
          <span class="i">＋</span> New List
        </button>
        <a href="https://nuxt.com" target="_blank" rel="noreferrer" class="btn btn-primary">
          Docs
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'newList'): void
}>()
</script>

<style scoped>
.i{font-weight:700}
</style>
