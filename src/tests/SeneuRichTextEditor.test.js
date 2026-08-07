import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuRichTextEditor from '../components/layout/SeneuRichTextEditor.vue'

// jsdom does not implement execCommand/queryCommandState/queryCommandValue —
// mock them so the component's calls are deterministic and verifiable.
beforeEach(() => {
  document.execCommand = vi.fn().mockReturnValue(true)
  document.queryCommandState = vi.fn().mockReturnValue(false)
  document.queryCommandValue = vi.fn().mockReturnValue('p')
})
afterEach(() => vi.restoreAllMocks())

describe('SeneuRichTextEditor — rendering', () => {
  it('renders a contenteditable region with role="textbox"', () => {
    const wrapper = mount(SeneuRichTextEditor)
    const editor = wrapper.find('[role="textbox"]')
    expect(editor.exists()).toBe(true)
    expect(editor.attributes('contenteditable')).toBe('true')
  })

  it('renders the label', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { label: 'Description' } })
    expect(wrapper.find('.seneu-rte__label').text()).toBe('Description')
  })

  it('syncs modelValue into the editable area innerHTML', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { modelValue: '<p>Hello</p>' } })
    expect(wrapper.find('[role="textbox"]').element.innerHTML).toBe('<p>Hello</p>')
  })

  it('sets data-placeholder from the placeholder prop', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { placeholder: 'Type here…' } })
    expect(wrapper.find('[role="textbox"]').attributes('data-placeholder')).toBe('Type here…')
  })

  it('applies the empty modifier class when there is no content', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { modelValue: '' } })
    expect(wrapper.find('[role="textbox"]').classes()).toContain('seneu-rte__editor--empty')
  })

  it('does not apply the empty modifier class when there is content', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { modelValue: '<p>Hi</p>' } })
    expect(wrapper.find('[role="textbox"]').classes()).not.toContain('seneu-rte__editor--empty')
  })
})

describe('SeneuRichTextEditor — v-model', () => {
  it('emits update:modelValue with the new innerHTML on input', async () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { modelValue: '' } })
    const editor = wrapper.find('[role="textbox"]')
    editor.element.innerHTML = '<p>New content</p>'
    await editor.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['<p>New content</p>'])
  })

  it('emits change on blur with the current content', async () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { modelValue: '<p>x</p>' } })
    await wrapper.find('[role="textbox"]').trigger('blur')
    expect(wrapper.emitted('change')?.[0]).toEqual(['<p>x</p>'])
  })

  it('emits focus/blur events', async () => {
    const wrapper = mount(SeneuRichTextEditor)
    const editor = wrapper.find('[role="textbox"]')
    await editor.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
    await editor.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })
})

describe('SeneuRichTextEditor — toolbar commands', () => {
  it('calls execCommand("bold") when the Bold button is clicked', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    await wrapper.find('[aria-label="Bold"]').trigger('click')
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, null)
    wrapper.unmount()
  })

  it('calls execCommand for undo/redo', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    await wrapper.find('[aria-label="Undo"]').trigger('click')
    expect(document.execCommand).toHaveBeenCalledWith('undo', false, null)
    await wrapper.find('[aria-label="Redo"]').trigger('click')
    expect(document.execCommand).toHaveBeenCalledWith('redo', false, null)
    wrapper.unmount()
  })

  it('calls execCommand("insertUnorderedList") for the bullet list button', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    await wrapper.find('[aria-label="Bullet list"]').trigger('click')
    expect(document.execCommand).toHaveBeenCalledWith('insertUnorderedList', false, null)
    wrapper.unmount()
  })

  it('calls execCommand("justifyCenter") for the align-center button', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    await wrapper.find('[aria-label="Align center"]').trigger('click')
    expect(document.execCommand).toHaveBeenCalledWith('justifyCenter', false, null)
    wrapper.unmount()
  })

  it('calls execCommand("removeFormat") for the clear-formatting button', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    await wrapper.find('[aria-label="Clear formatting"]').trigger('click')
    expect(document.execCommand).toHaveBeenCalledWith('removeFormat', false, null)
    wrapper.unmount()
  })

  it('reflects queryCommandState as aria-pressed and an active class', () => {
    document.queryCommandState = vi.fn(cmd => cmd === 'bold')
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    wrapper.find('[role="textbox"]').trigger('keyup')
    return wrapper.vm.$nextTick().then(() => {
      const boldBtn = wrapper.find('[aria-label="Bold"]')
      expect(boldBtn.attributes('aria-pressed')).toBe('true')
      expect(boldBtn.classes()).toContain('seneu-rte__btn--active')
      wrapper.unmount()
    })
  })

  it('does not call execCommand when disabled', async () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { disabled: true }, attachTo: document.body })
    await wrapper.find('[aria-label="Bold"]').trigger('click')
    expect(document.execCommand).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

