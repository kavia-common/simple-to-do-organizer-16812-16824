import { readBody } from 'h3'
import { readState, writeState } from '../../utils/state'

export default defineEventHandler( async (event) => {
  const id = event.context.params?.id as string
  const body = await readBody<{name?:string}> (event)
  const state = await readState()
  const idx = state.lists.findIndex(l => l.id === id)
  if (idx === -1) throw createError({ statusCode: 404, statusMessage: 'List not found' })
  const list = state.lists[idx]
  const updated = { ...list, ...('name' in body ? { name: body.name } : {}), updatedAt: new Date().toISOString() }
  state.lists[idx] = updated
  await writeState(state)
  return updated
})
