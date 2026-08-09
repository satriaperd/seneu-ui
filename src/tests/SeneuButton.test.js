import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuButton from '../components/form/SeneuButton.vue'

describe('SeneuButton — rendering', () => {
  it('renders a <button> element', () => {
    const wrapper = mount(SeneuButton, { slots: { default: 'Click me' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('renders slot content', () => {
    const wrapper = mount(SeneuButton, { slots: { default: 'Save' } })
    expect(wrapper.text()).toContain('Save')
  })

  it('has type="button" by default', () => {
    const wrapper = mount(SeneuButton, { slots: { default: 'x' } })
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('forwards custom type prop', () => {
    const wrapper = mount(SeneuButton, { props: { type: 'submit' }, slots: { default: 'x' } })
    expect(wrapper.attributes('type')).toBe('submit')
  })
})

describe('SeneuButton — events', () => {
  it('emits click when clicked', async () => {
    const wrapper = mount(SeneuButton, { slots: { default: 'x' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('passes the native event through the click emit', async () => {
    const wrapper = mount(SeneuButton, { slots: { default: 'x' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')[0][0]).toBeInstanceOf(Event)
  })

  it('does not fire a click on a disabled button', async () => {
    const wrapper = mount(SeneuButton, { props: { disabled: true }, slots: { default: 'x' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})

describe('SeneuButton — variants', () => {
  const variants = ['default', 'brand', 'danger', 'success', 'warning', 'info']

  for (const variant of variants) {
    it(`applies .seneu-btn--${variant} class`, () => {
      const wrapper = mount(SeneuButton, { props: { variant }, slots: { default: 'x' } })
      expect(wrapper.classes()).toContain(`seneu-btn--${variant}`)
    })
  }
})

describe('SeneuButton — sizes', () => {
  const sizes = ['sm', 'base', 'lg']

  for (const size of sizes) {
    it(`applies .seneu-btn--${size} class`, () => {
      const wrapper = mount(SeneuButton, { props: { size }, slots: { default: 'x' } })
      expect(wrapper.classes()).toContain(`seneu-btn--${size}`)
    })
  }

  it('defaults to base size', () => {
    const wrapper = mount(SeneuButton, { slots: { default: 'x' } })
    expect(wrapper.classes()).toContain('seneu-btn--base')
  })
})

describe('SeneuButton — disabled', () => {
  it('has disabled attribute when disabled=true', () => {
    const wrapper = mount(SeneuButton, { props: { disabled: true }, slots: { default: 'x' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('does not have disabled attribute by default', () => {
    const wrapper = mount(SeneuButton, { slots: { default: 'x' } })
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })
})

describe('SeneuButton — loading', () => {
  it('has disabled attribute when loading=true', () => {
    const wrapper = mount(SeneuButton, { props: { loading: true }, slots: { default: 'x' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('has aria-busy="true" when loading', () => {
    const wrapper = mount(SeneuButton, { props: { loading: true }, slots: { default: 'x' } })
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('applies .seneu-btn--loading class', () => {
    const wrapper = mount(SeneuButton, { props: { loading: true }, slots: { default: 'x' } })
    expect(wrapper.classes()).toContain('seneu-btn--loading')
  })

  it('shows spinner icon when loading', () => {
    const wrapper = mount(SeneuButton, { props: { loading: true }, slots: { default: 'x' } })
    const spinner = wrapper.find('.seneu-btn__spinner')
    expect(spinner.exists()).toBe(true)
  })

  it('does not show icon prop when loading (spinner replaces it)', () => {
    const wrapper = mount(SeneuButton, { props: { loading: true, icon: 'add' }, slots: { default: 'x' } })
    const spinner = wrapper.find('.seneu-btn__spinner')
    expect(spinner.exists()).toBe(true)
    // spinner should have progress_activity, not 'add'
    expect(spinner.text()).toBe('progress_activity')
  })
})

describe('SeneuButton — icons', () => {
  it('renders left icon when icon prop is set', () => {
    const wrapper = mount(SeneuButton, { props: { icon: 'add' }, slots: { default: 'New' } })
    const icons = wrapper.findAll('.seneu-icon')
    expect(icons.some(i => i.text() === 'add')).toBe(true)
  })

  it('renders right icon when iconRight prop is set', () => {
    const wrapper = mount(SeneuButton, { props: { iconRight: 'chevron_right' }, slots: { default: 'Next' } })
    const icons = wrapper.findAll('.seneu-icon')
    expect(icons.some(i => i.text() === 'chevron_right')).toBe(true)
  })

  it('applies .seneu-btn--icon-only class when iconOnly=true', () => {
    const wrapper = mount(SeneuButton, { props: { icon: 'settings', iconOnly: true } })
    expect(wrapper.classes()).toContain('seneu-btn--icon-only')
  })

  it('does not render label span when iconOnly=true', () => {
    const wrapper = mount(SeneuButton, { props: { icon: 'settings', iconOnly: true } })
    expect(wrapper.find('.seneu-btn__label').exists()).toBe(false)
  })
})

describe('SeneuButton — accessibility', () => {
  it('has aria-label for loading icon-only button', () => {
    const wrapper = mount(SeneuButton, { props: { icon: 'add', iconOnly: true, loading: true } })
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('does not have aria-busy when not loading', () => {
    const wrapper = mount(SeneuButton, { slots: { default: 'x' } })
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })
})
