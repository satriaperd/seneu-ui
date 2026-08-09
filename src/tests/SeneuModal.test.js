import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuModal from '../components/feedback/SeneuModal.vue'

let wrapper
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  document.body.style.overflow = ''
  document.body.innerHTML = ''
})

function mountModal(props = {}, slots = {}) {
  wrapper = mount(SeneuModal, { props: { modelValue: true, ...props }, slots })
  return wrapper
}

function overlay() {
  return document.body.querySelector('.seneu-modal-overlay')
}

describe('SeneuModal — open/close rendering', () => {
  it('renders nothing when modelValue is false', () => {
    mountModal({ modelValue: false })
    expect(overlay()).toBeNull()
  })

  it('renders the overlay and dialog when modelValue is true', () => {
    mountModal()
    expect(overlay()).not.toBeNull()
    expect(document.body.querySelector('.seneu-modal-dialog')).not.toBeNull()
  })

  it('renders the title', () => {
    mountModal({ title: 'Confirm action' })
    expect(document.body.querySelector('.seneu-modal__title').textContent).toBe('Confirm action')
  })

  it('renders the default slot as the body', () => {
    mountModal({}, { default: 'Are you sure?' })
    expect(document.body.querySelector('.seneu-modal__body').textContent).toContain('Are you sure?')
  })

  it('does not render a footer without the footer slot', () => {
    mountModal()
    expect(document.body.querySelector('.seneu-modal__footer')).toBeNull()
  })

  it('renders the footer slot when provided', () => {
    mountModal({}, { footer: '<button class="ok">OK</button>' })
    expect(document.body.querySelector('.seneu-modal__footer .ok')).not.toBeNull()
  })

  it('renders a custom header slot instead of the default title', () => {
    mountModal({ title: 'ignored' }, { header: '<div class="custom-head">Custom</div>' })
    expect(document.body.querySelector('.custom-head')).not.toBeNull()
    expect(document.body.querySelector('.seneu-modal__title')).toBeNull()
  })

  it('applies the size modifier class', () => {
    mountModal({ size: 'lg' })
    expect(document.body.querySelector('.seneu-modal-dialog').classList).toContain('seneu-modal-dialog--lg')
  })
})

describe('SeneuModal — closing', () => {
  it('emits update:modelValue and close when the close button is clicked', async () => {
    mountModal({ title: 'x' })
    document.body.querySelector('.seneu-modal__close').click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not render a close button when showClose is false', () => {
    mountModal({ title: 'x', showClose: false })
    expect(document.body.querySelector('.seneu-modal__close')).toBeNull()
  })

  it('closes on backdrop click by default', async () => {
    mountModal()
    overlay().click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
  })

  it('does not close on backdrop click when closeOnBackdrop is false', async () => {
    mountModal({ closeOnBackdrop: false })
    overlay().click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('closes on Escape by default', async () => {
    mountModal()
    overlay().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
  })

  it('does not close on Escape when closeOnEsc is false', async () => {
    mountModal({ closeOnEsc: false })
    overlay().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})

describe('SeneuModal — body scroll lock', () => {
  it('locks body scroll while open', () => {
    mountModal()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when closed', async () => {
    mountModal()
    await wrapper.setProps({ modelValue: false })
    expect(document.body.style.overflow).toBe('')
  })
})

describe('SeneuModal — focus management', () => {
  it('moves focus into the dialog when opened', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    mountModal({ modelValue: false, showClose: false }, { footer: '<button class="a">A</button><button class="b">B</button>' })
    await wrapper.setProps({ modelValue: true })
    await vi.waitFor(() => expect(document.activeElement).not.toBe(trigger))
    expect(document.activeElement.className).toBe('a')

    trigger.remove()
  })

  it('restores focus to the trigger element on close', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    mountModal({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    await vi.waitFor(() => expect(document.activeElement).not.toBe(trigger))

    await wrapper.setProps({ modelValue: false })
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))

    trigger.remove()
  })

  it('wraps Tab from the last focusable element back to the first', async () => {
    mountModal({ showClose: false }, { footer: '<button class="a">A</button><button class="b">B</button>' })
    await vi.waitFor(() => expect(document.activeElement.className).toBe('a'))

    const b = document.body.querySelector('.b')
    b.focus()
    overlay().dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement.className).toBe('a')
  })

  it('wraps Shift+Tab from the first focusable element back to the last', async () => {
    mountModal({ showClose: false }, { footer: '<button class="a">A</button><button class="b">B</button>' })
    await vi.waitFor(() => expect(document.activeElement.className).toBe('a'))

    overlay().dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
    expect(document.activeElement.className).toBe('b')
  })
})

describe('SeneuModal — accessibility', () => {
  it('has role="dialog" and aria-modal="true"', () => {
    mountModal()
    expect(overlay().getAttribute('role')).toBe('dialog')
    expect(overlay().getAttribute('aria-modal')).toBe('true')
  })

  it('sets aria-labelledby to the title id when a title is given', () => {
    mountModal({ title: 'Confirm' })
    const labelledby = overlay().getAttribute('aria-labelledby')
    expect(labelledby).toBeTruthy()
    expect(document.getElementById(labelledby).textContent).toBe('Confirm')
  })

  it('omits aria-labelledby when there is no title', () => {
    mountModal()
    expect(overlay().hasAttribute('aria-labelledby')).toBe(false)
  })
})
