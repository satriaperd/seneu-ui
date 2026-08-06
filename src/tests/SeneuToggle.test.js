import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuToggle from '../components/form/SeneuToggle.vue'

describe('SeneuToggle — rendering', () => {
  it('renders an <input type="checkbox"> with role="switch"', () => {
    const wrapper = mount(SeneuToggle)
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('checkbox')
    expect(input.attributes('role')).toBe('switch')
  })

  it('renders label text', () => {
    const wrapper = mount(SeneuToggle, { props: { label: 'Notifications' } })
    expect(wrapper.find('.seneu-toggle__label').text()).toBe('Notifications')
  })

  it('renders slot content instead of label prop when provided', () => {
    const wrapper = mount(SeneuToggle, {
      props: { label: 'Ignored' },
      slots: { default: 'Custom label' },
    })
    expect(wrapper.find('.seneu-toggle__label').text()).toBe('Custom label')
  })

  it('renders description when provided', () => {
    const wrapper = mount(SeneuToggle, { props: { label: '2FA', description: 'Extra security layer' } })
    expect(wrapper.find('.seneu-toggle__description').text()).toBe('Extra security layer')
  })

  it('label for matches input id', () => {
    const wrapper = mount(SeneuToggle, { props: { id: 'test-id' } })
    expect(wrapper.find('label').attributes('for')).toBe('test-id')
    expect(wrapper.find('input').attributes('id')).toBe('test-id')
  })
})

describe('SeneuToggle — v-model', () => {
  it('reflects modelValue as checked', () => {
    const wrapper = mount(SeneuToggle, { props: { modelValue: true } })
    expect(wrapper.find('input').element.checked).toBe(true)
  })

  it('emits update:modelValue with boolean on change', async () => {
    const wrapper = mount(SeneuToggle, { props: { modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emits change event', async () => {
    const wrapper = mount(SeneuToggle, { props: { modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('change')).toBeTruthy()
  })
})

describe('SeneuToggle — reverse', () => {
  it('applies .seneu-toggle--reverse class when reverse is true', () => {
    const wrapper = mount(SeneuToggle, { props: { reverse: true } })
    expect(wrapper.find('.seneu-toggle').classes()).toContain('seneu-toggle--reverse')
  })

  it('does not apply reverse class by default', () => {
    const wrapper = mount(SeneuToggle)
    expect(wrapper.find('.seneu-toggle').classes()).not.toContain('seneu-toggle--reverse')
  })
})

describe('SeneuToggle — size', () => {
  const sizes = ['sm', 'base', 'lg']

  for (const size of sizes) {
    it(`applies .seneu-toggle--${size} class`, () => {
      const wrapper = mount(SeneuToggle, { props: { size } })
      expect(wrapper.find('.seneu-toggle').classes()).toContain(`seneu-toggle--${size}`)
    })
  }

  it('defaults to base size', () => {
    const wrapper = mount(SeneuToggle)
    expect(wrapper.find('.seneu-toggle').classes()).toContain('seneu-toggle--base')
  })
})

describe('SeneuToggle — disabled', () => {
  it('sets disabled attribute on input', () => {
    const wrapper = mount(SeneuToggle, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies .seneu-toggle--disabled class', () => {
    const wrapper = mount(SeneuToggle, { props: { disabled: true } })
    expect(wrapper.find('.seneu-toggle').classes()).toContain('seneu-toggle--disabled')
  })
})

describe('SeneuToggle — error state', () => {
  it('applies .seneu-toggle--error class when error is set', () => {
    const wrapper = mount(SeneuToggle, { props: { error: 'Unavailable' } })
    expect(wrapper.find('.seneu-toggle').classes()).toContain('seneu-toggle--error')
  })

  it('shows error message text', () => {
    const wrapper = mount(SeneuToggle, { props: { error: 'Under maintenance' } })
    const msg = wrapper.find('.seneu-toggle-field__message--error')
    expect(msg.exists()).toBe(true)
    expect(msg.text()).toContain('Under maintenance')
  })

  it('sets aria-invalid="true" on input when error', () => {
    const wrapper = mount(SeneuToggle, { props: { error: 'Bad' } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })
})

describe('SeneuToggle — hint', () => {
  it('shows hint message text', () => {
    const wrapper = mount(SeneuToggle, { props: { hint: 'Sent every Monday' } })
    expect(wrapper.find('.seneu-toggle-field__message--hint').text()).toContain('Sent every Monday')
  })

  it('error takes priority over hint', () => {
    const wrapper = mount(SeneuToggle, { props: { hint: 'Hint', error: 'Error' } })
    expect(wrapper.find('.seneu-toggle-field__message--error').exists()).toBe(true)
    expect(wrapper.find('.seneu-toggle-field__message--hint').exists()).toBe(false)
  })
})

describe('SeneuToggle — loading', () => {
  it('shows spinner when loading is true', () => {
    const wrapper = mount(SeneuToggle, { props: { loading: true } })
    expect(wrapper.find('.seneu-toggle__spinner').exists()).toBe(true)
  })

  it('disables input while loading', () => {
    const wrapper = mount(SeneuToggle, { props: { loading: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('sets aria-busy="true" when loading', () => {
    const wrapper = mount(SeneuToggle, { props: { loading: true } })
    expect(wrapper.find('input').attributes('aria-busy')).toBe('true')
  })
})
