import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuSpinner from '../components/feedback/SeneuSpinner.vue'

describe('SeneuSpinner — rendering', () => {
  it('renders the ring', () => {
    const wrapper = mount(SeneuSpinner)
    expect(wrapper.find('.seneu-spinner__ring').exists()).toBe(true)
  })

  it('applies size and variant modifier classes', () => {
    const wrapper = mount(SeneuSpinner, { props: { size: 'lg', variant: 'success' } })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['seneu-spinner--lg', 'seneu-spinner--success']),
    )
  })

  it('defaults to base size and default variant', () => {
    const wrapper = mount(SeneuSpinner)
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['seneu-spinner--base', 'seneu-spinner--default']),
    )
  })
})

describe('SeneuSpinner — label', () => {
  it('does not render a label by default', () => {
    const wrapper = mount(SeneuSpinner)
    expect(wrapper.find('.seneu-spinner__label').exists()).toBe(false)
  })

  it('renders the label text when provided', () => {
    const wrapper = mount(SeneuSpinner, { props: { label: 'Loading data...' } })
    expect(wrapper.find('.seneu-spinner__label').text()).toBe('Loading data...')
  })
})

describe('SeneuSpinner — accessibility', () => {
  it('has role="status"', () => {
    const wrapper = mount(SeneuSpinner)
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('defaults aria-label to "Loading"', () => {
    const wrapper = mount(SeneuSpinner)
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('uses the label prop as the aria-label when provided', () => {
    const wrapper = mount(SeneuSpinner, { props: { label: 'Uploading...' } })
    expect(wrapper.attributes('aria-label')).toBe('Uploading...')
  })

  it('hides the decorative ring from assistive tech', () => {
    const wrapper = mount(SeneuSpinner)
    expect(wrapper.find('.seneu-spinner__ring').attributes('aria-hidden')).toBe('true')
  })
})
