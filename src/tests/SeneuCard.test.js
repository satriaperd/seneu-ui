import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuCard from '../components/display/SeneuCard.vue'

describe('SeneuCard — rendering', () => {
  it('renders as a <div> by default', () => {
    const wrapper = mount(SeneuCard, { slots: { default: 'Content' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.text()).toContain('Content')
  })

  it('renders header/body/footer slots', () => {
    const wrapper = mount(SeneuCard, {
      slots: { header: '<h3 class="h">Title</h3>', default: 'Body', footer: '<span class="f">Footer</span>' },
    })
    expect(wrapper.find('.seneu-card__header .h').exists()).toBe(true)
    expect(wrapper.find('.seneu-card__body').text()).toBe('Body')
    expect(wrapper.find('.seneu-card__footer .f').exists()).toBe(true)
  })

  it('does not render header/footer wrappers without those slots', () => {
    const wrapper = mount(SeneuCard, { slots: { default: 'Body only' } })
    expect(wrapper.find('.seneu-card__header').exists()).toBe(false)
    expect(wrapper.find('.seneu-card__footer').exists()).toBe(false)
  })

  it('renders the media slot', () => {
    const wrapper = mount(SeneuCard, { slots: { media: '<img class="m" src="x.png">' } })
    expect(wrapper.find('.seneu-card__media .m').exists()).toBe(true)
  })
})

describe('SeneuCard — clickable / tag resolution', () => {
  it('renders as <button> when clickable without href', () => {
    const wrapper = mount(SeneuCard, { props: { clickable: true } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('renders as <a> when clickable with href', () => {
    const wrapper = mount(SeneuCard, { props: { clickable: true, href: '/foo' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/foo')
  })

  it('emits click when clickable', async () => {
    const wrapper = mount(SeneuCard, { props: { clickable: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(SeneuCard, { props: { clickable: true, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('sets disabled attribute on the button tag', () => {
    const wrapper = mount(SeneuCard, { props: { clickable: true, disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})

describe('SeneuCard — variant, padding, and modifier classes', () => {
  it('applies variant class', () => {
    const wrapper = mount(SeneuCard, { props: { variant: 'elevated' } })
    expect(wrapper.classes()).toContain('seneu-card--elevated')
  })

  it('applies padding class', () => {
    const wrapper = mount(SeneuCard, { props: { padding: 'lg' } })
    expect(wrapper.classes()).toContain('seneu-card--pad-lg')
  })

  it('applies hoverable/selected/divided modifier classes', () => {
    const wrapper = mount(SeneuCard, { props: { hoverable: true, selected: true, divided: true } })
    expect(wrapper.classes()).toContain('seneu-card--hoverable')
    expect(wrapper.classes()).toContain('seneu-card--selected')
    expect(wrapper.classes()).toContain('seneu-card--divided')
  })
})

describe('SeneuCard — loading', () => {
  it('shows skeleton instead of slotted content when loading', () => {
    const wrapper = mount(SeneuCard, {
      props: { loading: true },
      slots: { header: 'Title', default: 'Body', footer: 'Footer' },
    })
    expect(wrapper.find('.seneu-card__skeleton').exists()).toBe(true)
    expect(wrapper.find('.seneu-card__body').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Body')
  })
})
