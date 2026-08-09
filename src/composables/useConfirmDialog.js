import { ref, shallowRef } from 'vue'

// Module-level singleton — shared across every caller, driving the single
// <SeneuConfirmDialog /> instance an app mounts once near its root.
const visible = ref(false)
const options = ref({})
const isLoading = ref(false)
const _resolve = shallowRef(null)

const DEFAULTS = {
  title: 'Are you sure?',
  message: '',
  variant: 'default',
  icon: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  /** Optional async callback run before resolving true — dialog shows a loading state while it's pending */
  onConfirm: null,
}

/**
 * Promise-based replacement for `window.confirm()`. Mount `<SeneuConfirmDialog />`
 * once near your app root, then call `confirm()` from anywhere.
 *
 * @example
 * const { confirm } = useConfirmDialog()
 * const ok = await confirm({ title: 'Delete post?', variant: 'danger' })
 *
 * Only one dialog is shown at a time — calling `confirm()` again while one
 * is already open replaces it, and the previous promise never settles.
 */
export function useConfirmDialog() {
  function confirm(opts = {}) {
    options.value = { ...DEFAULTS, ...opts }
    visible.value = true
    return new Promise((resolve) => {
      _resolve.value = resolve
    })
  }

  async function handleConfirm() {
    if (options.value.onConfirm) {
      isLoading.value = true
      try {
        await options.value.onConfirm()
      } finally {
        isLoading.value = false
      }
    }
    visible.value = false
    _resolve.value?.(true)
    _resolve.value = null
  }

  function handleCancel() {
    if (isLoading.value) return
    visible.value = false
    _resolve.value?.(false)
    _resolve.value = null
  }

  return { visible, options, isLoading, confirm, handleConfirm, handleCancel }
}
