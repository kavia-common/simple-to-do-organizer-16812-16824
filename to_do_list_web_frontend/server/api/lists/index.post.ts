import { readBody } from 'h3'
import { newList, readState, writeState } from '../../utils/state'

export default defineEventHandler(async (event) => {
  const body = await readBody<{name:string}>(event)
  if (!body?.name) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  }
  const state = await readState()
  const list = newList(body.name)
  state.lists.push(list)
  state.tasksByList[list.id] = []
  await writeState(state)
  return list
})
