<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50/40 to-gray-50 text-gray-900">
    <NuxtRouteAnnouncer />
    <AppHeader />

    <div class="grid grid-cols-12 gap-0">
      <!-- Sidebar -->
      <aside class="col-span-12 md:col-span-3 lg:col-span-2 bg-white/80 backdrop-blur border-r border-gray-200">
        <SidebarLists />
      </aside>

      <!-- Main content -->
      <main class="col-span-12 md:col-span-9 lg:col-span-10 p-4 md:p-6">
        <NuxtPage />
      </main>
    </div>

    <AppToaster />
  </div>
</template>

<script setup lang="ts">
// Root-level script can be used for global setup if needed
</script>

<style>
/* Global scrollbar styling to match Ocean Professional theme */
* {
  scrollbar-width: thin;
  scrollbar-color: #93c5fd #e5e7eb; /* light blue on gray */
}
*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
*::-webkit-scrollbar-track {
  background: #e5e7eb;
}
*::-webkit-scrollbar-thumb {
  background-color: #93c5fd;
  border-radius: 9999px;
  border: 2px solid #e5e7eb;
}
</style>
