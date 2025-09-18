import { H3Event } from 'h3'

type TodoList = {
  id: string
  name: string
  color?: string
  createdAt: string
  updatedAt: string
}
type Task = {
  id: string
  listId: string
  title: string
  completed: boolean
  dueDate: string | null
  priority: 'Low'|'Medium'|'High'
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'ocean_todo_state'

async function readState(event: H3Event): Promise<{lists: TodoList[]; tasksByList: Record<string, Task[]>}> {
  const storage = useStorage()
  const data = await storage.getItem(STORAGE_KEY)
  if (data) return data as any
  // Seed with sample data
  const now = new Date().toISOString()
  const listA: TodoList = { id: 'inbox', name: 'Inbox', color: '#93c5fd', createdAt: now, updatedAt: now }
  const initial = {
    lists: [listA],
    tasksByList: {
      [listA.id]: [
        { id: 't1', listId: listA.id, title: 'Welcome to Ocean To‑do', completed: false, dueDate: null, priority: 'Low', createdAt: now, updatedAt: now },
        { id: 't2', listId: listA.id, title: 'Create your first list →', completed: false, dueDate: null, priority: 'Medium', createdAt: now, updatedAt: now },
      ] as Task[]
    }
  }
  await storage.setItem(STORAGE_KEY, initial)
  return initial
}

export default defineEventHandler(async (event) => {
  return await readState(event)
})
