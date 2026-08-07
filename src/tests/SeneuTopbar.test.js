import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuTopbar from '../components/layout/SeneuTopbar.vue'

describe('SeneuTopbar — rendering', () => {
  it('renders a <header>', () => {
    const wrapper = mount(SeneuTopbar)
    expect(wrapper.find('header.seneu-topbar').exists()).toBe(true)
  })

  it('renders the title', () => {
    const wrapper = mount(SeneuTopbar, { props: { title: 'Dashboard' } })
    expect(wrapper.find('.seneu-topbar__title').text()).toBe('Dashboard')
  })

  it('renders the section prefix and separator when provided', () => {
    const wrapper = mount(SeneuTopbar, { props: { section: 'Components', title: 'Button' } })
    expect(wrapper.find('.seneu-topbar__section').text()).toBe('Components')
    expect(wrapper.find('.seneu-topbar__sep').exists()).toBe(true)
  })

  it('does not render section prefix when omitted', () => {
    const wrapper = mount(SeneuTopbar, { props: { title: 'Dashboard' } })
    expect(wrapper.find('.seneu-topbar__section').exists()).toBe(false)
  })

  it('renders custom title slot instead of the title prop', () => {
    const wrapper = mount(SeneuTopbar, {
      props: { title: 'Ignored' },
      slots: { title: '<h1 class="custom-title">Custom</h1>' },
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.seneu-topbar__title').exists()).toBe(false)
  })
})

describe('SeneuTopbar — menu toggle', () => {
  it('does not render menu button by default', () => {
    const wrapper = mount(SeneuTopbar)
    expect(wrapper.find('.seneu-topbar__menu-btn').exists()).toBe(false)
  })

  it('renders menu button when showMenuToggle is true', () => {
    const wrapper = mount(SeneuTopbar, { props: { showMenuToggle: true } })
    expect(wrapper.find('.seneu-topbar__menu-btn').exists()).toBe(true)
  })

  it('emits menu-toggle when clicked', async () => {
    const wrapper = mount(SeneuTopbar, { props: { showMenuToggle: true } })
    await wrapper.find('.seneu-topbar__menu-btn').trigger('click')
    expect(wrapper.emitted('menu-toggle')).toBeTruthy()
  })

  it('uses menuToggleLabel as aria-label', () => {
    const wrapper = mount(SeneuTopbar, { props: { showMenuToggle: true, menuToggleLabel: 'Open nav' } })
    expect(wrapper.find('.seneu-topbar__menu-btn').attributes('aria-label')).toBe('Open nav')
  })
})

describe('SeneuTopbar — slots', () => {
  it('renders search slot when provided', () => {
    const wrapper = mount(SeneuTopbar, { slots: { search: '<input class="my-search">' } })
    expect(wrapper.find('.seneu-topbar__center .my-search').exists()).toBe(true)
  })

  it('does not render center zone without a search slot', () => {
    const wrapper = mount(SeneuTopbar)
    expect(wrapper.find('.seneu-topbar__center').exists()).toBe(false)
  })

  it('renders actions slot', () => {
    const wrapper = mount(SeneuTopbar, { slots: { actions: '<button class="my-action">A</button>' } })
    expect(wrapper.find('.seneu-topbar__right .my-action').exists()).toBe(true)
  })

  it('renders user slot wrapped in .seneu-topbar__user', () => {
    const wrapper = mount(SeneuTopbar, { slots: { user: '<span class="my-user">SP</span>' } })
    expect(wrapper.find('.seneu-topbar__user .my-user').exists()).toBe(true)
  })

  it('does not render user wrapper without a user slot', () => {
    const wrapper = mount(SeneuTopbar)
    expect(wrapper.find('.seneu-topbar__user').exists()).toBe(false)
  })
})

describe('SeneuTopbar — loading', () => {
  it('shows a skeleton instead of the title when loading', () => {
    const wrapper = mount(SeneuTopbar, { props: { title: 'Dashboard', loading: true } })
    expect(wrapper.find('.seneu-topbar__skeleton-title').exists()).toBe(true)
    expect(wrapper.find('.seneu-topbar__title').exists()).toBe(false)
  })
})

describe('SeneuTopbar — appearance', () => {
  it('applies bordered class by default', () => {
    const wrapper = mount(SeneuTopbar)
    expect(wrapper.find('.seneu-topbar').classes()).toContain('seneu-topbar--bordered')
  })

  it('omits bordered class when bordered is false', () => {
    const wrapper = mount(SeneuTopbar, { props: { bordered: false } })
    expect(wrapper.find('.seneu-topbar').classes()).not.toContain('seneu-topbar--bordered')
  })

  it('applies sticky class when sticky is true', () => {
    const wrapper = mount(SeneuTopbar, { props: { sticky: true } })
    expect(wrapper.find('.seneu-topbar').classes()).toContain('seneu-topbar--sticky')
  })
})
