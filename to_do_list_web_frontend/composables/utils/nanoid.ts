const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-'

export function nanoid(size = 21) {
  let id = ''
  const len = alphabet.length
  for (let i = 0; i < size; i++) {
    id += alphabet[Math.floor(Math.random() * len)]
  }
  return id
}
