import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuFooter from '../components/layout/SeneuFooter.vue'

const columns = [
  { heading: 'Product', links: [{ label: 'Features', href: '/features' }] },
  { heading: 'Company', links: [{ label: 'About', href: '/about' }] },
]

describe('SeneuFooter — rendering', () => {
  it('renders a <footer role="contentinfo">', () => {
    const wrapper = mount(SeneuFooter)
    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.attributes('role')).toBe('contentinfo')
  })

  it('renders brand name text', () => {
    const wrapper = mount(SeneuFooter, { props: { brand: 'Seneu CMS' } })
    expect(wrapper.find('.seneu-footer__brand-name').text()).toBe('Seneu CMS')
  })

  it('renders copyright text', () => {
    const wrapper = mount(SeneuFooter, { props: { copyright: '© 2026 Cimang Club' } })
    expect(wrapper.find('.seneu-footer__copy').text()).toBe('© 2026 Cimang Club')
  })

  it('renders custom logo slot instead of brand prop', () => {
    const wrapper = mount(SeneuFooter, {
      props: { brand: 'Ignored' },
      slots: { logo: '<span class="custom-logo">Logo</span>' },
    })
    expect(wrapper.find('.custom-logo').exists()).toBe(true)
    expect(wrapper.find('.seneu-footer__brand-name').exists()).toBe(false)
  })
})

describe('SeneuFooter — simple variant', () => {
  it('renders inline nav links', () => {
    const wrapper = mount(SeneuFooter, {
      props: { variant: 'simple', links: [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms' }] },
    })
    const links = wrapper.findAll('.seneu-footer__nav-links .seneu-footer__link')
    expect(links.length).toBe(2)
    expect(links[0].attributes('href')).toBe('/privacy')
    expect(links[1].attributes('href')).toBe('#')
  })

  it('emits link-click when a nav link is clicked', async () => {
    const wrapper = mount(SeneuFooter, {
      props: { variant: 'simple', links: [{ label: 'Privacy', href: '/privacy' }] },
    })
    await wrapper.find('.seneu-footer__nav-links .seneu-footer__link').trigger('click')
    expect(wrapper.emitted('link-click')?.[0][0]).toEqual({ label: 'Privacy', href: '/privacy' })
  })

  it('does not render the columns top section', () => {
    const wrapper = mount(SeneuFooter, { props: { variant: 'simple' } })
    expect(wrapper.find('.seneu-footer__top').exists()).toBe(false)
  })
})

describe('SeneuFooter — columns variant', () => {
  it('renders one link column per entry with headings and links', () => {
    const wrapper = mount(SeneuFooter, { props: { variant: 'columns', columns } })
    const cols = wrapper.findAll('.seneu-footer__link-col')
    expect(cols.length).toBe(2)
    expect(cols[0].find('.seneu-footer__col-heading').text()).toBe('Product')
    expect(cols[0].find('.seneu-footer__link').text()).toBe('Features')
  })

  it('renders the divider and top section', () => {
    const wrapper = mount(SeneuFooter, { props: { variant: 'columns', columns } })
    expect(wrapper.find('.seneu-footer__top').exists()).toBe(true)
    expect(wrapper.find('.seneu-footer__divider').exists()).toBe(true)
  })

  it('renders tagline when provided', () => {
    const wrapper = mount(SeneuFooter, { props: { variant: 'columns', tagline: 'Build fast.' } })
    expect(wrapper.find('.seneu-footer__tagline').text()).toBe('Build fast.')
  })
})

describe('SeneuFooter — social links', () => {
  it('renders one link per social entry with aria-label', () => {
    const wrapper = mount(SeneuFooter, {
      props: { socialLinks: [{ icon: 'link', href: 'https://x.com', label: 'Website' }] },
    })
    const social = wrapper.find('.seneu-footer__social')
    expect(social.exists()).toBe(true)
    expect(social.attributes('aria-label')).toBe('Website')
    expect(social.attributes('href')).toBe('https://x.com')
  })

  it('does not render bottom-right zone without social links or default slot', () => {
    const wrapper = mount(SeneuFooter)
    expect(wrapper.find('.seneu-footer__bottom-right').exists()).toBe(false)
  })
})

describe('SeneuFooter — loading', () => {
  it('shows skeleton placeholders instead of real column content', () => {
    const wrapper = mount(SeneuFooter, { props: { variant: 'columns', columns, loading: true } })
    expect(wrapper.find('.seneu-footer__skeleton').exists()).toBe(true)
    expect(wrapper.find('.seneu-footer__col-heading').exists()).toBe(false)
    expect(wrapper.find('.seneu-footer__link').exists()).toBe(false)
  })
})
