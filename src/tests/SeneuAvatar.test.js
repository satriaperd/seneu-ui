import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuAvatar from '../components/display/SeneuAvatar.vue'

describe('SeneuAvatar — image', () => {
  it('renders an img when src is provided', () => {
    const wrapper = mount(SeneuAvatar, { props: { src: 'https://example.com/a.jpg', name: 'Ayu Lestari' } })
    expect(wrapper.find('.seneu-avatar__img').exists()).toBe(true)
    expect(wrapper.find('.seneu-avatar__initials').exists()).toBe(false)
  })

  it('falls back to initials when the image fails to load', async () => {
    const wrapper = mount(SeneuAvatar, { props: { src: 'https://example.com/broken.jpg', name: 'Ayu Lestari' } })
    await wrapper.find('.seneu-avatar__img').trigger('error')
    expect(wrapper.find('.seneu-avatar__img').exists()).toBe(false)
    expect(wrapper.find('.seneu-avatar__initials').text()).toBe('AL')
  })
})

describe('SeneuAvatar — initials', () => {
  it('derives initials from a two-word name', () => {
    const wrapper = mount(SeneuAvatar, { props: { name: 'Budi Santoso' } })
    expect(wrapper.find('.seneu-avatar__initials').text()).toBe('BS')
  })

  it('derives a single initial from a one-word name', () => {
    const wrapper = mount(SeneuAvatar, { props: { name: 'Cher' } })
    expect(wrapper.find('.seneu-avatar__initials').text()).toBe('C')
  })

  it('uses first and last word for a multi-word name', () => {
    const wrapper = mount(SeneuAvatar, { props: { name: 'Doni Adi Prakoso' } })
    expect(wrapper.find('.seneu-avatar__initials').text()).toBe('DP')
  })
})

describe('SeneuAvatar — icon fallback', () => {
  it('renders the person icon when there is no src and no name', () => {
    const wrapper = mount(SeneuAvatar)
    expect(wrapper.find('.seneu-avatar__icon').exists()).toBe(true)
    expect(wrapper.find('.seneu-avatar__initials').exists()).toBe(false)
  })
})

describe('SeneuAvatar — size and shape', () => {
  it('applies the size modifier class', () => {
    const wrapper = mount(SeneuAvatar, { props: { size: 'xl' } })
    expect(wrapper.classes()).toContain('seneu-avatar--xl')
  })

  it('defaults to circle shape', () => {
    const wrapper = mount(SeneuAvatar)
    expect(wrapper.classes()).toContain('seneu-avatar--circle')
  })

  it('applies the square shape modifier', () => {
    const wrapper = mount(SeneuAvatar, { props: { shape: 'square' } })
    expect(wrapper.classes()).toContain('seneu-avatar--square')
  })
})

describe('SeneuAvatar — status', () => {
  it('does not render a status dot by default', () => {
    const wrapper = mount(SeneuAvatar)
    expect(wrapper.find('.seneu-avatar__status').exists()).toBe(false)
  })

  it('renders a status dot with the correct modifier', () => {
    const wrapper = mount(SeneuAvatar, { props: { status: 'online' } })
    expect(wrapper.find('.seneu-avatar__status--online').exists()).toBe(true)
  })
})

describe('SeneuAvatar — accessibility', () => {
  it('uses name as the accessible label', () => {
    const wrapper = mount(SeneuAvatar, { props: { name: 'Eka Wulandari' } })
    expect(wrapper.attributes('aria-label')).toBe('Eka Wulandari')
    expect(wrapper.attributes('role')).toBe('img')
  })

  it('falls back to a generic label when there is no name or alt', () => {
    const wrapper = mount(SeneuAvatar)
    expect(wrapper.attributes('aria-label')).toBe('Avatar')
  })
})

describe('SeneuAvatar — loading', () => {
  it('renders a skeleton instead of the avatar content when loading', () => {
    const wrapper = mount(SeneuAvatar, { props: { loading: true, name: 'Ayu Lestari' } })
    expect(wrapper.find('.seneu-skeleton').exists()).toBe(true)
    expect(wrapper.find('.seneu-avatar').exists()).toBe(false)
  })

  it('renders a circle skeleton variant for circle shape', () => {
    const wrapper = mount(SeneuAvatar, { props: { loading: true, shape: 'circle' } })
    expect(wrapper.find('.seneu-skeleton--circle').exists()).toBe(true)
  })

  it('renders a rect skeleton variant for square shape', () => {
    const wrapper = mount(SeneuAvatar, { props: { loading: true, shape: 'square' } })
    expect(wrapper.find('.seneu-skeleton--rect').exists()).toBe(true)
  })
})