describe('SeneuRichTextEditor — block format dropdown', () => {
  it('opens the block format menu on trigger click', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    expect(wrapper.find('.seneu-rte__block-dropdown').exists()).toBe(false)
    await wrapper.find('.seneu-rte__btn--block').trigger('click')
    expect(wrapper.find('.seneu-rte__block-dropdown').exists()).toBe(true)
    wrapper.unmount()
  })

  it('applies formatBlock and closes the menu when an option is picked', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    await wrapper.find('.seneu-rte__btn--block').trigger('click')
    const h1Option = wrapper.findAll('.seneu-rte__block-option').find(el => el.text() === 'Heading 1')
    await h1Option.trigger('click')
    expect(document.execCommand).toHaveBeenCalledWith('formatBlock', false, '<h1>')
    expect(wrapper.find('.seneu-rte__block-dropdown').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('SeneuRichTextEditor — link popover', () => {
  it('opens the link popover when the link button is clicked', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    await wrapper.find('[aria-label="Insert link"]').trigger('click')
    expect(wrapper.find('.seneu-rte__link-popover').exists()).toBe(true)
    wrapper.unmount()
  })

  it('applies createLink with the entered URL on confirm', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    await wrapper.find('[aria-label="Insert link"]').trigger('click')
    const input = wrapper.find('.seneu-rte__link-input')
    await input.setValue('https://example.com')
    await wrapper.find('.seneu-rte__link-confirm').trigger('click')
    expect(document.execCommand).toHaveBeenCalledWith('createLink', false, 'https://example.com')
    expect(wrapper.find('.seneu-rte__link-popover').exists()).toBe(false)
    wrapper.unmount()
  })

  it('closes the popover without applying a link on cancel', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    await wrapper.find('[aria-label="Insert link"]').trigger('click')
    await wrapper.find('.seneu-rte__link-cancel').trigger('click')
    expect(wrapper.find('.seneu-rte__link-popover').exists()).toBe(false)
    expect(document.execCommand).not.toHaveBeenCalledWith('createLink', expect.anything(), expect.anything())
    wrapper.unmount()
  })

  it('calls execCommand("unlink") for the remove-link button', async () => {
    const wrapper = mount(SeneuRichTextEditor, { attachTo: document.body })
    await wrapper.find('[aria-label="Remove link"]').trigger('click')
    expect(document.execCommand).toHaveBeenCalledWith('unlink', false, null)
    wrapper.unmount()
  })
})

describe('SeneuRichTextEditor — disabled / readonly', () => {
  it('sets contenteditable to false when disabled', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { disabled: true } })
    expect(wrapper.find('[role="textbox"]').attributes('contenteditable')).toBe('false')
  })

  it('sets contenteditable to false when readonly', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { readonly: true } })
    expect(wrapper.find('[role="textbox"]').attributes('contenteditable')).toBe('false')
  })

  it('hides the toolbar when readonly', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { readonly: true } })
    expect(wrapper.find('.seneu-rte__toolbar').exists()).toBe(false)
  })

  it('disables toolbar buttons when disabled', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { disabled: true } })
    expect(wrapper.find('[aria-label="Bold"]').attributes('disabled')).toBeDefined()
  })
})

describe('SeneuRichTextEditor — hint, error, counter', () => {
  it('shows hint text', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { hint: 'Keep it short' } })
    expect(wrapper.find('.seneu-rte__message--hint').text()).toContain('Keep it short')
  })

  it('shows error text and sets aria-invalid', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { error: 'Required' } })
    expect(wrapper.find('.seneu-rte__message--error').text()).toContain('Required')
    expect(wrapper.find('[role="textbox"]').attributes('aria-invalid')).toBe('true')
  })

  it('error takes priority over hint', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { hint: 'Hint', error: 'Error' } })
    expect(wrapper.find('.seneu-rte__message--error').exists()).toBe(true)
    expect(wrapper.find('.seneu-rte__message--hint').exists()).toBe(false)
  })

  it('shows word and character counts when showCounter is true', () => {
    const wrapper = mount(SeneuRichTextEditor, {
      props: { modelValue: '<p>Hello world</p>', showCounter: true },
    })
    expect(wrapper.find('.seneu-rte__counter').text()).toBe('2 words · 11 characters')
  })

  it('does not show the counter by default', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { modelValue: '<p>Hello</p>' } })
    expect(wrapper.find('.seneu-rte__counter').exists()).toBe(false)
  })
})

describe('SeneuRichTextEditor — loading', () => {
  it('shows a skeleton instead of the toolbar and editor', () => {
    const wrapper = mount(SeneuRichTextEditor, { props: { loading: true } })
    expect(wrapper.find('.seneu-rte__skeleton').exists()).toBe(true)
    expect(wrapper.find('[role="textbox"]').exists()).toBe(false)
  })
})
