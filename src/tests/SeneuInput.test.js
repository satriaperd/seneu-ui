import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuInput from '../components/form/SeneuInput.vue'

describe('SeneuInput — rendering', () => {
  it('renders an <input> element', () => {
    const wrapper = mount(SeneuInput)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders label when prop is set', () => {
    const wrapper = mount(SeneuInput, { props: { label: 'Full name' } })
    expect(wrapper.find('label').text()).toBe('Full name')
  })

  it('does not render label when prop is empty', () => {
    const wrapper = mount(SeneuInput)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('label for matches input id', () => {
    const wrapper = mount(SeneuInput, { props: { label: 'Name', id: 'test-id' } })
    expect(wrapper.find('label').attributes('for')).toBe('test-id')
    expect(wrapper.find('input').attributes('id')).toBe('test-id')
  })
})

describe('SeneuInput — v-model', () => {
  it('sets input value from modelValue prop', () => {
    const wrapper = mount(SeneuInput, { props: { modelValue: 'hello' } })
    expect(wrapper.find('input').element.value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(SeneuInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('world')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world'])
  })
})

describe('SeneuInput — type', () => {
  it('defaults to type="text"', () => {
    const wrapper = mount(SeneuInput)
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('forwards type prop', () => {
    const wrapper = mount(SeneuInput, { props: { type: 'email' } })
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })
})

describe('SeneuInput — size', () => {
  const sizes = ['sm', 'base', 'lg']

  for (const size of sizes) {
    it(`applies .seneu-input--${size} class`, () => {
      const wrapper = mount(SeneuInput, { props: { size } })
      expect(wrapper.classes()).toContain(`seneu-input--${size}`)
    })
  }

  it('defaults to base size', () => {
    const wrapper = mount(SeneuInput)
    expect(wrapper.classes()).toContain('seneu-input--base')
  })
})

describe('SeneuInput — disabled', () => {
  it('sets disabled attribute on input', () => {
    const wrapper = mount(SeneuInput, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies .seneu-input--disabled class', () => {
    const wrapper = mount(SeneuInput, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('seneu-input--disabled')
  })

  it('does not set disabled by default', () => {
    const wrapper = mount(SeneuInput)
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
  })
})

describe('SeneuInput — readonly', () => {
  it('sets readonly attribute on input', () => {
    const wrapper = mount(SeneuInput, { props: { readonly: true } })
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('applies .seneu-input--readonly class', () => {
    const wrapper = mount(SeneuInput, { props: { readonly: true } })
    expect(wrapper.classes()).toContain('seneu-input--readonly')
  })
})

describe('SeneuInput — error state', () => {
  it('applies .seneu-input--error class when error is set', () => {
    const wrapper = mount(SeneuInput, { props: { error: 'Invalid email' } })
    expect(wrapper.classes()).toContain('seneu-input--error')
  })

  it('shows error message text', () => {
    const wrapper = mount(SeneuInput, { props: { error: 'Required field' } })
    const msg = wrapper.find('.seneu-input__message--error')
    expect(msg.exists()).toBe(true)
    expect(msg.text()).toContain('Required field')
  })

  it('sets aria-invalid="true" on input when error', () => {
    const wrapper = mount(SeneuInput, { props: { error: 'Bad value' } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('does not set aria-invalid when no error', () => {
    const wrapper = mount(SeneuInput)
    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
  })
})

describe('SeneuInput — hint', () => {
  it('shows hint message text', () => {
    const wrapper = mount(SeneuInput, { props: { hint: 'Min 8 chars' } })
    const msg = wrapper.find('.seneu-input__message--hint')
    expect(msg.exists()).toBe(true)
    expect(msg.text()).toContain('Min 8 chars')
  })

  it('error takes priority over hint', () => {
    const wrapper = mount(SeneuInput, { props: { hint: 'Hint', error: 'Error' } })
    expect(wrapper.find('.seneu-input__message--error').exists()).toBe(true)
    expect(wrapper.find('.seneu-input__message--hint').exists()).toBe(false)
  })

  it('links input to message via aria-describedby', () => {
    const wrapper = mount(SeneuInput, { props: { hint: 'Help text', id: 'f1' } })
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('f1-desc')
    expect(wrapper.find('#f1-desc').exists()).toBe(true)
  })
})

describe('SeneuInput — icons', () => {
  it('renders left icon when icon prop is set', () => {
    const wrapper = mount(SeneuInput, { props: { icon: 'search' } })
    expect(wrapper.find('.seneu-input__icon--left').exists()).toBe(true)
  })

  it('does not render left icon by default', () => {
    const wrapper = mount(SeneuInput)
    expect(wrapper.find('.seneu-input__icon--left').exists()).toBe(false)
  })

  it('renders right icon when iconRight prop is set and no clearable/password', () => {
    const wrapper = mount(SeneuInput, { props: { iconRight: 'verified' } })
    expect(wrapper.find('.seneu-input__icon--right').exists()).toBe(true)
  })
})

describe('SeneuInput — clearable', () => {
  it('shows clear button when clearable=true and value is non-empty', () => {
    const wrapper = mount(SeneuInput, { props: { clearable: true, modelValue: 'hello' } })
    expect(wrapper.find('.seneu-input__action-btn').exists()).toBe(true)
    expect(wrapper.find('.seneu-input__action-btn').attributes('aria-label')).toBe('Clear input')
  })

  it('does not show clear button when value is empty', () => {
    const wrapper = mount(SeneuInput, { props: { clearable: true, modelValue: '' } })
    expect(wrapper.find('.seneu-input__action-btn').exists()).toBe(false)
  })

  it('emits update:modelValue with empty string and clear event on clear click', async () => {
    const wrapper = mount(SeneuInput, { props: { clearable: true, modelValue: 'hello' } })
    await wrapper.find('.seneu-input__action-btn').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toBeTruthy()
  })
})

describe('SeneuInput — loading', () => {
  it('shows spinner when loading is true', () => {
    const wrapper = mount(SeneuInput, { props: { loading: true } })
    expect(wrapper.find('.seneu-input__spinner').exists()).toBe(true)
  })

  it('does not show spinner by default', () => {
    const wrapper = mount(SeneuInput)
    expect(wrapper.find('.seneu-input__spinner').exists()).toBe(false)
  })

  it('applies .seneu-input--loading class when loading', () => {
    const wrapper = mount(SeneuInput, { props: { loading: true } })
    expect(wrapper.classes()).toContain('seneu-input--loading')
  })

  it('sets aria-busy="true" on input when loading', () => {
    const wrapper = mount(SeneuInput, { props: { loading: true } })
    expect(wrapper.find('input').attributes('aria-busy')).toBe('true')
  })

  it('hides clear button in favor of spinner when loading', () => {
    const wrapper = mount(SeneuInput, { props: { loading: true, clearable: true, modelValue: 'hello' } })
    expect(wrapper.find('.seneu-input__spinner').exists()).toBe(true)
    expect(wrapper.find('.seneu-input__action-btn').exists()).toBe(false)
  })

  it('hides password toggle in favor of spinner when loading', () => {
    const wrapper = mount(SeneuInput, { props: { loading: true, type: 'password' } })
    expect(wrapper.find('.seneu-input__spinner').exists()).toBe(true)
    expect(wrapper.find('.seneu-input__action-btn').exists()).toBe(false)
  })
})

describe('SeneuInput — keyboard accessibility', () => {
  it('clear button is keyboard-focusable (no tabindex="-1")', () => {
    const wrapper = mount(SeneuInput, { props: { clearable: true, modelValue: 'hello' } })
    expect(wrapper.find('.seneu-input__action-btn').attributes('tabindex')).toBeUndefined()
  })

  it('password toggle button is keyboard-focusable (no tabindex="-1")', () => {
    const wrapper = mount(SeneuInput, { props: { type: 'password' } })
    expect(wrapper.find('.seneu-input__action-btn').attributes('tabindex')).toBeUndefined()
  })
})

describe('SeneuInput — password toggle', () => {
  it('renders visibility toggle button for type=password', () => {
    const wrapper = mount(SeneuInput, { props: { type: 'password' } })
    expect(wrapper.find('.seneu-input__action-btn').exists()).toBe(true)
  })

  it('starts with type=password (hidden)', () => {
    const wrapper = mount(SeneuInput, { props: { type: 'password' } })
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('toggles to type=text on button click', async () => {
    const wrapper = mount(SeneuInput, { props: { type: 'password' } })
    await wrapper.find('.seneu-input__action-btn').trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('toggles back to password on second click', async () => {
    const wrapper = mount(SeneuInput, { props: { type: 'password' } })
    const btn = wrapper.find('.seneu-input__action-btn')
    await btn.trigger('click')
    await btn.trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('password toggle button has correct aria-label', () => {
    const wrapper = mount(SeneuInput, { props: { type: 'password' } })
    expect(wrapper.find('.seneu-input__action-btn').attributes('aria-label')).toBe('Show password')
  })
})
