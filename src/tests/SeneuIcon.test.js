import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import SeneuIcon from '../components/display/SeneuIcon.vue'
import { SENEU_ICON_KEY } from '../composables/useIcon.js'

describe('SeneuIcon — rendering', () => {
  it('renders a <span> with the icon name as text content', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toBe('home')
  })

  it('applies .seneu-icon class', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home' } })
    expect(wrapper.classes()).toContain('seneu-icon')
  })
})

describe('SeneuIcon — props', () => {
  it('sets fontSize from size prop', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home', size: 32 } })
    expect(wrapper.element.style.fontSize).toBe('32px')
  })

  it('uses size 20 as default', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home' } })
    expect(wrapper.element.style.fontSize).toBe('20px')
  })

  it('sets FILL 0 when fill is false (default)', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home' } })
    expect(wrapper.element.style.fontVariationSettings).toContain("'FILL' 0")
  })

  it('sets FILL 1 when fill is true', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home', fill: true } })
    expect(wrapper.element.style.fontVariationSettings).toContain("'FILL' 1")
  })

  it('sets wght from weight prop', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home', weight: 500 } })
    expect(wrapper.element.style.fontVariationSettings).toContain("'wght' 500")
  })

  it('sets GRAD from grade prop', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home', grade: 200 } })
    expect(wrapper.element.style.fontVariationSettings).toContain("'GRAD' 200")
  })

  it('sets opsz equal to size', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home', size: 48 } })
    expect(wrapper.element.style.fontVariationSettings).toContain("'opsz' 48")
  })
})

describe('SeneuIcon — accessibility', () => {
  it('is aria-hidden when no label (decorative)', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home' } })
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })

  it('has role="img" and aria-label when label is provided', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home', label: 'Go home' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Go home')
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
  })

  it('empty string label still treated as decorative', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home', label: '' } })
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('role')).toBeUndefined()
  })
})

describe('SeneuIcon — custom icon set (SENEU_ICON_KEY)', () => {
  const CustomIcon = {
    props: ['name', 'size', 'fill', 'weight', 'grade', 'label'],
    render() { return h('i', { class: `custom-icon custom-icon--${this.name}` }) },
  }

  it('renders the default Material Symbols span when nothing is provided', () => {
    const wrapper = mount(SeneuIcon, { props: { name: 'home' } })
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('renders the injected custom component instead of the span when SENEU_ICON_KEY is provided', () => {
    const wrapper = mount(SeneuIcon, {
      props: { name: 'home', size: 24 },
      global: { provide: { [SENEU_ICON_KEY]: CustomIcon } },
    })
    expect(wrapper.find('span.seneu-icon').exists()).toBe(false)
    expect(wrapper.find('i.custom-icon--home').exists()).toBe(true)
  })

  it('forwards all icon props to the custom component', () => {
    const wrapper = mount(SeneuIcon, {
      props: { name: 'close', size: 32, fill: true, weight: 500, grade: 100, label: 'Close' },
      global: { provide: { [SENEU_ICON_KEY]: CustomIcon } },
    })
    const custom = wrapper.getComponent(CustomIcon)
    expect(custom.props()).toMatchObject({
      name: 'close', size: 32, fill: true, weight: 500, grade: 100, label: 'Close',
    })
  })
})
