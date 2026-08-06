import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuCheckbox from '../components/form/SeneuCheckbox.vue'

describe('SeneuCheckbox — rendering', () => {
  it('renders an <input type="checkbox">', () => {
    const wrapper = mount(SeneuCheckbox)
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('checkbox')
  })

  it('renders label text', () => {
    const wrapper = mount(SeneuCheckbox, { props: { label: 'Remember me' } })
    expect(wrapper.find('.seneu-checkbox__label').text()).toBe('Remember me')
  })

  it('renders slot content instead of label prop when provided', () => {
    const wrapper = mount(SeneuCheckbox, {
      props: { label: 'Ignored' },
      slots: { default: 'Custom label' },
    })
    expect(wrapper.find('.seneu-checkbox__label').text()).toBe('Custom label')
  })

  it('renders description when provided', () => {
    const wrapper = mount(SeneuCheckbox, { props: { label: 'Notify me', description: 'Via email' } })
    expect(wrapper.find('.seneu-checkbox__description').text()).toBe('Via email')
  })

  it('label for matches input id', () => {
    const wrapper = mount(SeneuCheckbox, { props: { id: 'test-id' } })
    expect(wrapper.find('label').attributes('for')).toBe('test-id')
    expect(wrapper.find('input').attributes('id')).toBe('test-id')
  })
})

describe('SeneuCheckbox — v-model (boolean)', () => {
  it('reflects modelValue as checked', () => {
    const wrapper = mount(SeneuCheckbox, { props: { modelValue: true } })
    expect(wrapper.find('input').element.checked).toBe(true)
  })

  it('emits update:modelValue with boolean on change', async () => {
    const wrapper = mount(SeneuCheckbox, { props: { modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emits change event', async () => {
    const wrapper = mount(SeneuCheckbox, { props: { modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('change')).toBeTruthy()
  })
})

describe('SeneuCheckbox — v-model (array/group)', () => {
  it('is checked when modelValue array includes value', () => {
    const wrapper = mount(SeneuCheckbox, { props: { modelValue: ['a', 'b'], value: 'a' } })
    expect(wrapper.find('input').element.checked).toBe(true)
  })

  it('is unchecked when modelValue array excludes value', () => {
    const wrapper = mount(SeneuCheckbox, { props: { modelValue: ['b'], value: 'a' } })
    expect(wrapper.find('input').element.checked).toBe(false)
  })

  it('adds value to array on check', async () => {
    const wrapper = mount(SeneuCheckbox, { props: { modelValue: ['b'], value: 'a' } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['b', 'a']])
  })

  it('removes value from array on uncheck', async () => {
    const wrapper = mount(SeneuCheckbox, { props: { modelValue: ['a', 'b'], value: 'a' } })
    await wrapper.find('input').setValue(false)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['b']])
  })
})

describe('SeneuCheckbox — indeterminate', () => {
  it('sets the DOM indeterminate property', () => {
    const wrapper = mount(SeneuCheckbox, { props: { indeterminate: true } })
    expect(wrapper.find('input').element.indeterminate).toBe(true)
  })

  it('updates DOM indeterminate property reactively', async () => {
    const wrapper = mount(SeneuCheckbox, { props: { indeterminate: false } })
    expect(wrapper.find('input').element.indeterminate).toBe(false)
    await wrapper.setProps({ indeterminate: true })
    expect(wrapper.find('input').element.indeterminate).toBe(true)
  })
})

describe('SeneuCheckbox — size', () => {
  const sizes = ['sm', 'base', 'lg']

  for (const size of sizes) {
    it(`applies .seneu-checkbox--${size} class`, () => {
      const wrapper = mount(SeneuCheckbox, { props: { size } })
      expect(wrapper.find('.seneu-checkbox').classes()).toContain(`seneu-checkbox--${size}`)
    })
  }

  it('defaults to base size', () => {
    const wrapper = mount(SeneuCheckbox)
    expect(wrapper.find('.seneu-checkbox').classes()).toContain('seneu-checkbox--base')
  })
})

describe('SeneuCheckbox — disabled', () => {
  it('sets disabled attribute on input', () => {
    const wrapper = mount(SeneuCheckbox, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies .seneu-checkbox--disabled class', () => {
    const wrapper = mount(SeneuCheckbox, { props: { disabled: true } })
    expect(wrapper.find('.seneu-checkbox').classes()).toContain('seneu-checkbox--disabled')
  })
})

describe('SeneuCheckbox — error state', () => {
  it('applies .seneu-checkbox--error class when error is set', () => {
    const wrapper = mount(SeneuCheckbox, { props: { error: 'Required' } })
    expect(wrapper.find('.seneu-checkbox').classes()).toContain('seneu-checkbox--error')
  })

  it('shows error message text', () => {
    const wrapper = mount(SeneuCheckbox, { props: { error: 'You must agree' } })
    const msg = wrapper.find('.seneu-checkbox-field__message--error')
    expect(msg.exists()).toBe(true)
    expect(msg.text()).toContain('You must agree')
  })

  it('sets aria-invalid="true" on input when error', () => {
    const wrapper = mount(SeneuCheckbox, { props: { error: 'Bad' } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })
})

describe('SeneuCheckbox — hint', () => {
  it('shows hint message text', () => {
    const wrapper = mount(SeneuCheckbox, { props: { hint: 'Optional' } })
    expect(wrapper.find('.seneu-checkbox-field__message--hint').text()).toContain('Optional')
  })

  it('error takes priority over hint', () => {
    const wrapper = mount(SeneuCheckbox, { props: { hint: 'Hint', error: 'Error' } })
    expect(wrapper.find('.seneu-checkbox-field__message--error').exists()).toBe(true)
    expect(wrapper.find('.seneu-checkbox-field__message--hint').exists()).toBe(false)
  })
})
