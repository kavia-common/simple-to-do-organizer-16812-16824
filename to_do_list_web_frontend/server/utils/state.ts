import { H3Event, readBody } from 'h3'
import { nanoid } from '../../composables/utils/nanoid'

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
  priority: 'Low'|'Medium'|'High'
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'ocean_todo_state'

export async function readState(): Promise<{lists: TodoList[]; tasksByList: Record<string, Task[]>}> {
  const storage = useStorage()
  const data = await storage.getItem(STORAGE_KEY)
  if (data) return data as any
  const now = new Date().toISOString()
  const listA: TodoList = { id: 'inbox', name: 'Inbox', color: '#93c5fd', createdAt: now, updatedAt: now }
  const initial = {
    lists: [listA],
    tasksByList: {
      [listA.id]: []
    }
  }
  await storage.setItem(STORAGE_KEY, initial)
  return initial
}

export async function writeState(state: {lists: TodoList[]; tasksByList: Record<string, Task[]>}) {
  const storage = useStorage()
  await storage.setItem(STORAGE_KEY, state)
}

export function newList(name: string): TodoList {
  const ts = new Date().toISOString()
  return { id: nanoid(12), name, color: '#93c5fd', createdAt: ts, updatedAt: ts }
}

export function newTask(listId: string, title: string): Task {
  const ts = new Date().toISOString()
  return { id: nanoid(12), listId, title, completed: false, dueDate: null, priority: 'Low', createdAt: ts, updatedAt: ts }
}
