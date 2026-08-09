import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuConfirmDialog from '../components/feedback/SeneuConfirmDialog.vue'
import { useConfirmDialog } from '../composables/useConfirmDialog.js'

let wrapper

beforeEach(() => {
  const { visible, options, isLoading } = useConfirmDialog()
  visible.value = false
  options.value = {}
  isLoading.value = false
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

    expect(document.body.querySelector('.seneu-modal__title').textContent).toBe('Delete this post?')
    expect(document.body.querySelector('.seneu-confirm-dialog__message').textContent).toBe('This cannot be undone.')
  })
})

describe('SeneuConfirmDialog — variant', () => {
  it('applies the variant modifier class to the icon wrap', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm({ variant: 'danger' })
    await wrapper.vm.$nextTick()

    const iconWrap = document.body.querySelector('.seneu-confirm-dialog__icon-wrap')
    expect(iconWrap.classList).toContain('seneu-confirm-dialog__icon-wrap--danger')
  })

  it('defaults to the default variant', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    confirm()
    await wrapper.vm.$nextTick()

    const iconWrap = document.body.querySelector('.seneu-confirm-dialog__icon-wrap')
    expect(iconWrap.classList).toContain('seneu-confirm-dialog__icon-wrap--default')
  })
})

describe('SeneuConfirmDialog — resolution', () => {
  it('resolves true when the confirm button is clicked', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    const promise = confirm({ confirmLabel: 'Delete' })
    await wrapper.vm.$nextTick()

    const buttons = document.body.querySelectorAll('.seneu-modal__footer button')
    const confirmBtn = [...buttons].find(b => b.textContent.trim() === 'Delete')
    confirmBtn.click()

    expect(await promise).toBe(true)
  })

  it('resolves false when the cancel button is clicked', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    const promise = confirm()
    await wrapper.vm.$nextTick()

    const buttons = document.body.querySelectorAll('.seneu-modal__footer button')
    const cancelBtn = [...buttons].find(b => b.textContent.trim() === 'Cancel')
    cancelBtn.click()

    expect(await promise).toBe(false)
  })

  it('resolves false when the modal is dismissed via Escape', async () => {
    mountDialog()
    const { confirm } = useConfirmDialog()
    const promise = confirm()
    await wrapper.vm.$nextTick()

    document.body.querySelector('.seneu-modal-overlay')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(await promise).toBe(false)
  })
})
