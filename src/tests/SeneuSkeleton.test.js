import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuSkeleton from '../components/display/SeneuSkeleton.vue'

describe('SeneuSkeleton — rendering', () => {
  it('renders a single skeleton by default', () => {
    const wrapper = mount(SeneuSkeleton)
    expect(wrapper.find('.seneu-skeleton').exists()).toBe(true)
    expect(wrapper.find('.seneu-skeleton-lines').exists()).toBe(false)
  })

  it('applies the variant modifier class', () => {
    const wrapper = mount(SeneuSkeleton, { props: { variant: 'circle' } })
    expect(wrapper.classes()).toContain('seneu-skeleton--circle')
  })

  it('is hidden from assistive tech', () => {
    const wrapper = mount(SeneuSkeleton)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})

describe('SeneuSkeleton — sizing', () => {
  it('uses variant defaults when width/height are not set', () => {
    const wrapper = mount(SeneuSkeleton, { props: { variant: 'circle' } })
    expect(wrapper.attributes('style')).toContain('width: 2.5rem')
    expect(wrapper.attributes('style')).toContain('height: 2.5rem')
  })

  it('overrides width and height when provided', () => {
    const wrapper = mount(SeneuSkeleton, { props: { width: '10rem', height: '3rem' } })
    expect(wrapper.attributes('style')).toContain('width: 10rem')
    expect(wrapper.attributes('style')).toContain('height: 3rem')
  })
})

describe('SeneuSkeleton — multi-line text', () => {
  it('renders a single element when lines is 1', () => {
    const wrapper = mount(SeneuSkeleton, { props: { variant: 'text', lines: 1 } })
    expect(wrapper.find('.seneu-skeleton-lines').exists()).toBe(false)
  })

  it('renders a stacked group when lines > 1', () => {
    const wrapper = mount(SeneuSkeleton, { props: { variant: 'text', lines: 3 } })
    expect(wrapper.find('.seneu-skeleton-lines').exists()).toBe(true)
    expect(wrapper.findAll('.seneu-skeleton')).toHaveLength(3)
  })

  it('makes only the last line shorter', () => {
    const wrapper = mount(SeneuSkeleton, { props: { variant: 'text', lines: 3 } })
    const lines = wrapper.findAll('.seneu-skeleton')
    expect(lines[0].attributes('style')).toContain('width: 100%')
    expect(lines[1].attributes('style')).toContain('width: 100%')
    expect(lines[2].attributes('style')).toContain('width: 65%')
  })

  it('ignores lines > 1 for non-text variants', () => {
    const wrapper = mount(SeneuSkeleton, { props: { variant: 'rect', lines: 3 } })
    expect(wrapper.find('.seneu-skeleton-lines').exists()).toBe(false)
    expect(wrapper.findAll('.seneu-skeleton')).toHaveLength(1)
  })
})

describe('SeneuSkeleton — animation', () => {
  it('applies the animated class by default', () => {
    const wrapper = mount(SeneuSkeleton)
    expect(wrapper.classes()).toContain('seneu-skeleton--animated')
  })

  it('omits the animated class when animated is false', () => {
    const wrapper = mount(SeneuSkeleton, { props: { animated: false } })
    expect(wrapper.classes()).not.toContain('seneu-skeleton--animated')
  })
})
