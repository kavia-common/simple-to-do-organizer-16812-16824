import { readState, writeState } from '../../utils/state'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  const state = await readState()
  const exists = state.lists.some(l => l.id === id)
  if (!exists) throw createError({ statusCode: 404, statusMessage: 'List not found' })
  state.lists = state.lists.filter(l => l.id !== id)
  delete state.tasksByList[id]
  await writeState(state)
  return { ok: true }
})
