import { reactive, ref } from 'vue'

// Module-level singleton — shared across every caller, driving the single
// <SeneuToast /> instance an app mounts once near its root.
const toasts = ref([])
let _nextId = 1

function _startTimer(toast) {
  if (toast.remaining <= 0) return
  toast._startedAt = Date.now()
  toast._timeoutId = setTimeout(() => _remove(toast.id), toast.remaining)
}

function _add({ variant = 'info', title = '', message = '', duration = 4000, dismissible = true }) {
  const id = _nextId++
  const toast = reactive({
    id, variant, title, message, duration, dismissible,
    remaining: duration,
    _startedAt: 0,
    _timeoutId: null,
  })
  toasts.value.push(toast)
  _startTimer(toast)
  return id
}

function _remove(id) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx === -1) return
  clearTimeout(toasts.value[idx]._timeoutId)
  toasts.value.splice(idx, 1)
}

/** Pauses a toast's auto-dismiss countdown — call on hover/focus. */
function _pause(id) {
  const toast = toasts.value.find(t => t.id === id)
  if (!toast || !toast._timeoutId) return
  clearTimeout(toast._timeoutId)
  toast._timeoutId = null
  toast.remaining -= Date.now() - toast._startedAt
}

/** Resumes a toast's auto-dismiss countdown from where it left off. */
function _resume(id) {
  const toast = toasts.value.find(t => t.id === id)
  if (!toast) return
  if (toast.remaining <= 0) { _remove(id); return }
  _startTimer(toast)
}

/**
 * Imperative toast notifications. Mount `<SeneuToast />` once near your
 * app root, then call these from anywhere.
 *
 * @example
 * const toast = useToast()
 * toast.success('Post published')
 * toast.error('Something went wrong', { title: 'Upload failed', duration: 0 })
 */
export function useToast() {
  return {
    toasts,
    success: (message, options = {}) => _add({ variant: 'success', message, ...options }),
    error: (message, options = {}) => _add({ variant: 'danger', message, ...options }),
    warning: (message, options = {}) => _add({ variant: 'warning', message, ...options }),
    info: (message, options = {}) => _add({ variant: 'info', message, ...options }),
    show: (options = {}) => _add(options),
    dismiss: (id) => _remove(id),
    pause: (id) => _pause(id),
    resume: (id) => _resume(id),
  }
}
