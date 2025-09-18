import { readBody } from 'h3'
import { readState, writeState } from '../../../../utils/state'

export default defineEventHandler(async (event) => {
  const listId = event.context.params?.id as string
  const taskId = event.context.params?.taskId as string
  const body = await readBody(event)
  const state = await readState()
  const tasks = state.tasksByList[listId] || []
  const idx = tasks.findIndex(t => t.id === taskId)
  if (idx === -1) throw createError({ statusCode: 404, statusMessage: 'Task not found' })
  const prev = tasks[idx]
  const now = new Date().toISOString()
  const next = {
    ...prev,
    ...(body.title !== undefined ? { title: body.title } : {}),
    ...(body.completed !== undefined ? { completed: !!body.completed } : {}),
    ...(body.dueDate !== undefined ? { dueDate: body.dueDate } : {}),
    ...(body.priority !== undefined ? { priority: body.priority } : {}),
    updatedAt: now,
  }
  tasks[idx] = next
  await writeState(state)
  return next
})
