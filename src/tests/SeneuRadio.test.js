import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuRadio from '../components/form/SeneuRadio.vue'

describe('SeneuRadio — rendering', () => {
  it('renders an <input type="radio">', () => {
    const wrapper = mount(SeneuRadio)
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('radio')
  })

  it('renders label text', () => {
    const wrapper = mount(SeneuRadio, { props: { label: 'Pro plan' } })
    expect(wrapper.find('.seneu-radio__label').text()).toBe('Pro plan')
  })

  it('renders slot content instead of label prop when provided', () => {
    const wrapper = mount(SeneuRadio, {
      props: { label: 'Ignored' },
      slots: { default: 'Custom label' },
    })
    expect(wrapper.find('.seneu-radio__label').text()).toBe('Custom label')
  })

  it('renders description when provided', () => {
    const wrapper = mount(SeneuRadio, { props: { label: 'Standard', description: '3-5 days' } })
    expect(wrapper.find('.seneu-radio__description').text()).toBe('3-5 days')
  })

  it('label for matches input id', () => {
    const wrapper = mount(SeneuRadio, { props: { id: 'test-id' } })
    expect(wrapper.find('label').attributes('for')).toBe('test-id')
    expect(wrapper.find('input').attributes('id')).toBe('test-id')
  })

  it('forwards the name attribute', () => {
    const wrapper = mount(SeneuRadio, { props: { name: 'plan' } })
    expect(wrapper.find('input').attributes('name')).toBe('plan')
  })
})

describe('SeneuRadio — v-model', () => {
  it('is checked when modelValue === value', () => {
    const wrapper = mount(SeneuRadio, { props: { modelValue: 'pro', value: 'pro' } })
    expect(wrapper.find('input').element.checked).toBe(true)
  })

  it('is unchecked when modelValue !== value', () => {
    const wrapper = mount(SeneuRadio, { props: { modelValue: 'free', value: 'pro' } })
    expect(wrapper.find('input').element.checked).toBe(false)
  })

  it('emits update:modelValue with value on change', async () => {
    const wrapper = mount(SeneuRadio, { props: { modelValue: 'free', value: 'pro' } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['pro'])
  })

  it('emits change event', async () => {
    const wrapper = mount(SeneuRadio, { props: { modelValue: 'free', value: 'pro' } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('change')).toBeTruthy()
  })
})

describe('SeneuRadio — size', () => {
  const sizes = ['sm', 'base', 'lg']

  for (const size of sizes) {
    it(`applies .seneu-radio--${size} class`, () => {
      const wrapper = mount(SeneuRadio, { props: { size } })
      expect(wrapper.find('.seneu-radio').classes()).toContain(`seneu-radio--${size}`)
    })
  }

  it('defaults to base size', () => {
    const wrapper = mount(SeneuRadio)
    expect(wrapper.find('.seneu-radio').classes()).toContain('seneu-radio--base')
  })
})

describe('SeneuRadio — disabled', () => {
  it('sets disabled attribute on input', () => {
    const wrapper = mount(SeneuRadio, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies .seneu-radio--disabled class', () => {
    const wrapper = mount(SeneuRadio, { props: { disabled: true } })
    expect(wrapper.find('.seneu-radio').classes()).toContain('seneu-radio--disabled')
  })
})

describe('SeneuRadio — error state', () => {
  it('applies .seneu-radio--error class when error is set', () => {
    const wrapper = mount(SeneuRadio, { props: { error: 'Unavailable' } })
    expect(wrapper.find('.seneu-radio').classes()).toContain('seneu-radio--error')
  })

  it('shows error message text', () => {
    const wrapper = mount(SeneuRadio, { props: { error: 'Region unavailable' } })
    const msg = wrapper.find('.seneu-radio-field__message--error')
    expect(msg.exists()).toBe(true)
    expect(msg.text()).toContain('Region unavailable')
  })

  it('sets aria-invalid="true" on input when error', () => {
    const wrapper = mount(SeneuRadio, { props: { error: 'Bad' } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })
})

describe('SeneuRadio — hint', () => {
  it('shows hint message text', () => {
    const wrapper = mount(SeneuRadio, { props: { hint: 'Fastest delivery' } })
    expect(wrapper.find('.seneu-radio-field__message--hint').text()).toContain('Fastest delivery')
  })

  it('error takes priority over hint', () => {
    const wrapper = mount(SeneuRadio, { props: { hint: 'Hint', error: 'Error' } })
    expect(wrapper.find('.seneu-radio-field__message--error').exists()).toBe(true)
    expect(wrapper.find('.seneu-radio-field__message--hint').exists()).toBe(false)
  })
})
