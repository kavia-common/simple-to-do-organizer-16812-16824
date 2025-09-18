<template>
  <div class="h-full flex flex-col">
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <input
          v-model="search"
          type="text"
          placeholder="Search lists..."
          class="input w-full"
        />
        <button class="btn btn-primary" @click="createList">
          +
        </button>
      </div>
    </div>

    <nav class="flex-1 overflow-auto p-2">
      <ul class="space-y-1">
        <li v-for="l in filtered" :key="l.id">
          <button
            class="w-full text-left flex items-center justify-between gap-2 p-3 rounded-lg transition
                   hover:bg-blue-50/70"
            :class="activeListId === l.id ? 'bg-blue-50 border border-blue-200' : ''"
            @click="select(l.id)"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="h-2.5 w-2.5 rounded-full"
                :style="{ background: l.color || '#93c5fd' }"></span>
              <span class="truncate font-medium">{{ l.name }}</span>
            </div>
            <div class="flex items-center gap-1 opacity-70">
              <span class="tag">{{ tasksCount(l.id) }}</span>
              <MenuActions
                @rename="renameList(l)"
                @remove="removeList(l.id)"
              />
            </div>
          </button>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-gray-200">
      <button class="btn btn-outline w-full" @click="createList">
        New List
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '~/composables/useTodoStore'
import MenuActions from '~/components/common/MenuActions.vue'
import { ref, computed } from 'vue'

const store = useTodoStore()
const search = ref('')

const filtered = computed(() => {
  if (!search.value) return store.lists
  return store.lists.filter((l) =>
    l.name.toLowerCase().includes(search.value.toLowerCase())
  )
});

const activeListId = computed(() => store.activeListId)

function select(id: string) {
  store.setActiveList(id)
}

async function createList() {
  const name = window.prompt('List name')
  if (!name) return
  await store.createList(name)
}

async function renameList(l: {id: string, name: string}) {
  const name = window.prompt('Rename list', l.name)
  if (!name) return
  await store.renameList(l.id, name)
}

async function removeList(id: string) {
  if (!confirm('Delete this list? This action cannot be undone.')) return
  await store.deleteList(id)
}

function tasksCount(listId: string) {
  return store.tasksByList[listId]?.length ?? 0
}
</script>
