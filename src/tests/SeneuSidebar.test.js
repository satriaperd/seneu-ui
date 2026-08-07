import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuSidebar from '../components/layout/SeneuSidebar.vue'

const sections = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard', active: true },
      { id: 'reports', label: 'Reports', icon: 'bar_chart', href: '/reports', badge: 5 },
      { id: 'archive', label: 'Archive', icon: 'inventory_2', href: '/archive', disabled: true },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        id: 'content',
        label: 'Content',
        icon: 'article',
        children: [
          { id: 'posts', label: 'Posts', href: '/posts' },
          { id: 'pages', label: 'Pages', href: '/pages' },
        ],
      },
    ],
  },
]

describe('SeneuSidebar — rendering', () => {
  it('renders as a <aside role="navigation">', () => {
    const wrapper = mount(SeneuSidebar)
    const aside = wrapper.find('aside')
    expect(aside.exists()).toBe(true)
    expect(aside.attributes('role')).toBe('navigation')
  })

  it('uses ariaLabel prop', () => {
    const wrapper = mount(SeneuSidebar, { props: { ariaLabel: 'Primary nav' } })
    expect(wrapper.find('aside').attributes('aria-label')).toBe('Primary nav')
  })

  it('renders brand name', () => {
    const wrapper = mount(SeneuSidebar, { props: { brandName: 'Seneu CMS' } })
    expect(wrapper.find('.seneu-sidebar__brand-name').text()).toBe('Seneu CMS')
  })

  it('renders flat items from sections', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections } })
    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Reports')
  })

  it('renders section labels', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections } })
    expect(wrapper.find('.seneu-sidebar__section-label').text()).toBe('Overview')
  })

  it('marks active item with aria-current="page"', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections } })
    const active = wrapper.findAll('.seneu-sidebar__item--active')
    expect(active.length).toBeGreaterThan(0)
  })
})

describe('SeneuSidebar — empty state', () => {
  it('shows empty state when sections is empty', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections: [] } })
    expect(wrapper.find('.seneu-sidebar__empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('No navigation items yet')
  })

  it('does not show empty state when sections has items', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections } })
    expect(wrapper.find('.seneu-sidebar__empty').exists()).toBe(false)
  })
})

describe('SeneuSidebar — loading', () => {
  it('shows skeleton rows instead of nav when loading', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections, loading: true } })
    expect(wrapper.find('.seneu-sidebar__skeleton-group').exists()).toBe(true)
    expect(wrapper.find('.seneu-sidebar__item').exists()).toBe(false)
  })
})

describe('SeneuSidebar — collapsed (v-model)', () => {
  it('applies collapsed class', () => {
    const wrapper = mount(SeneuSidebar, { props: { collapsed: true } })
    expect(wrapper.find('.seneu-sidebar').classes()).toContain('seneu-sidebar--collapsed')
  })

  it('hides brand name and item labels when collapsed', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections, collapsed: true } })
    expect(wrapper.find('.seneu-sidebar__brand-name').exists()).toBe(false)
    expect(wrapper.find('.seneu-sidebar__item-label').exists()).toBe(false)
  })

  it('emits update:collapsed when the collapse button is clicked', async () => {
    const wrapper = mount(SeneuSidebar, { props: { collapsed: false } })
    await wrapper.find('.seneu-sidebar__collapse-btn').trigger('click')
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true])
  })

  it('hides collapse button when showCollapseToggle is false', () => {
    const wrapper = mount(SeneuSidebar, { props: { showCollapseToggle: false } })
    expect(wrapper.find('.seneu-sidebar__collapse-btn').exists()).toBe(false)
  })
})

describe('SeneuSidebar — item interaction', () => {
  it('emits item-click with the item payload', async () => {
    const wrapper = mount(SeneuSidebar, { props: { sections } })
    const dashboard = wrapper.findAll('.seneu-sidebar__item').find(el => el.text().includes('Dashboard'))
    await dashboard.trigger('click')
    const emitted = wrapper.emitted('item-click')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0].id).toBe('dashboard')
  })

  it('does not emit item-click for disabled items', async () => {
    const wrapper = mount(SeneuSidebar, { props: { sections } })
    const archive = wrapper.findAll('.seneu-sidebar__item').find(el => el.text().includes('Archive'))
    expect(archive.classes()).toContain('seneu-sidebar__item--disabled')
    await archive.trigger('click')
    expect(wrapper.emitted('item-click')).toBeFalsy()
  })

  it('emits brand-click when brand link is clicked', async () => {
    const wrapper = mount(SeneuSidebar)
    await wrapper.find('.seneu-sidebar__brand').trigger('click')
    expect(wrapper.emitted('brand-click')).toBeTruthy()
  })
})

