import { ref } from 'vue'

type Toast = {
  id: string
  title: string
  message?: string
  type: 'info'|'error'
}

const toasts = ref<Toast[]>([])

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

// PUBLIC_INTERFACE
export function useToaster() {
  /** Toaster composable to show small notifications. */
  function push(title: string, message?: string, type: 'info'|'error'='info') {
    const id = uid()
    toasts.value.push({ id, title, message, type })
    setTimeout(() => remove(id), 3000)
  }
  function toast(title: string, message?: string) { push(title, message, 'info') }
  function toastError(title: string, message?: string) { push(title, message, 'error') }
  function remove(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }
  return { toasts, toast, toastError, remove }
}
