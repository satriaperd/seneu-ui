import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuTabs from '../components/layout/SeneuTabs.vue'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
]

describe('SeneuTabs — rendering', () => {
  it('renders a role="tablist" container', () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'overview' } })
    expect(wrapper.attributes('role')).toBe('tablist')
  })

  it('renders one role="tab" button per tab', () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'overview' } })
    const buttons = wrapper.findAll('[role="tab"]')
    expect(buttons.length).toBe(3)
    expect(buttons[0].text()).toContain('Overview')
  })

  it('marks the active tab with aria-selected="true"', () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'analytics' } })
    const buttons = wrapper.findAll('[role="tab"]')
    expect(buttons[1].attributes('aria-selected')).toBe('true')
    expect(buttons[0].attributes('aria-selected')).toBe('false')
  })

  it('applies active class to the selected tab only', () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'settings' } })
    const active = wrapper.findAll('.seneu-tab--active')
    expect(active.length).toBe(1)
    expect(active[0].text()).toContain('Settings')
  })

  it('renders count badge when tab.count is set', () => {
    const wrapper = mount(SeneuTabs, {
      props: { modelValue: 'inbox', tabs: [{ id: 'inbox', label: 'Inbox', count: 12 }] },
    })
    expect(wrapper.find('.seneu-tab__badge').text()).toBe('12')
  })

  it('caps count badge display at "99+"', () => {
    const wrapper = mount(SeneuTabs, {
      props: { modelValue: 'inbox', tabs: [{ id: 'inbox', label: 'Inbox', count: 150 }] },
    })
    expect(wrapper.find('.seneu-tab__badge').text()).toBe('99+')
  })
})

describe('SeneuTabs — selection', () => {
  it('emits update:modelValue and change on click', async () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'overview' } })
    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['analytics'])
    expect(wrapper.emitted('change')?.[0]).toEqual([{ from: 'overview', to: 'analytics' }])
  })

  it('does not emit when clicking the already-active tab', async () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'overview' } })
    await wrapper.findAll('[role="tab"]')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('does not emit when clicking a disabled tab', async () => {
    const wrapper = mount(SeneuTabs, {
      props: {
        modelValue: 'overview',
        tabs: [{ id: 'overview', label: 'Overview' }, { id: 'billing', label: 'Billing', disabled: true }],
      },
    })
    const billing = wrapper.findAll('[role="tab"]')[1]
    expect(billing.attributes('disabled')).toBeDefined()
    await billing.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})

describe('SeneuTabs — keyboard navigation', () => {
  it('ArrowRight moves to and selects the next tab', async () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'overview' }, attachTo: document.body })
    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['analytics'])
    wrapper.unmount()
  })

  it('ArrowLeft wraps around to the last tab from the first', async () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'overview' }, attachTo: document.body })
    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['settings'])
    wrapper.unmount()
  })

  it('skips disabled tabs when navigating with arrows', async () => {
    const wrapper = mount(SeneuTabs, {
      props: {
        modelValue: 'overview',
        tabs: [
          { id: 'overview', label: 'Overview' },
          { id: 'billing', label: 'Billing', disabled: true },
          { id: 'settings', label: 'Settings' },
        ],
      },
      attachTo: document.body,
    })
    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['settings'])
    wrapper.unmount()
  })

  it('Home jumps to the first tab, End jumps to the last', async () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'analytics' }, attachTo: document.body })
    await wrapper.findAll('[role="tab"]')[1].trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['settings'])
    await wrapper.findAll('[role="tab"]')[1].trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['overview'])
    wrapper.unmount()
  })

  it('only the active tab has tabindex 0, others -1', () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'analytics' } })
    const buttons = wrapper.findAll('[role="tab"]')
    expect(buttons[0].attributes('tabindex')).toBe('-1')
    expect(buttons[1].attributes('tabindex')).toBe('0')
    expect(buttons[2].attributes('tabindex')).toBe('-1')
  })
})

describe('SeneuTabs — variants, size, fullWidth', () => {
  it('applies variant class', () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'overview', variant: 'pill' } })
    expect(wrapper.classes()).toContain('seneu-tabs--pill')
  })

  it('defaults to line variant and base size', () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'overview' } })
    expect(wrapper.classes()).toContain('seneu-tabs--line')
    expect(wrapper.classes()).toContain('seneu-tabs--base')
  })

  it('applies full-width class', () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'overview', fullWidth: true } })
    expect(wrapper.classes()).toContain('seneu-tabs--full-width')
  })
})

describe('SeneuTabs — loading', () => {
  it('shows skeleton placeholders instead of tabs', () => {
    const wrapper = mount(SeneuTabs, { props: { tabs, modelValue: 'overview', loading: true } })
    expect(wrapper.findAll('.seneu-tabs__skeleton').length).toBe(4)
    expect(wrapper.find('[role="tab"]').exists()).toBe(false)
  })
})
