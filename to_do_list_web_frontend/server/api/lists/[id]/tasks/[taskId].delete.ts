import { readState, writeState } from '../../../../utils/state'

export default defineEventHandler(async (event) => {
  const listId = event.context.params?.id as string
  const taskId = event.context.params?.taskId as string
  const state = await readState()
  const tasks = state.tasksByList[listId] || []
  const exists = tasks.some(t => t.id === taskId)
  if (!exists) throw createError({ statusCode: 404, statusMessage: 'Task not found' })
  state.tasksByList[listId] = tasks.filter(t => t.id !== taskId)
  await writeState(state)
  return { ok: true }
})
