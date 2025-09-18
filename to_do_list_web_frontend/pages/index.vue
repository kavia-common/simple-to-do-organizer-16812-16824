<template>
  <div class="max-w-screen-2xl mx-auto">
    <div class="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div>
        <h2 class="text-xl md:text-2xl font-bold tracking-tight">{{ currentList?.name || 'Select a list' }}</h2>
        <p class="text-gray-500 text-sm">Manage tasks in a clean, focused workspace.</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-outline" :disabled="!currentList" @click="renameList">Rename List</button>
        <button class="btn btn-secondary" :disabled="!currentList" @click="newTask">Add Task</button>
      </div>
    </div>

    <div v-if="!currentList" class="card p-8 text-center text-gray-600">
      Create or select a list from the left to get started.
    </div>

    <div v-else class="grid grid-cols-12 gap-4">
      <!-- Task input quick add -->
      <div class="col-span-12">
        <div class="card p-3 flex items-center gap-2">
          <input v-model="quickTitle" class="input flex-1" placeholder="Quick add a task and press Enter" @keydown.enter="quickAdd" />
          <button class="btn btn-primary" @click="quickAdd">Add</button>
        </div>
      </div>

      <!-- Tasks -->
      <div class="col-span-12">
        <div class="card">
          <div class="p-4 border-b border-gray-100 flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2">
              <button class="btn btn-outline" :class="{ 'bg-blue-50': filter==='all' }" @click="filter='all'">All</button>
              <button class="btn btn-outline" :class="{ 'bg-blue-50': filter==='active' }" @click="filter='active'">Active</button>
              <button class="btn btn-outline" :class="{ 'bg-blue-50': filter==='done' }" @click="filter='done'">Done</button>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="search" class="input" placeholder="Search tasks..." />
            </div>
          </div>

          <ul class="divide-y divide-gray-100">
            <li v-for="t in visibleTasks" :key="t.id" class="p-3 md:p-4 hover:bg-gray-50/40 transition">
              <div class="flex items-start gap-3">
                <input type="checkbox" class="mt-1" :checked="t.completed" @change="toggleDone(t)" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <input
                      class="input w-full"
                      :class="t.completed ? 'line-through text-gray-500' : ''"
                      :value="t.title"
                      @change="e => updateTitle(t, (e.target as HTMLInputElement).value)"
                    />
                    <span class="tag" :style="{ background: priorityBg(t.priority), color: priorityColor(t.priority), borderColor: priorityBorder(t.priority) }">
                      {{ t.priority }}
                    </span>
                  </div>
                  <div class="mt-2 flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                    <label class="flex items-center gap-2">
                      Due:
                      <input type="date" class="input py-1" :value="t.dueDate ?? ''" @change="e => updateDue(t, (e.target as HTMLInputElement).value)" />
                    </label>
                    <span v-if="t.updatedAt" class="text-xs">Updated {{ formatRelative(t.updatedAt) }}</span>
                  </div>
                </div>
                <MenuActions @rename="renameTask(t)" @remove="removeTask(t.id)" />
              </div>
            </li>
          </ul>

          <div v-if="visibleTasks.length === 0" class="p-8 text-center text-gray-500">
            No tasks matched your filters.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuActions from '~/components/common/MenuActions.vue'
import { useTodoStore } from '~/composables/useTodoStore'
import { computed, onMounted, ref, watch } from 'vue'
import { useToaster } from '~/composables/useToaster'

const store = useTodoStore()
const { toast } = useToaster()

const quickTitle = ref('')
const search = ref('')
const filter = ref<'all'|'active'|'done'>('all')

onMounted(async () => {
  await store.ensureLoaded()
  if (!store.activeListId && store.lists[0]) {
    store.setActiveList(store.lists[0].id)
  }
})

const currentList = computed(() => store.lists.find(l => l.id === store.activeListId) || null)
const allTasks = computed(() => store.tasksByList[store.activeListId || ''] || [])

const visibleTasks = computed(() => {
  const term = search.value.trim().toLowerCase()
  return allTasks.value.filter(t => {
    if (filter.value === 'active' && t.completed) return false
    if (filter.value === 'done' && !t.completed) return false
    if (term && !t.title.toLowerCase().includes(term)) return false
    return true
  })
})

async function quickAdd() {
  if (!currentList.value || !quickTitle.value.trim()) return
  const title = quickTitle.value.trim()
  quickTitle.value = ''
  await store.createTask(currentList.value.id, { title })
  toast('Task added', `“${title}” created`)
}

async function newTask() {
  if (!currentList.value) return
  const title = window.prompt('Task title')
  if (!title) return
  await store.createTask(currentList.value.id, { title })
  toast('Task added', `“${title}” created`)
}

async function renameList() {
  if (!currentList.value) return
  const name = window.prompt('Rename list', currentList.value.name)
  if (!name) return
  await store.renameList(currentList.value.id, name)
  toast('List renamed')
}

async function renameTask(t: any) {
  const title = window.prompt('Rename task', t.title)
  if (!title) return
  await store.updateTask(t.listId, t.id, { title })
}

async function removeTask(id: string) {
  if (!currentList.value) return
  if (!confirm('Delete this task?')) return
  await store.deleteTask(currentList.value.id, id)
}

async function toggleDone(t: any) {
  await store.updateTask(t.listId, t.id, { completed: !t.completed })
}

async function updateTitle(t: any, value: string) {
  const title = value.trim()
  if (!title) return
  await store.updateTask(t.listId, t.id, { title })
}

async function updateDue(t: any, value: string) {
  await store.updateTask(t.listId, t.id, { dueDate: value || null })
}

function priorityBg(p: string) {
  if (p === 'High') return '#fee2e2'
  if (p === 'Medium') return '#fef3c7'
  return '#e0f2fe'
}
function priorityColor(p: string) {
  if (p === 'High') return '#991b1b'
  if (p === 'Medium') return '#92400e'
  return '#075985'
}
function priorityBorder(p: string) {
  if (p === 'High') return '#fecaca'
  if (p === 'Medium') return '#fde68a'
  return '#bae6fd'
}

function formatRelative(iso: string) {
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return d.toLocaleDateString()
}

watch(() => store.activeListId, () => {
  search.value = ''
  filter.value = 'all'
})
</script>
