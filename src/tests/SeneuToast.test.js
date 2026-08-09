import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuToast from '../components/feedback/SeneuToast.vue'
import { useToast } from '../composables/useToast.js'

let wrapper

beforeEach(() => {
  vi.useFakeTimers()
  const { toasts, dismiss } = useToast()
  for (const t of [...toasts.value]) dismiss(t.id)
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  document.body.innerHTML = ''
  vi.useRealTimers()
})

function mountToast(props = {}) {
  wrapper = mount(SeneuToast, { props })
  return wrapper
}

describe('SeneuToast — rendering', () => {
  it('renders nothing when there are no toasts', () => {
    mountToast()
    expect(document.body.querySelector('.seneu-toast')).toBeNull()
  })

  it('renders a toast after a variant helper is called', async () => {
    mountToast()
    const { success } = useToast()
    success('Post published')
    await wrapper.vm.$nextTick()

    const toastEl = document.body.querySelector('.seneu-toast')
    expect(toastEl).not.toBeNull()
    expect(toastEl.classList).toContain('seneu-toast--success')
    expect(toastEl.querySelector('.seneu-toast__message').textContent).toBe('Post published')
  })

  it('renders the title when provided', async () => {
    mountToast()
    const { error } = useToast()
    error('Too large', { title: 'Upload failed' })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.seneu-toast__title').textContent).toBe('Upload failed')
  })

  it('renders multiple stacked toasts', async () => {
    mountToast()
    const { success, info } = useToast()
    success('First')
    info('Second')
    await wrapper.vm.$nextTick()

    expect(document.body.querySelectorAll('.seneu-toast')).toHaveLength(2)
  })

  it('applies the position modifier class to the container', () => {
    mountToast({ position: 'bottom-left' })
    expect(document.body.querySelector('.seneu-toast-container').classList).toContain('seneu-toast-container--bottom-left')
  })
})

describe('SeneuToast — dismiss', () => {
  it('renders a close button by default', async () => {
    mountToast()
    const { info } = useToast()
    info('x')
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.seneu-toast__close')).not.toBeNull()
  })

  it('hides the close button when dismissible is false', async () => {
    mountToast()
    const { info } = useToast()
    info('x', { dismissible: false })
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.seneu-toast__close')).toBeNull()
  })

  it('removes the toast when the close button is clicked', async () => {
    mountToast()
    const { info } = useToast()
    info('x')
    await wrapper.vm.$nextTick()
    document.body.querySelector('.seneu-toast__close').click()
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.seneu-toast')).toBeNull()
  })

  it('auto-dismisses after its duration elapses', async () => {
    mountToast()
    const { info } = useToast()
    info('x', { duration: 2000 })
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.seneu-toast')).not.toBeNull()

    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.seneu-toast')).toBeNull()
  })
})

describe('SeneuToast — pause on hover/focus', () => {
  it('pauses the auto-dismiss timer on mouseenter and resumes on mouseleave', async () => {
    mountToast()
    const { info } = useToast()
    info('x', { duration: 2000 })
    await wrapper.vm.$nextTick()
    const toastEl = document.body.querySelector('.seneu-toast')

    vi.advanceTimersByTime(1000)
    toastEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    vi.advanceTimersByTime(5000)
    expect(document.body.querySelector('.seneu-toast')).not.toBeNull()

    toastEl.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.seneu-toast')).toBeNull()
  })
})

describe('SeneuToast — accessibility', () => {
  it('has role="alert" and aria-live="polite"', async () => {
    mountToast()
    const { info } = useToast()
    info('x')
    await wrapper.vm.$nextTick()

    const toastEl = document.body.querySelector('.seneu-toast')
    expect(toastEl.getAttribute('role')).toBe('alert')
    expect(toastEl.getAttribute('aria-live')).toBe('polite')
  })
})
