import { ref, shallowRef } from 'vue'

// Module-level singleton — shared across every caller, driving the single
// <SeneuConfirmDialog /> instance an app mounts once near its root.
const visible = ref(false)
const options = ref({})
const isLoading = ref(false)
const loadingAction = ref(null)
const _resolve = shallowRef(null)

const DEFAULTS = {
  /** 'small' | 'medium' | 'large' — also caps which buttons can render (see SeneuConfirmDialog) */
  size: 'medium',
  title: 'Are you sure?',
  message: '',
  variant: 'default',
  icon: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  /** Secondary CTA — opt-in: only rendered when set (and size is 'medium' or 'large'; ignored on 'small') */
  discardLabel: '',
  /** Generic 4th action, visually separated from the confirm/discard/cancel group — opt-in: only rendered when set (and size is 'large'; ignored otherwise) */
  additionalLabel: '',
  /** Optional async callbacks — the dialog shows a loading state on the clicked button while pending */
  onConfirm: null,
  onDiscard: null,
  onAdditional: null,
}

/**
 * Promise-based replacement for `window.confirm()`, generalized into a
 * multi-action dialog. Mount `<SeneuConfirmDialog />` once near your app
 * root, then call `confirm()` from anywhere.
 *
 * Resolves with which action closed the dialog: 'confirm' | 'discard' |
 * 'cancel' | 'additional' — cancel also covers backdrop click, Escape, and
 * the close button.
 *
 * @example
 * const { confirm } = useConfirmDialog()
 * const action = await confirm({ title: 'Delete post?', variant: 'danger' })
 * if (action === 'confirm') { ... }
 *
 * @example
 * // large: full 4-button set
 * const action = await confirm({
 *   size: 'large',
 *   title: 'Unsaved changes',
 *   message: 'Save your edits before leaving?',
 *   confirmLabel: 'Save', discardLabel: 'Discard', cancelLabel: 'Cancel',
 *   additionalLabel: 'Preview changes', onAdditional: () => openPreview(),
 * })
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

  function settle(action) {
    visible.value = false
    _resolve.value?.(action)
    _resolve.value = null
  }

  async function runAction(action, callback) {
    if (callback) {
      isLoading.value = true
      loadingAction.value = action
      try {
        await callback()
      } finally {
        isLoading.value = false
        loadingAction.value = null
      }
    }
    settle(action)
  }

  function handleConfirm()    { return runAction('confirm', options.value.onConfirm) }
  function handleDiscard()    { return runAction('discard', options.value.onDiscard) }
  function handleAdditional() { return runAction('additional', options.value.onAdditional) }
  function handleCancel() {
    if (isLoading.value) return
    settle('cancel')
  }

  return { visible, options, isLoading, loadingAction, confirm, handleConfirm, handleDiscard, handleAdditional, handleCancel }
}
