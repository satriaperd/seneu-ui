import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuStatCard from '../components/display/SeneuStatCard.vue'

describe('SeneuStatCard — rendering', () => {
  it('renders label and value', () => {
    const wrapper = mount(SeneuStatCard, { props: { label: 'Total Revenue', value: '$48,290' } })
    expect(wrapper.find('.seneu-stat-card__label').text()).toBe('Total Revenue')
    expect(wrapper.find('.seneu-stat-card__value').text()).toBe('$48,290')
  })

  it('defaults value to an em dash', () => {
    const wrapper = mount(SeneuStatCard)
    expect(wrapper.find('.seneu-stat-card__value').text()).toBe('—')
  })

  it('does not render an icon badge when icon is not provided', () => {
    const wrapper = mount(SeneuStatCard, { props: { label: 'x', value: 1 } })
    expect(wrapper.find('.seneu-stat-card__icon-wrap').exists()).toBe(false)
  })

  it('renders an icon badge with the variant modifier class', () => {
    const wrapper = mount(SeneuStatCard, { props: { icon: 'payments', variant: 'success' } })
    expect(wrapper.find('.seneu-stat-card__icon-wrap--success').exists()).toBe(true)
  })
})

describe('SeneuStatCard — trend', () => {
  it('does not render a trend row when change is not provided', () => {
    const wrapper = mount(SeneuStatCard, { props: { label: 'x', value: 1 } })
    expect(wrapper.find('.seneu-stat-card__change').exists()).toBe(false)
  })

  it('renders an "up" trend for positive change', () => {
    const wrapper = mount(SeneuStatCard, { props: { change: 12.4 } })
    const change = wrapper.find('.seneu-stat-card__change')
    expect(change.classes()).toContain('seneu-stat-card__change--up')
    expect(change.text()).toContain('+12.4%')
  })

  it('renders a "down" trend for negative change', () => {
    const wrapper = mount(SeneuStatCard, { props: { change: -4.1 } })
    const change = wrapper.find('.seneu-stat-card__change')
    expect(change.classes()).toContain('seneu-stat-card__change--down')
    expect(change.text()).toContain('−4.1%')
  })

  it('renders a "flat" trend for zero change', () => {
    const wrapper = mount(SeneuStatCard, { props: { change: 0 } })
    expect(wrapper.find('.seneu-stat-card__change--flat').exists()).toBe(true)
  })

  it('renders the change period when provided', () => {
    const wrapper = mount(SeneuStatCard, { props: { change: 5, changePeriod: 'vs last month' } })
    expect(wrapper.find('.seneu-stat-card__period').text()).toBe('vs last month')
  })
})

describe('SeneuStatCard — slots and modifiers', () => {
  it('renders the default slot as extra content', () => {
    const wrapper = mount(SeneuStatCard, { slots: { default: '<div class="spark">chart</div>' } })
    expect(wrapper.find('.seneu-stat-card__extra .spark').exists()).toBe(true)
  })

  it('applies the hoverable modifier class', () => {
    const wrapper = mount(SeneuStatCard, { props: { hoverable: true } })
    expect(wrapper.classes()).toContain('seneu-stat-card--hoverable')
  })
})

describe('SeneuStatCard — loading', () => {
  it('shows skeletons and hides content when loading', () => {
    const wrapper = mount(SeneuStatCard, { props: { loading: true, label: 'Total', value: '99' } })
    expect(wrapper.findAll('.seneu-skeleton').length).toBeGreaterThan(0)
    expect(wrapper.find('.seneu-stat-card__label').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Total')
  })
})
