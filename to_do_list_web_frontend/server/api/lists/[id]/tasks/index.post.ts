import { readBody } from 'h3'
import { newTask, readState, writeState } from '../../../../utils/state'

export default defineEventHandler(async (event) => {
  const listId = event.context.params?.id as string
  const body = await readBody<{title:string, priority?: 'Low'|'Medium'|'High', dueDate?: string | null}> (event)
  if (!body?.title) throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  const state = await readState()
  const exists = state.lists.some(l => l.id === listId)
  if (!exists) throw createError({ statusCode: 404, statusMessage: 'List not found' })
  const task = newTask(listId, body.title)
  if (body.priority) task.priority = body.priority
  if (typeof body.dueDate !== 'undefined') task.dueDate = body.dueDate
  state.tasksByList[listId] = state.tasksByList[listId] || []
  state.tasksByList[listId].unshift(task)
  await writeState(state)
  return task
})
