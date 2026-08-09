import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuDrawer from '../components/feedback/SeneuDrawer.vue'

let wrapper
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  document.body.style.overflow = ''
  document.body.innerHTML = ''
})

function mountDrawer(props = {}, slots = {}) {
  wrapper = mount(SeneuDrawer, { props: { modelValue: true, ...props }, slots })
  return wrapper
}

function overlay() {
  return document.body.querySelector('.seneu-drawer-overlay')
}

describe('SeneuDrawer — open/close rendering', () => {
  it('renders nothing when modelValue is false', () => {
    mountDrawer({ modelValue: false })
    expect(overlay()).toBeNull()
  })

  it('renders the overlay and panel when modelValue is true', () => {
    mountDrawer()
    expect(overlay()).not.toBeNull()
    expect(document.body.querySelector('.seneu-drawer-panel')).not.toBeNull()
  })

  it('renders the title', () => {
    mountDrawer({ title: 'Edit profile' })
    expect(document.body.querySelector('.seneu-drawer__title').textContent).toBe('Edit profile')
  })

  it('renders the footer slot when provided', () => {
    mountDrawer({}, { footer: '<button class="ok">Save</button>' })
    expect(document.body.querySelector('.seneu-drawer__footer .ok')).not.toBeNull()
  })

  it('defaults to right placement and base size', () => {
    mountDrawer()
    const panel = document.body.querySelector('.seneu-drawer-panel')
    expect(panel.classList).toContain('seneu-drawer-panel--right')
    expect(panel.classList).toContain('seneu-drawer-panel--base')
  })

  it('applies the placement and size modifier classes', () => {
    mountDrawer({ placement: 'left', size: 'lg' })
    const panel = document.body.querySelector('.seneu-drawer-panel')
    expect(panel.classList).toContain('seneu-drawer-panel--left')
    expect(panel.classList).toContain('seneu-drawer-panel--lg')
  })
})

describe('SeneuDrawer — closing', () => {
  it('emits update:modelValue and close when the close button is clicked', async () => {
    mountDrawer({ title: 'x' })
    document.body.querySelector('.seneu-drawer__close').click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not render a close button when showClose is false', () => {
    mountDrawer({ showClose: false })
    expect(document.body.querySelector('.seneu-drawer__close')).toBeNull()
  })

  it('closes on backdrop click by default', async () => {
    mountDrawer()
    overlay().click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
  })

  it('does not close on backdrop click when closeOnBackdrop is false', async () => {
    mountDrawer({ closeOnBackdrop: false })
    overlay().click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('closes on Escape by default', async () => {
    mountDrawer()
    overlay().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
  })

  it('does not close on Escape when closeOnEsc is false', async () => {
    mountDrawer({ closeOnEsc: false })
    overlay().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})

describe('SeneuDrawer — body scroll lock', () => {
  it('locks body scroll while open', () => {
    mountDrawer()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when closed', async () => {
    mountDrawer()
    await wrapper.setProps({ modelValue: false })
    expect(document.body.style.overflow).toBe('')
  })
})

describe('SeneuDrawer — focus management', () => {
  it('restores focus to the trigger element on close', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    mountDrawer({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    await vi.waitFor(() => expect(document.activeElement).not.toBe(trigger))

    await wrapper.setProps({ modelValue: false })
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))

    trigger.remove()
  })

  it('wraps Tab from the last focusable element back to the first', async () => {
    mountDrawer({ showClose: false }, { footer: '<button class="a">A</button><button class="b">B</button>' })
    await vi.waitFor(() => expect(document.activeElement.className).toBe('a'))

    document.body.querySelector('.b').focus()
    overlay().dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement.className).toBe('a')
  })

  it('wraps Shift+Tab from the first focusable element back to the last', async () => {
    mountDrawer({ showClose: false }, { footer: '<button class="a">A</button><button class="b">B</button>' })
    await vi.waitFor(() => expect(document.activeElement.className).toBe('a'))

    overlay().dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
    expect(document.activeElement.className).toBe('b')
  })
})

describe('SeneuDrawer — accessibility', () => {
  it('has role="dialog" and aria-modal="true"', () => {
    mountDrawer()
    expect(overlay().getAttribute('role')).toBe('dialog')
    expect(overlay().getAttribute('aria-modal')).toBe('true')
  })

  it('sets aria-labelledby to the title id when a title is given', () => {
    mountDrawer({ title: 'Edit' })
    const labelledby = overlay().getAttribute('aria-labelledby')
    expect(labelledby).toBeTruthy()
    expect(document.getElementById(labelledby).textContent).toBe('Edit')
  })
})
