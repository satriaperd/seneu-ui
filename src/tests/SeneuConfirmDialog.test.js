import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuConfirmDialog from '../components/feedback/SeneuConfirmDialog.vue'
import { useConfirmDialog } from '../composables/useConfirmDialog.js'

let wrapper

beforeEach(() => {
  const { visible, options, isLoading, loadingAction } = useConfirmDialog()
  visible.value = false
  options.value = {}
  isLoading.value = false
  loadingAction.value = null
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  document.body.style.overflow = ''
  document.body.innerHTML = ''
})

function mountDialog() {
  wrapper = mount(SeneuConfirmDialog)
  return wrapper
}

function footerButtons() {
  return [...document.body.querySelectorAll('.seneu-modal__footer button')]
}
function footerButton(label) {
  return footerButtons().find(b => b.textContent.trim() === label)
}

describe('SeneuConfirmDialog — visibility', () => {
  it('renders nothing until confirm() is called', () => {
    mountDialog()
    expect(document.body.querySelector('.seneu-modal-overlay')).toBeNull()
  })

  it('shows the dialog with the given title and message after confirm()', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ title: 'Delete this post?', message: 'This cannot be undone.' })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.seneu-confirm-dialog__title').textContent).toBe('Delete this post?')
    expect(document.body.querySelector('.seneu-confirm-dialog__message').textContent).toBe('This cannot be undone.')
  })

  it('does not render a message paragraph when none is given', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ title: 'Delete?' })
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.seneu-confirm-dialog__message')).toBeNull()
  })
})

describe('SeneuConfirmDialog — variant', () => {
  it('applies the variant modifier class to the icon wrap', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ size: 'large', variant: 'danger' })
    await wrapper.vm.$nextTick()

    const iconWrap = document.body.querySelector('.seneu-confirm-dialog__icon-wrap')
    expect(iconWrap.classList).toContain('seneu-confirm-dialog__icon-wrap--danger')
  })

  it('defaults to the default variant', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ size: 'large' })
    await wrapper.vm.$nextTick()

    const iconWrap = document.body.querySelector('.seneu-confirm-dialog__icon-wrap')
    expect(iconWrap.classList).toContain('seneu-confirm-dialog__icon-wrap--default')
  })
})

describe('SeneuConfirmDialog — icon visibility per size', () => {
  it('always shows the icon on size "large", falling back to the variant default', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ size: 'large' })
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.seneu-confirm-dialog__icon-wrap')).not.toBeNull()
  })

  it('hides the icon on "medium" unless one is explicitly given', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ size: 'medium' })
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.seneu-confirm-dialog__icon-wrap')).toBeNull()
  })

  it('shows the icon on "medium" when explicitly given', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ size: 'medium', icon: 'star' })
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.seneu-confirm-dialog__icon-wrap')).not.toBeNull()
  })

  it('hides the icon on "small" unless one is explicitly given', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ size: 'small' })
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.seneu-confirm-dialog__icon-wrap')).toBeNull()
  })
})

describe('SeneuConfirmDialog — button set per size', () => {
  it('size "small" never shows Discard or Additional even if provided', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ size: 'small', discardLabel: 'Discard', additionalLabel: 'More' })
    await wrapper.vm.$nextTick()

    expect(footerButton('Discard')).toBeUndefined()
    expect(footerButton('More')).toBeUndefined()
    expect(footerButton('Cancel')).toBeDefined()
    expect(footerButton('Confirm')).toBeDefined()
  })

  it('size "medium" shows Discard when provided, never Additional', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ size: 'medium', discardLabel: 'Discard', additionalLabel: 'More' })
    await wrapper.vm.$nextTick()

    expect(footerButton('Discard')).toBeDefined()
    expect(footerButton('More')).toBeUndefined()
  })

  it('size "large" shows both Discard and Additional when provided', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ size: 'large', discardLabel: 'Discard', additionalLabel: 'More' })
    await wrapper.vm.$nextTick()

    expect(footerButton('Discard')).toBeDefined()
    expect(footerButton('More')).toBeDefined()
  })

  it('size "large" without discardLabel/additionalLabel only shows Confirm + Cancel', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ size: 'large' })
    await wrapper.vm.$nextTick()

    expect(footerButtons()).toHaveLength(2)
    expect(footerButton('Cancel')).toBeDefined()
    expect(footerButton('Confirm')).toBeDefined()
  })
})

describe('SeneuConfirmDialog — resolution', () => {
  it('resolves "confirm" when the confirm button is clicked', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    const promise = confirm({ confirmLabel: 'Delete' })
    await wrapper.vm.$nextTick()

    footerButton('Delete').click()
    expect(await promise).toBe('confirm')
  })

  it('resolves "discard" when the discard button is clicked', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    const promise = confirm({ size: 'medium', discardLabel: 'Discard' })
    await wrapper.vm.$nextTick()

    footerButton('Discard').click()
    expect(await promise).toBe('discard')
  })

  it('resolves "additional" when the additional button is clicked', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    const promise = confirm({ size: 'large', additionalLabel: 'Preview' })
    await wrapper.vm.$nextTick()

    footerButton('Preview').click()
    expect(await promise).toBe('additional')
  })

  it('resolves "cancel" when the cancel button is clicked', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    const promise = confirm()
    await wrapper.vm.$nextTick()

    footerButton('Cancel').click()
    expect(await promise).toBe('cancel')
  })

  it('resolves "cancel" when the modal is dismissed via Escape', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    const promise = confirm()
    await wrapper.vm.$nextTick()

    document.body.querySelector('.seneu-modal-overlay')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(await promise).toBe('cancel')
  })
})
