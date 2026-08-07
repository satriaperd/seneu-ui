import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuBadge from '../components/display/SeneuBadge.vue'

describe('SeneuBadge — rendering', () => {
  it('renders slot content', () => {
    const wrapper = mount(SeneuBadge, { slots: { default: 'New' } })
    expect(wrapper.text()).toBe('New')
  })

  it('applies variant/type/size classes', () => {
    const wrapper = mount(SeneuBadge, { props: { variant: 'success', type: 'solid', size: 'sm' } })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['seneu-badge--success', 'seneu-badge--solid', 'seneu-badge--sm']),
    )
  })

  it('defaults to default/subtle/base', () => {
    const wrapper = mount(SeneuBadge)
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['seneu-badge--default', 'seneu-badge--subtle', 'seneu-badge--base']),
    )
  })
})

describe('SeneuBadge — dot', () => {
  it('does not render a dot by default', () => {
    const wrapper = mount(SeneuBadge, { slots: { default: 'x' } })
    expect(wrapper.find('.seneu-badge__dot').exists()).toBe(false)
  })

  it('renders a dot when dot is true', () => {
    const wrapper = mount(SeneuBadge, { props: { dot: true }, slots: { default: 'Online' } })
    expect(wrapper.find('.seneu-badge__dot').exists()).toBe(true)
  })

  it('applies the pulse class when pulse is true', () => {
    const wrapper = mount(SeneuBadge, { props: { dot: true, pulse: true } })
    expect(wrapper.find('.seneu-badge__dot').classes()).toContain('seneu-badge__dot--pulse')
  })
})

describe('SeneuBadge — icon', () => {
  it('renders the icon when provided', () => {
    const wrapper = mount(SeneuBadge, { props: { icon: 'check_circle' }, slots: { default: 'Verified' } })
    expect(wrapper.find('.seneu-badge__icon').exists()).toBe(true)
  })
})

describe('SeneuBadge — count mode', () => {
  it('renders the count instead of the slot when count is set', () => {
    const wrapper = mount(SeneuBadge, { props: { count: 5 }, slots: { default: 'ignored' } })
    expect(wrapper.text()).toBe('5')
  })

  it('caps the count at max with a "+" suffix', () => {
    const wrapper = mount(SeneuBadge, { props: { count: 150, max: 99 } })
    expect(wrapper.text()).toBe('99+')
  })

  it('does not cap a count equal to max', () => {
    const wrapper = mount(SeneuBadge, { props: { count: 99, max: 99 } })
    expect(wrapper.text()).toBe('99')
  })

  it('hides the badge when count is 0 and showZero is false', () => {
    const wrapper = mount(SeneuBadge, { props: { count: 0 } })
    expect(wrapper.find('.seneu-badge').exists()).toBe(false)
  })

  it('shows the badge when count is 0 and showZero is true', () => {
    const wrapper = mount(SeneuBadge, { props: { count: 0, showZero: true } })
    expect(wrapper.find('.seneu-badge').exists()).toBe(true)
    expect(wrapper.text()).toBe('0')
  })

  it('always shows when count is not set', () => {
    const wrapper = mount(SeneuBadge, { slots: { default: 'Label' } })
    expect(wrapper.find('.seneu-badge').exists()).toBe(true)
  })
})
