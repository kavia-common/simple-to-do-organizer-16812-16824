import { ref } from 'vue'
import { useRuntimeConfig } from '#app'
import { nanoid } from './utils/nanoid'
import { useToaster } from './useToaster'

export type TodoList = {
  id: string
  name: string
  color?: string
  createdAt: string
  updatedAt: string
}

export type Task = {
  id: string
  listId: string
  title: string
  completed: boolean
  dueDate: string | null
  priority: 'Low' | 'Medium' | 'High'
  createdAt: string
  updatedAt: string
}

const lists = ref<TodoList[]>([])
const tasksByList = ref<Record<string, Task[]>>({})
const activeListId = ref<string | null>(null)
const loaded = ref(false)

export function useTodoStore() {
  const { public: { apiBase } } = useRuntimeConfig()
  const { toastError } = useToaster()

  async function ensureLoaded() {
    if (loaded.value) return
    try {
      const res = await $fetch<{lists: TodoList[], tasksByList: Record<string, Task[]>}>(`${apiBase}/state`)
      lists.value = res.lists
      tasksByList.value = res.tasksByList
      loaded.value = true
      if (!activeListId.value && lists.value[0]) activeListId.value = lists.value[0].id
    } catch (e:any) {
      toastError('Failed to load data', e?.message || 'Unknown error')
    }
  }

  function setActiveList(id: string) {
    activeListId.value = id
  }

  async function createList(name: string) {
    const body = { name }
    const list = await $fetch<TodoList>(`${apiBase}/lists`, { method: 'POST', body })
    lists.value.push(list)
    tasksByList.value[list.id] = []
    activeListId.value = list.id
  }

  async function renameList(id: string, name: string) {
    const updated = await $fetch<TodoList>(`${apiBase}/lists/${id}`, { method: 'PATCH', body: { name } })
    const idx = lists.value.findIndex(l => l.id === id)
    if (idx !== -1) lists.value[idx] = updated
  }

  async function deleteList(id: string) {
    await $fetch(`${apiBase}/lists/${id}`, { method: 'DELETE' })
    lists.value = lists.value.filter(l => l.id !== id)
    delete tasksByList.value[id]
    if (activeListId.value === id) {
      activeListId.value = lists.value[0]?.id || null
    }
  }

  async function createTask(listId: string, payload: Partial<Task> & { title: string }) {
    const task = await $fetch<Task>(`${apiBase}/lists/${listId}/tasks`, { method: 'POST', body: payload })
    tasksByList.value[listId] = tasksByList.value[listId] || []
    tasksByList.value[listId].unshift(task)
  }

  async function updateTask(listId: string, taskId: string, patch: Partial<Task>) {
    const task = await $fetch<Task>(`${apiBase}/lists/${listId}/tasks/${taskId}`, { method: 'PATCH', body: patch })
    const arr = tasksByList.value[listId] || []
    const idx = arr.findIndex(t => t.id === taskId)
    if (idx !== -1) arr[idx] = task
  }

  async function deleteTask(listId: string, taskId: string) {
    await $fetch(`${apiBase}/lists/${listId}/tasks/${taskId}`, { method: 'DELETE' })
    const arr = tasksByList.value[listId] || []
    tasksByList.value[listId] = arr.filter(t => t.id !== taskId)
  }

  return {
    // state
    lists: lists.value as unknown as typeof lists extends infer T ? T : any,
    tasksByList: tasksByList.value as unknown as typeof tasksByList extends infer T ? T : any,
    activeListId,
    // actions
    ensureLoaded,
    setActiveList,
    createList,
    renameList,
    deleteList,
    createTask,
    updateTask,
    deleteTask,
  }
}
