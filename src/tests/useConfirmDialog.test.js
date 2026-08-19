import { describe, it, expect, beforeEach } from 'vitest'
import { useConfirmDialog } from '../composables/useConfirmDialog.js'

beforeEach(() => {
  const { visible, options, isLoading, loadingAction } = useConfirmDialog()
  visible.value = false
  options.value = {}
  isLoading.value = false
  loadingAction.value = null
})

describe('useConfirmDialog — confirm()', () => {
  it('sets visible to true and merges options with defaults', () => {
    const { confirm, visible, options } = useConfirmDialog()
    confirm({ title: 'Delete?', variant: 'danger' })
    expect(visible.value).toBe(true)
    expect(options.value.title).toBe('Delete?')
    expect(options.value.variant).toBe('danger')
    expect(options.value.size).toBe('medium')
    expect(options.value.confirmLabel).toBe('Confirm')
    expect(options.value.cancelLabel).toBe('Cancel')
    expect(options.value.discardLabel).toBe('')
    expect(options.value.additionalLabel).toBe('')
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
  it('resolves the promise with "confirm" and hides the dialog', async () => {
    const { confirm, handleConfirm, visible } = useConfirmDialog()
    const promise = confirm()
    await handleConfirm()
    expect(await promise).toBe('confirm')
    expect(visible.value).toBe(false)
  })

  it('sets isLoading and loadingAction around an async onConfirm callback', async () => {
    const { confirm, handleConfirm, isLoading, loadingAction } = useConfirmDialog()
    let resolveTask
    const task = new Promise(resolve => { resolveTask = resolve })
    confirm({ onConfirm: () => task })

    const confirmPromise = handleConfirm()
    await Promise.resolve()
    expect(isLoading.value).toBe(true)
    expect(loadingAction.value).toBe('confirm')

    resolveTask()
    await confirmPromise
    expect(isLoading.value).toBe(false)
    expect(loadingAction.value).toBe(null)
  })
})

describe('useConfirmDialog — handleDiscard()', () => {
  it('resolves the promise with "discard" and hides the dialog', async () => {
    const { confirm, handleDiscard, visible } = useConfirmDialog()
    const promise = confirm({ discardLabel: 'Discard' })
    await handleDiscard()
    expect(await promise).toBe('discard')
    expect(visible.value).toBe(false)
  })

  it('runs the onDiscard callback with a loading state', async () => {
    const { confirm, handleDiscard, isLoading, loadingAction } = useConfirmDialog()
    let resolveTask
    const task = new Promise(resolve => { resolveTask = resolve })
    confirm({ discardLabel: 'Discard', onDiscard: () => task })

    const discardPromise = handleDiscard()
    await Promise.resolve()
    expect(isLoading.value).toBe(true)
    expect(loadingAction.value).toBe('discard')

    resolveTask()
    await discardPromise
    expect(isLoading.value).toBe(false)
  })
})

describe('useConfirmDialog — handleAdditional()', () => {
  it('resolves the promise with "additional" and hides the dialog', async () => {
    const { confirm, handleAdditional, visible } = useConfirmDialog()
    const promise = confirm({ size: 'large', additionalLabel: 'Preview' })
    await handleAdditional()
    expect(await promise).toBe('additional')
    expect(visible.value).toBe(false)
  })

  it('runs the onAdditional callback with a loading state', async () => {
    const { confirm, handleAdditional, isLoading, loadingAction } = useConfirmDialog()
    let resolveTask
    const task = new Promise(resolve => { resolveTask = resolve })
    confirm({ size: 'large', additionalLabel: 'Preview', onAdditional: () => task })

    const promise = handleAdditional()
    await Promise.resolve()
    expect(isLoading.value).toBe(true)
    expect(loadingAction.value).toBe('additional')

    resolveTask()
    await promise
    expect(isLoading.value).toBe(false)
  })
})

describe('useConfirmDialog — handleCancel()', () => {
  it('resolves the promise with "cancel" and hides the dialog', async () => {
    const { confirm, handleCancel, visible } = useConfirmDialog()
    const promise = confirm()
    handleCancel()
    expect(await promise).toBe('cancel')
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
