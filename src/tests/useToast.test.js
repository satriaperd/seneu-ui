import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useToast } from '../composables/useToast.js'

beforeEach(() => {
  vi.useFakeTimers()
  const { toasts, dismiss } = useToast()
  for (const t of [...toasts.value]) dismiss(t.id)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useToast — variant helpers', () => {
  it('success() adds a success toast with the given message', () => {
    const { success, toasts } = useToast()
    success('Post published')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]).toMatchObject({ variant: 'success', message: 'Post published' })
  })

  it('error() adds a danger-variant toast', () => {
    const { error, toasts } = useToast()
    error('Upload failed')
    expect(toasts.value[0].variant).toBe('danger')
  })

  it('warning() and info() add their respective variants', () => {
    const { warning, info, toasts } = useToast()
    warning('careful')
    info('fyi')
    expect(toasts.value.map(t => t.variant)).toEqual(['warning', 'info'])
  })

  it('accepts a title via options', () => {
    const { error, toasts } = useToast()
    error('Too large', { title: 'Upload failed' })
    expect(toasts.value[0].title).toBe('Upload failed')
  })

  it('show() accepts fully custom options', () => {
    const { show, toasts } = useToast()
    show({ variant: 'success', title: 'Done', message: 'All set', dismissible: false })
    expect(toasts.value[0]).toMatchObject({ variant: 'success', title: 'Done', message: 'All set', dismissible: false })
  })

  it('stacks multiple toasts in call order', () => {
    const { success, info, toasts } = useToast()
    success('First')
    info('Second')
    expect(toasts.value.map(t => t.message)).toEqual(['First', 'Second'])
  })
})

describe('useToast — dismiss', () => {
  it('dismiss(id) removes the matching toast', () => {
    const { success, dismiss, toasts } = useToast()
    const id = success('x')
    dismiss(id)
    expect(toasts.value).toHaveLength(0)
  })
})

describe('useToast — auto-dismiss timing', () => {
  it('auto-dismisses after the given duration', () => {
    const { info, toasts } = useToast()
    info('x', { duration: 3000 })
    expect(toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(3000)
    expect(toasts.value).toHaveLength(0)
  })

  it('does not auto-dismiss when duration is 0', () => {
    const { info, toasts } = useToast()
    info('x', { duration: 0 })
    vi.advanceTimersByTime(60000)
    expect(toasts.value).toHaveLength(1)
  })
})

describe('useToast — pause/resume', () => {
  it('pause() prevents dismissal at the original duration', () => {
    const { info, pause, toasts } = useToast()
    const id = info('x', { duration: 3000 })
    vi.advanceTimersByTime(1000)
    pause(id)
    vi.advanceTimersByTime(5000)
    expect(toasts.value).toHaveLength(1)
  })

  it('resume() continues the countdown from the remaining time, not the full duration', () => {
    const { info, pause, resume, toasts } = useToast()
    const id = info('x', { duration: 3000 })
    vi.advanceTimersByTime(2000)
    pause(id)
    resume(id)
    vi.advanceTimersByTime(500)
    expect(toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(500)
    expect(toasts.value).toHaveLength(0)
  })

  it('resume() dismisses immediately if the remaining time is already exhausted', () => {
    const { info, pause, resume, toasts } = useToast()
    const id = info('x', { duration: 1000 })
    pause(id)
    toasts.value.find(t => t.id === id).remaining = 0
    resume(id)
    expect(toasts.value).toHaveLength(0)
  })
})
