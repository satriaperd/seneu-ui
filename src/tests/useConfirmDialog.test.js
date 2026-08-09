import { describe, it, expect, beforeEach } from 'vitest'
import { useConfirmDialog } from '../composables/useConfirmDialog.js'

beforeEach(() => {
  const { visible, options, isLoading } = useConfirmDialog()
  visible.value = false
  options.value = {}
  isLoading.value = false
})

describe('useConfirmDialog — confirm()', () => {
  it('sets visible to true and merges options with defaults', () => {
    const { confirm, visible, options } = useConfirmDialog()
    confirm({ title: 'Delete?', variant: 'danger' })
    expect(visible.value).toBe(true)
    expect(options.value.title).toBe('Delete?')
    expect(options.value.variant).toBe('danger')
    expect(options.value.confirmLabel).toBe('Confirm')
    expect(options.value.cancelLabel).toBe('Cancel')
  })

  it('returns a promise that has not settled yet', async () => {
    const { confirm } = useConfirmDialog()
    let settled = false
    confirm().then(() => { settled = true })
    await Promise.resolve()
    expect(settled).toBe(false)
  })
})

describe('useConfirmDialog — handleConfirm()', () => {
  it('resolves the promise with true and hides the dialog', async () => {
    const { confirm, handleConfirm, visible } = useConfirmDialog()
    const promise = confirm()
    await handleConfirm()
    expect(await promise).toBe(true)
    expect(visible.value).toBe(false)
  })

  it('sets isLoading around an async onConfirm callback', async () => {
    const { confirm, handleConfirm, isLoading } = useConfirmDialog()
    let resolveTask
    const task = new Promise(resolve => { resolveTask = resolve })
    confirm({ onConfirm: () => task })

    const confirmPromise = handleConfirm()
    await Promise.resolve()
    expect(isLoading.value).toBe(true)

    resolveTask()
    await confirmPromise
    expect(isLoading.value).toBe(false)
  })
})

describe('useConfirmDialog — handleCancel()', () => {
  it('resolves the promise with false and hides the dialog', async () => {
    const { confirm, handleCancel, visible } = useConfirmDialog()
    const promise = confirm()
    handleCancel()
    expect(await promise).toBe(false)
    expect(visible.value).toBe(false)
  })

  it('does nothing while isLoading is true', () => {
    const { confirm, handleCancel, visible, isLoading } = useConfirmDialog()
    confirm()
    isLoading.value = true
    handleCancel()
    expect(visible.value).toBe(true)
  })
})
