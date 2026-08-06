import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuSelect from '../components/form/SeneuSelect.vue'

const OPTIONS = [
  { label: 'Admin',  value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer', disabled: true },
]

describe('SeneuSelect — rendering', () => {
  it('renders a <select> element', () => {
    const wrapper = mount(SeneuSelect)
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('renders label when prop is set', () => {
    const wrapper = mount(SeneuSelect, { props: { label: 'Role' } })
    expect(wrapper.find('label').text()).toBe('Role')
  })

  it('does not render label when prop is empty', () => {
    const wrapper = mount(SeneuSelect)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('label for matches select id', () => {
    const wrapper = mount(SeneuSelect, { props: { label: 'Role', id: 'test-id' } })
    expect(wrapper.find('label').attributes('for')).toBe('test-id')
    expect(wrapper.find('select').attributes('id')).toBe('test-id')
  })

  it('renders options from the options prop', () => {
    const wrapper = mount(SeneuSelect, { props: { options: OPTIONS } })
    const opts = wrapper.findAll('option')
    expect(opts).toHaveLength(3)
    expect(opts[0].text()).toBe('Admin')
  })

  it('renders disabled option correctly', () => {
    const wrapper = mount(SeneuSelect, { props: { options: OPTIONS } })
    const opts = wrapper.findAll('option')
    expect(opts[2].attributes('disabled')).toBeDefined()
  })

  it('renders placeholder as a disabled first option', () => {
    const wrapper = mount(SeneuSelect, { props: { options: OPTIONS, placeholder: 'Pilih role…' } })
    const opts = wrapper.findAll('option')
    expect(opts).toHaveLength(4)
    expect(opts[0].text()).toBe('Pilih role…')
    expect(opts[0].attributes('disabled')).toBeDefined()
  })

  it('does not render placeholder option when omitted', () => {
    const wrapper = mount(SeneuSelect, { props: { options: OPTIONS } })
    expect(wrapper.findAll('option')).toHaveLength(3)
  })
})

describe('SeneuSelect — v-model', () => {
  it('sets select value from modelValue prop', () => {
    const wrapper = mount(SeneuSelect, { props: { options: OPTIONS, modelValue: 'editor' } })
    expect(wrapper.find('select').element.value).toBe('editor')
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(SeneuSelect, { props: { options: OPTIONS, modelValue: 'admin' } })
    await wrapper.find('select').setValue('editor')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['editor'])
  })
})

describe('SeneuSelect — slot', () => {
  it('renders slotted <option> markup in addition to options prop', () => {
    const wrapper = mount(SeneuSelect, {
      props: { options: OPTIONS },
      slots: { default: '<option value="custom">Custom</option>' },
    })
    const opts = wrapper.findAll('option')
    expect(opts).toHaveLength(4)
    expect(opts[3].text()).toBe('Custom')
  })
})

describe('SeneuSelect — size', () => {
  const sizes = ['sm', 'base', 'lg']

  for (const size of sizes) {
    it(`applies .seneu-select--${size} class`, () => {
      const wrapper = mount(SeneuSelect, { props: { size } })
      expect(wrapper.classes()).toContain(`seneu-select--${size}`)
    })
  }

  it('defaults to base size', () => {
    const wrapper = mount(SeneuSelect)
    expect(wrapper.classes()).toContain('seneu-select--base')
  })
})

describe('SeneuSelect — disabled', () => {
  it('sets disabled attribute on select', () => {
    const wrapper = mount(SeneuSelect, { props: { disabled: true } })
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
  })

  it('applies .seneu-select--disabled class', () => {
    const wrapper = mount(SeneuSelect, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('seneu-select--disabled')
  })
})

describe('SeneuSelect — error state', () => {
  it('applies .seneu-select--error class when error is set', () => {
    const wrapper = mount(SeneuSelect, { props: { error: 'Invalid' } })
    expect(wrapper.classes()).toContain('seneu-select--error')
  })

  it('shows error message text', () => {
    const wrapper = mount(SeneuSelect, { props: { error: 'Required field' } })
    const msg = wrapper.find('.seneu-select__message--error')
    expect(msg.exists()).toBe(true)
    expect(msg.text()).toContain('Required field')
  })

  it('sets aria-invalid="true" on select when error', () => {
    const wrapper = mount(SeneuSelect, { props: { error: 'Bad value' } })
    expect(wrapper.find('select').attributes('aria-invalid')).toBe('true')
  })
})

describe('SeneuSelect — hint', () => {
  it('shows hint message text', () => {
    const wrapper = mount(SeneuSelect, { props: { hint: 'Pick one' } })
    const msg = wrapper.find('.seneu-select__message--hint')
    expect(msg.exists()).toBe(true)
    expect(msg.text()).toContain('Pick one')
  })

  it('error takes priority over hint', () => {
    const wrapper = mount(SeneuSelect, { props: { hint: 'Hint', error: 'Error' } })
    expect(wrapper.find('.seneu-select__message--error').exists()).toBe(true)
    expect(wrapper.find('.seneu-select__message--hint').exists()).toBe(false)
  })

  it('links select to message via aria-describedby', () => {
    const wrapper = mount(SeneuSelect, { props: { hint: 'Help text', id: 'f1' } })
    expect(wrapper.find('select').attributes('aria-describedby')).toBe('f1-desc')
    expect(wrapper.find('#f1-desc').exists()).toBe(true)
  })
})

describe('SeneuSelect — loading', () => {
  it('shows spinner when loading is true', () => {
    const wrapper = mount(SeneuSelect, { props: { loading: true } })
    expect(wrapper.find('.seneu-select__spinner').exists()).toBe(true)
  })

  it('does not show spinner by default', () => {
    const wrapper = mount(SeneuSelect)
    expect(wrapper.find('.seneu-select__spinner').exists()).toBe(false)
  })

  it('shows arrow icon when not loading', () => {
    const wrapper = mount(SeneuSelect)
    expect(wrapper.find('.seneu-select__arrow').exists()).toBe(true)
  })

  it('disables select while loading', () => {
    const wrapper = mount(SeneuSelect, { props: { loading: true } })
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
  })

  it('sets aria-busy="true" on select when loading', () => {
    const wrapper = mount(SeneuSelect, { props: { loading: true } })
    expect(wrapper.find('select').attributes('aria-busy')).toBe('true')
  })
})
