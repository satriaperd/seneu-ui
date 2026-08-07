import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuEmptyState from '../components/display/SeneuEmptyState.vue'

describe('SeneuEmptyState — rendering', () => {
  it('renders title and description', () => {
    const wrapper = mount(SeneuEmptyState, {
      props: { title: 'No data', description: 'Nothing here yet.' },
    })
    expect(wrapper.find('.seneu-empty-state__title').text()).toBe('No data')
    expect(wrapper.find('.seneu-empty-state__desc').text()).toBe('Nothing here yet.')
  })

  it('does not render title/description elements when not provided', () => {
    const wrapper = mount(SeneuEmptyState)
    expect(wrapper.find('.seneu-empty-state__title').exists()).toBe(false)
    expect(wrapper.find('.seneu-empty-state__desc').exists()).toBe(false)
  })

  it('renders the default icon via SeneuIcon', () => {
    const wrapper = mount(SeneuEmptyState)
    const icon = wrapper.find('.seneu-empty-state__icon')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('inbox')
  })

  it('renders a custom icon name', () => {
    const wrapper = mount(SeneuEmptyState, { props: { icon: 'search_off' } })
    expect(wrapper.find('.seneu-empty-state__icon').text()).toBe('search_off')
  })
})

describe('SeneuEmptyState — slots', () => {
  it('renders custom icon slot content instead of the default icon', () => {
    const wrapper = mount(SeneuEmptyState, {
      slots: { icon: '<span class="custom-icon">★</span>' },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.seneu-empty-state__icon').exists()).toBe(false)
  })

  it('does not render the actions wrapper when the actions slot is unused', () => {
    const wrapper = mount(SeneuEmptyState)
    expect(wrapper.find('.seneu-empty-state__actions').exists()).toBe(false)
  })

  it('renders the actions slot when provided', () => {
    const wrapper = mount(SeneuEmptyState, {
      slots: { actions: '<button class="my-action">Retry</button>' },
    })
    expect(wrapper.find('.seneu-empty-state__actions .my-action').exists()).toBe(true)
  })
})

describe('SeneuEmptyState — size', () => {
  it('defaults to base size', () => {
    const wrapper = mount(SeneuEmptyState)
    expect(wrapper.classes()).toContain('seneu-empty-state--base')
  })

  it('applies the size modifier class', () => {
    const wrapper = mount(SeneuEmptyState, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('seneu-empty-state--lg')
  })
})