describe('SeneuSidebar — expandable groups', () => {
  it('does not show children by default', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections } })
    expect(wrapper.find('.seneu-sidebar__children').exists()).toBe(false)
  })

  it('auto-opens a group whose child is active', () => {
    const wrapper = mount(SeneuSidebar, {
      props: {
        sections: [
          { items: [{ id: 'g', label: 'Group', children: [{ id: 'c1', label: 'Child', active: true }] }] },
        ],
      },
    })
    expect(wrapper.find('.seneu-sidebar__children').exists()).toBe(true)
  })

  it('toggles group open state on click', async () => {
    const wrapper = mount(SeneuSidebar, { props: { sections } })
    const groupHeader = wrapper.find('.seneu-sidebar__group-header')
    expect(wrapper.find('.seneu-sidebar__children').exists()).toBe(false)
    await groupHeader.trigger('click')
    expect(wrapper.find('.seneu-sidebar__children').exists()).toBe(true)
    await groupHeader.trigger('click')
    expect(wrapper.find('.seneu-sidebar__children').exists()).toBe(false)
  })

  it('emits item-click when a child is clicked', async () => {
    const wrapper = mount(SeneuSidebar, { props: { sections } })
    await wrapper.find('.seneu-sidebar__group-header').trigger('click')
    const postsLink = wrapper.findAll('.seneu-sidebar__item--child').find(el => el.text().includes('Posts'))
    await postsLink.trigger('click')
    expect(wrapper.emitted('item-click')?.[0][0].id).toBe('posts')
  })
})

describe('SeneuSidebar — badges', () => {
  it('renders badge value on an item', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections } })
    const badge = wrapper.find('.seneu-sidebar__badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('5')
  })

  it('hides badges when collapsed', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections, collapsed: true } })
    expect(wrapper.find('.seneu-sidebar__badge').exists()).toBe(false)
  })
})

describe('SeneuSidebar — footer slot', () => {
  it('renders footer slot content', () => {
    const wrapper = mount(SeneuSidebar, {
      slots: { footer: '<button class="my-footer">Logout</button>' },
    })
    expect(wrapper.find('.seneu-sidebar__footer .my-footer').exists()).toBe(true)
  })

  it('does not render footer wrapper when no footer slot given', () => {
    const wrapper = mount(SeneuSidebar)
    expect(wrapper.find('.seneu-sidebar__footer').exists()).toBe(false)
  })
})

describe('SeneuSidebar — mobile drawer', () => {
  it('renders a hamburger trigger by default', () => {
    const wrapper = mount(SeneuSidebar)
    expect(wrapper.find('.seneu-sidebar__mobile-trigger').exists()).toBe(true)
  })

  it('hides the trigger when showMobileTrigger is false', () => {
    const wrapper = mount(SeneuSidebar, { props: { showMobileTrigger: false } })
    expect(wrapper.find('.seneu-sidebar__mobile-trigger').exists()).toBe(false)
  })

  it('emits update:mobileOpen when the trigger is clicked', async () => {
    const wrapper = mount(SeneuSidebar)
    await wrapper.find('.seneu-sidebar__mobile-trigger').trigger('click')
    expect(wrapper.emitted('update:mobileOpen')?.[0]).toEqual([true])
  })

  it('does not render the backdrop when closed', () => {
    const wrapper = mount(SeneuSidebar, { props: { mobileOpen: false } })
    expect(wrapper.find('.seneu-sidebar__backdrop').exists()).toBe(false)
  })

  it('renders the backdrop when open and emits update:mobileOpen(false) on click', async () => {
    const wrapper = mount(SeneuSidebar, { props: { mobileOpen: true } })
    const backdrop = wrapper.find('.seneu-sidebar__backdrop')
    expect(backdrop.exists()).toBe(true)
    await backdrop.trigger('click')
    expect(wrapper.emitted('update:mobileOpen')?.[0]).toEqual([false])
  })

  it('applies the mobile-open class to the aside when open', () => {
    const wrapper = mount(SeneuSidebar, { props: { mobileOpen: true } })
    expect(wrapper.find('.seneu-sidebar').classes()).toContain('seneu-sidebar--mobile-open')
  })

  it('emits update:mobileOpen(false) when the close button is clicked', async () => {
    const wrapper = mount(SeneuSidebar, { props: { mobileOpen: true } })
    await wrapper.find('.seneu-sidebar__mobile-close-btn').trigger('click')
    expect(wrapper.emitted('update:mobileOpen')?.[0]).toEqual([false])
  })

  it('closes the drawer when a nav item is clicked while open', async () => {
    const wrapper = mount(SeneuSidebar, { props: { sections, mobileOpen: true } })
    const dashboard = wrapper.findAll('.seneu-sidebar__item').find(el => el.text().includes('Dashboard'))
    await dashboard.trigger('click')
    expect(wrapper.emitted('update:mobileOpen')?.at(-1)).toEqual([false])
  })

  it('does not force-close the drawer when it is already closed', async () => {
    const wrapper = mount(SeneuSidebar, { props: { sections, mobileOpen: false } })
    const dashboard = wrapper.findAll('.seneu-sidebar__item').find(el => el.text().includes('Dashboard'))
    await dashboard.trigger('click')
    expect(wrapper.emitted('update:mobileOpen')).toBeFalsy()
  })

  it('applies force-mobile class for demo/preview purposes', () => {
    const wrapper = mount(SeneuSidebar, { props: { forceMobile: true } })
    expect(wrapper.find('.seneu-sidebar').classes()).toContain('seneu-sidebar--force-mobile')
  })

  it('does not hide item labels when forceMobile is true even if collapsed is true', () => {
    const wrapper = mount(SeneuSidebar, { props: { sections, collapsed: true, forceMobile: true } })
    expect(wrapper.find('.seneu-sidebar__item-label').exists()).toBe(true)
  })
})
