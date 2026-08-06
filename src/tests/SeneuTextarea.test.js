import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuTextarea from '../components/form/SeneuTextarea.vue'

describe('SeneuTextarea — rendering', () => {
  it('renders a <textarea> element', () => {
    const wrapper = mount(SeneuTextarea)
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('renders label when prop is set', () => {
    const wrapper = mount(SeneuTextarea, { props: { label: 'Bio' } })
    expect(wrapper.find('label').text()).toBe('Bio')
  })

  it('does not render label when prop is empty', () => {
    const wrapper = mount(SeneuTextarea)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('label for matches textarea id', () => {
    const wrapper = mount(SeneuTextarea, { props: { label: 'Notes', id: 'test-id' } })
    expect(wrapper.find('label').attributes('for')).toBe('test-id')
    expect(wrapper.find('textarea').attributes('id')).toBe('test-id')
  })

  it('applies rows prop', () => {
    const wrapper = mount(SeneuTextarea, { props: { rows: 6 } })
    expect(wrapper.find('textarea').attributes('rows')).toBe('6')
  })

  it('defaults to 4 rows', () => {
    const wrapper = mount(SeneuTextarea)
    expect(wrapper.find('textarea').attributes('rows')).toBe('4')
  })
})

describe('SeneuTextarea — v-model', () => {
  it('sets textarea value from modelValue prop', () => {
    const wrapper = mount(SeneuTextarea, { props: { modelValue: 'hello' } })
    expect(wrapper.find('textarea').element.value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(SeneuTextarea, { props: { modelValue: '' } })
    await wrapper.find('textarea').setValue('world')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world'])
  })
})

describe('SeneuTextarea — size', () => {
  const sizes = ['sm', 'base', 'lg']

  for (const size of sizes) {
    it(`applies .seneu-textarea--${size} class`, () => {
      const wrapper = mount(SeneuTextarea, { props: { size } })
      expect(wrapper.classes()).toContain(`seneu-textarea--${size}`)
    })
  }

  it('defaults to base size', () => {
    const wrapper = mount(SeneuTextarea)
    expect(wrapper.classes()).toContain('seneu-textarea--base')
  })
})

describe('SeneuTextarea — disabled', () => {
  it('sets disabled attribute on textarea', () => {
    const wrapper = mount(SeneuTextarea, { props: { disabled: true } })
    expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
  })

  it('applies .seneu-textarea--disabled class', () => {
    const wrapper = mount(SeneuTextarea, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('seneu-textarea--disabled')
  })
})

describe('SeneuTextarea — readonly', () => {
  it('sets readonly attribute on textarea', () => {
    const wrapper = mount(SeneuTextarea, { props: { readonly: true } })
    expect(wrapper.find('textarea').attributes('readonly')).toBeDefined()
  })

  it('applies .seneu-textarea--readonly class', () => {
    const wrapper = mount(SeneuTextarea, { props: { readonly: true } })
    expect(wrapper.classes()).toContain('seneu-textarea--readonly')
  })
})

describe('SeneuTextarea — error state', () => {
  it('applies .seneu-textarea--error class when error is set', () => {
    const wrapper = mount(SeneuTextarea, { props: { error: 'Invalid' } })
    expect(wrapper.classes()).toContain('seneu-textarea--error')
  })

  it('shows error message text', () => {
    const wrapper = mount(SeneuTextarea, { props: { error: 'Required field' } })
    const msg = wrapper.find('.seneu-textarea__message--error')
    expect(msg.exists()).toBe(true)
    expect(msg.text()).toContain('Required field')
  })

  it('sets aria-invalid="true" on textarea when error', () => {
    const wrapper = mount(SeneuTextarea, { props: { error: 'Bad value' } })
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
  })
})

describe('SeneuTextarea — hint', () => {
  it('shows hint message text', () => {
    const wrapper = mount(SeneuTextarea, { props: { hint: 'Min 8 chars' } })
    const msg = wrapper.find('.seneu-textarea__message--hint')
    expect(msg.exists()).toBe(true)
    expect(msg.text()).toContain('Min 8 chars')
  })

  it('error takes priority over hint', () => {
    const wrapper = mount(SeneuTextarea, { props: { hint: 'Hint', error: 'Error' } })
    expect(wrapper.find('.seneu-textarea__message--error').exists()).toBe(true)
    expect(wrapper.find('.seneu-textarea__message--hint').exists()).toBe(false)
  })

  it('links textarea to message via aria-describedby', () => {
    const wrapper = mount(SeneuTextarea, { props: { hint: 'Help text', id: 'f1' } })
    expect(wrapper.find('textarea').attributes('aria-describedby')).toBe('f1-desc')
    expect(wrapper.find('#f1-desc').exists()).toBe(true)
  })
})

describe('SeneuTextarea — loading', () => {
  it('shows spinner when loading is true', () => {
    const wrapper = mount(SeneuTextarea, { props: { loading: true } })
    expect(wrapper.find('.seneu-textarea__spinner').exists()).toBe(true)
  })

  it('does not show spinner by default', () => {
    const wrapper = mount(SeneuTextarea)
    expect(wrapper.find('.seneu-textarea__spinner').exists()).toBe(false)
  })

  it('applies .seneu-textarea--loading class when loading', () => {
    const wrapper = mount(SeneuTextarea, { props: { loading: true } })
    expect(wrapper.classes()).toContain('seneu-textarea--loading')
  })

  it('sets aria-busy="true" on textarea when loading', () => {
    const wrapper = mount(SeneuTextarea, { props: { loading: true } })
    expect(wrapper.find('textarea').attributes('aria-busy')).toBe('true')
  })
})

describe('SeneuTextarea — character counter', () => {
  it('does not show counter by default', () => {
    const wrapper = mount(SeneuTextarea, { props: { maxlength: 100 } })
    expect(wrapper.find('.seneu-textarea__counter').exists()).toBe(false)
  })

  it('shows counter when showCounter and maxlength are set', () => {
    const wrapper = mount(SeneuTextarea, { props: { modelValue: 'hello', maxlength: 100, showCounter: true } })
    const counter = wrapper.find('.seneu-textarea__counter')
    expect(counter.exists()).toBe(true)
    expect(counter.text()).toBe('5/100')
  })

  it('does not show counter when maxlength is 0, even with showCounter', () => {
    const wrapper = mount(SeneuTextarea, { props: { showCounter: true, maxlength: 0 } })
    expect(wrapper.find('.seneu-textarea__counter').exists()).toBe(false)
  })

  it('applies warn class when near limit', () => {
    const wrapper = mount(SeneuTextarea, {
      props: { modelValue: '123456789', maxlength: 10, showCounter: true },
    })
    expect(wrapper.find('.seneu-textarea__counter--warn').exists()).toBe(true)
  })

  it('sets maxlength attribute on textarea', () => {
    const wrapper = mount(SeneuTextarea, { props: { maxlength: 50 } })
    expect(wrapper.find('textarea').attributes('maxlength')).toBe('50')
  })
})

describe('SeneuTextarea — resize', () => {
  it('defaults to vertical resize', () => {
    const wrapper = mount(SeneuTextarea)
    expect(wrapper.find('textarea').attributes('style')).toContain('resize: vertical')
  })

  it('applies custom resize value', () => {
    const wrapper = mount(SeneuTextarea, { props: { resize: 'none' } })
    expect(wrapper.find('textarea').attributes('style')).toContain('resize: none')
  })
})
