import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuProgressBar from '../components/feedback/SeneuProgressBar.vue'

describe('SeneuProgressBar — value/fill', () => {
  it('sets the fill width from value/max', () => {
    const wrapper = mount(SeneuProgressBar, { props: { value: 50, max: 100 } })
    expect(wrapper.find('.seneu-progress__fill').attributes('style')).toContain('width: 50%')
  })

  it('computes percentage relative to a custom max', () => {
    const wrapper = mount(SeneuProgressBar, { props: { value: 5, max: 10 } })
    expect(wrapper.find('.seneu-progress__fill').attributes('style')).toContain('width: 50%')
  })

  it('clamps value above max to 100%', () => {
    const wrapper = mount(SeneuProgressBar, { props: { value: 150, max: 100 } })
    expect(wrapper.find('.seneu-progress__fill').attributes('style')).toContain('width: 100%')
  })

  it('clamps negative value to 0%', () => {
    const wrapper = mount(SeneuProgressBar, { props: { value: -20 } })
    expect(wrapper.find('.seneu-progress__fill').attributes('style')).toContain('width: 0%')
  })
})

describe('SeneuProgressBar — value label', () => {
  it('does not render the value label by default', () => {
    const wrapper = mount(SeneuProgressBar, { props: { value: 40 } })
    expect(wrapper.find('.seneu-progress__value').exists()).toBe(false)
  })

  it('renders the clamped value when showValue is true', () => {
    const wrapper = mount(SeneuProgressBar, { props: { value: 150, showValue: true } })
    expect(wrapper.find('.seneu-progress__value').text()).toBe('100%')
  })

  it('hides the value label in indeterminate mode even if showValue is true', () => {
    const wrapper = mount(SeneuProgressBar, { props: { showValue: true, indeterminate: true } })
    expect(wrapper.find('.seneu-progress__value').exists()).toBe(false)
  })
})

describe('SeneuProgressBar — modifiers', () => {
  it('applies size and variant modifier classes', () => {
    const wrapper = mount(SeneuProgressBar, { props: { size: 'lg', variant: 'danger' } })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['seneu-progress--lg', 'seneu-progress--danger']),
    )
  })

  it('applies striped and animated modifier classes together', () => {
    const wrapper = mount(SeneuProgressBar, { props: { striped: true, animated: true } })
    expect(wrapper.classes()).toContain('seneu-progress--striped')
    expect(wrapper.classes()).toContain('seneu-progress--animated')
  })

  it('does not apply the animated class without striped', () => {
    const wrapper = mount(SeneuProgressBar, { props: { animated: true } })
    expect(wrapper.classes()).not.toContain('seneu-progress--animated')
  })

  it('applies the indeterminate fill modifier and omits inline width', () => {
    const wrapper = mount(SeneuProgressBar, { props: { indeterminate: true } })
    const fill = wrapper.find('.seneu-progress__fill')
    expect(fill.classes()).toContain('seneu-progress__fill--indeterminate')
    expect(fill.attributes('style')).toBeUndefined()
  })
})

describe('SeneuProgressBar — accessibility', () => {
  it('has role="progressbar" with valuenow/min/max', () => {
    const wrapper = mount(SeneuProgressBar, { props: { value: 30, max: 100 } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('30')
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('100')
  })

  it('omits aria-valuenow/min/max in indeterminate mode', () => {
    const wrapper = mount(SeneuProgressBar, { props: { indeterminate: true } })
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.attributes('aria-valuemin')).toBeUndefined()
    expect(wrapper.attributes('aria-valuemax')).toBeUndefined()
  })

  it('defaults aria-label to the percentage when determinate', () => {
    const wrapper = mount(SeneuProgressBar, { props: { value: 42 } })
    expect(wrapper.attributes('aria-label')).toBe('42%')
  })

  it('defaults aria-label to "Loading" when indeterminate', () => {
    const wrapper = mount(SeneuProgressBar, { props: { indeterminate: true } })
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('uses the label prop as the aria-label when provided', () => {
    const wrapper = mount(SeneuProgressBar, { props: { value: 10, label: 'Uploading file' } })
    expect(wrapper.attributes('aria-label')).toBe('Uploading file')
  })
})
