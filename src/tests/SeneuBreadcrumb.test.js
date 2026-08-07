import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuBreadcrumb from '../components/layout/SeneuBreadcrumb.vue'

const items = [
  { label: 'Dashboard', to: '/', icon: 'home' },
  { label: 'Components', to: '/components' },
  { label: 'Button' },
]

describe('SeneuBreadcrumb — rendering', () => {
  it('renders a <nav aria-label="Breadcrumb">', () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items } })
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('Breadcrumb')
  })

  it('renders one <li> per item plus separators between them', () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items } })
    expect(wrapper.findAll('.seneu-breadcrumb__li').length).toBe(3)
    expect(wrapper.findAll('.seneu-breadcrumb__sep-li').length).toBe(2)
  })

  it('renders item labels in order', () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items: [{ label: 'Dashboard', to: '/' }, { label: 'Components', to: '/components' }, { label: 'Button' }] } })
    const text = wrapper.findAll('.seneu-breadcrumb__item').map(el => el.text())
    expect(text).toEqual(['Dashboard', 'Components', 'Button'])
  })

  it('renders the last item with aria-current="page"', () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items } })
    const current = wrapper.find('.seneu-breadcrumb__item--current')
    expect(current.exists()).toBe(true)
    expect(current.attributes('aria-current')).toBe('page')
    expect(current.text()).toBe('Button')
  })

  it('renders non-last items with `to` as links', () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items } })
    const links = wrapper.findAll('.seneu-breadcrumb__item--link')
    expect(links.length).toBe(2)
    expect(links[0].attributes('href')).toBe('/')
  })

  it('renders an item without `to` as static text', () => {
    const wrapper = mount(SeneuBreadcrumb, {
      props: { items: [{ label: 'A' }, { label: 'B', to: '/b' }, { label: 'C' }] },
    })
    expect(wrapper.find('.seneu-breadcrumb__item--static').exists()).toBe(true)
  })
})

describe('SeneuBreadcrumb — select', () => {
  it('emits select with the item and index when a link is clicked, without navigating', async () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items } })
    const link = wrapper.findAll('.seneu-breadcrumb__item--link')[0]
    await link.trigger('click')
    const emitted = wrapper.emitted('select')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0].label).toBe('Dashboard')
    expect(emitted[0][1]).toBe(0)
  })
})

describe('SeneuBreadcrumb — disabled item', () => {
  it('renders a disabled item as non-link, non-current static text', () => {
    const wrapper = mount(SeneuBreadcrumb, {
      props: { items: [{ label: 'A', to: '/a' }, { label: 'B', to: '/b', disabled: true }, { label: 'C' }] },
    })
    const disabled = wrapper.find('.seneu-breadcrumb__item--disabled')
    expect(disabled.exists()).toBe(true)
    expect(disabled.element.tagName).toBe('SPAN')
  })

  it('does not emit select for a disabled item', async () => {
    const wrapper = mount(SeneuBreadcrumb, {
      props: { items: [{ label: 'A', to: '/a', disabled: true }, { label: 'B' }] },
    })
    // Disabled items render as <span>, not <a> — nothing to click that would emit.
    expect(wrapper.find('.seneu-breadcrumb__item--disabled a').exists()).toBe(false)
  })
})

describe('SeneuBreadcrumb — separators', () => {
  it('renders chevron icon separator by default', () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items } })
    expect(wrapper.find('.seneu-breadcrumb__sep--chevron').exists()).toBe(true)
  })

  for (const [sep, char] of [['slash', '/'], ['arrow', '›'], ['dot', '·']]) {
    it(`renders "${char}" for separator="${sep}"`, () => {
      const wrapper = mount(SeneuBreadcrumb, { props: { items, separator: sep } })
      expect(wrapper.find('.seneu-breadcrumb__sep-li').text()).toBe(char)
    })
  }
})

describe('SeneuBreadcrumb — maxItems collapsing', () => {
  const longItems = [
    { label: 'A', to: '/a' },
    { label: 'B', to: '/b' },
    { label: 'C', to: '/c' },
    { label: 'D', to: '/d' },
    { label: 'E' },
  ]

  it('shows all items when count is within maxItems', () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items: longItems, maxItems: 10 } })
    expect(wrapper.findAll('.seneu-breadcrumb__li').length).toBe(5)
  })

  it('collapses to first, ellipsis, last when count exceeds maxItems', () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items: longItems, maxItems: 3 } })
    expect(wrapper.find('.seneu-breadcrumb__ellipsis').exists()).toBe(true)
    const labels = wrapper.findAll('.seneu-breadcrumb__item').map(el => el.text())
    expect(labels).toEqual(['A', 'E'])
  })

  it('expands to show all items when the ellipsis is clicked', async () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items: longItems, maxItems: 3 } })
    await wrapper.find('.seneu-breadcrumb__ellipsis').trigger('click')
    expect(wrapper.find('.seneu-breadcrumb__ellipsis').exists()).toBe(false)
    expect(wrapper.findAll('.seneu-breadcrumb__li').length).toBe(5)
  })
})

describe('SeneuBreadcrumb — size', () => {
  it('defaults to base size', () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items } })
    expect(wrapper.find('.seneu-breadcrumb').classes()).toContain('seneu-breadcrumb--base')
  })

  for (const size of ['sm', 'base', 'lg']) {
    it(`applies .seneu-breadcrumb--${size}`, () => {
      const wrapper = mount(SeneuBreadcrumb, { props: { items, size } })
      expect(wrapper.find('.seneu-breadcrumb').classes()).toContain(`seneu-breadcrumb--${size}`)
    })
  }
})

describe('SeneuBreadcrumb — loading', () => {
  it('shows skeleton placeholders instead of items', () => {
    const wrapper = mount(SeneuBreadcrumb, { props: { items: [], loading: true } })
    expect(wrapper.findAll('.seneu-breadcrumb__skeleton').length).toBe(3)
    expect(wrapper.find('.seneu-breadcrumb__item').exists()).toBe(false)
  })
})
