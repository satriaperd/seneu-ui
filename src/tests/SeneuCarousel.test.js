import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuCarousel from '../components/layout/SeneuCarousel.vue'

const slides = [
  { title: 'One' },
  { title: 'Two' },
  { title: 'Three' },
]

describe('SeneuCarousel — rendering', () => {
  it('renders role="region" with one slide group per entry', () => {
    const wrapper = mount(SeneuCarousel, { props: { slides } })
    expect(wrapper.attributes('role')).toBe('region')
    expect(wrapper.findAll('[role="group"]').length).toBe(3)
  })

  it('marks the active slide and hides the rest from assistive tech', () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 1 } })
    const groups = wrapper.findAll('[role="group"]')
    expect(groups[1].classes()).toContain('seneu-carousel__slide--active')
    expect(groups[0].attributes('aria-hidden')).toBe('true')
    expect(groups[1].attributes('aria-hidden')).toBeUndefined()
  })

  it('renders default card content from slide data', () => {
    const wrapper = mount(SeneuCarousel, { props: { slides: [{ title: 'Hello', subtitle: 'World' }] } })
    expect(wrapper.find('.seneu-carousel__card-title').text()).toBe('Hello')
    expect(wrapper.find('.seneu-carousel__card-sub').text()).toBe('World')
  })
})

describe('SeneuCarousel — empty & loading states', () => {
  it('shows empty state when there are no slides', () => {
    const wrapper = mount(SeneuCarousel, { props: { slides: [] } })
    expect(wrapper.find('.seneu-carousel__empty').exists()).toBe(true)
  })

  it('shows skeleton and skips empty state when loading', () => {
    const wrapper = mount(SeneuCarousel, { props: { slides: [], loading: true } })
    expect(wrapper.find('.seneu-carousel__skeleton').exists()).toBe(true)
    expect(wrapper.find('.seneu-carousel__empty').exists()).toBe(false)
  })
})

describe('SeneuCarousel — navigation', () => {
  it('emits update:modelValue and change on next arrow click', async () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 0 } })
    await wrapper.find('.seneu-carousel__arrow--next').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([{ from: 0, to: 1 }])
  })

  it('emits on prev arrow click, wrapping to last slide when loop is true', async () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 0, loop: true } })
    await wrapper.find('.seneu-carousel__arrow--prev').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('disables prev/next at boundaries when loop is false', () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 0, loop: false } })
    expect(wrapper.find('.seneu-carousel__arrow--prev').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.seneu-carousel__arrow--next').attributes('disabled')).toBeUndefined()
  })

  it('does not go past the last slide when loop is false', async () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 2, loop: false } })
    expect(wrapper.find('.seneu-carousel__arrow--next').attributes('disabled')).toBeDefined()
    await wrapper.find('.seneu-carousel__arrow--next').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('jumps to a slide when its dot is clicked', async () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 0 } })
    await wrapper.findAll('.seneu-carousel__dot')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('navigates with ArrowLeft/ArrowRight keys', async () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 0 } })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])
  })

  it('navigates via touch swipe', async () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 0 } })
    const viewport = wrapper.find('.seneu-carousel__viewport')
    await viewport.trigger('touchstart', { touches: [{ clientX: 200 }] })
    await viewport.trigger('touchmove', { touches: [{ clientX: 100 }] })
    await viewport.trigger('touchend')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })
})

describe('SeneuCarousel — dots and counter', () => {
  it('does not render dots when showDots is false', () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, showDots: false } })
    expect(wrapper.find('.seneu-carousel__dots').exists()).toBe(false)
  })

  it('renders counter when showCounter is true', () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 1, showCounter: true } })
    expect(wrapper.find('.seneu-carousel__counter').text()).toBe('2 / 3')
  })
})

describe('SeneuCarousel — autoplay', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('auto-advances on the given interval', async () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 0, autoplay: true, interval: 1000 } })
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('does not autoplay when autoplay is false', async () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 0, autoplay: false, interval: 1000 } })
    await vi.advanceTimersByTimeAsync(3000)
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('pauses on mouseenter and resumes on mouseleave', async () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 0, autoplay: true, interval: 1000 } })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(2000)
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    await wrapper.trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('renders a play/pause toggle and stops autoplay when clicked', async () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, modelValue: 0, autoplay: true, interval: 1000 } })
    const toggle = wrapper.find('.seneu-carousel__play-toggle')
    expect(toggle.exists()).toBe(true)
    await toggle.trigger('click')
    await vi.advanceTimersByTimeAsync(3000)
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('does not render play/pause toggle when autoplay is false', () => {
    const wrapper = mount(SeneuCarousel, { props: { slides, autoplay: false } })
    expect(wrapper.find('.seneu-carousel__play-toggle').exists()).toBe(false)
  })
})
