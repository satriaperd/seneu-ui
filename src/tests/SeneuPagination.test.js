import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuPagination from '../components/layout/SeneuPagination.vue'

describe('SeneuPagination — rendering', () => {
  it('renders a <nav>', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 1, total: 42, perPage: 10 } })
    expect(wrapper.find('nav').exists()).toBe(true)
  })

  it('renders numbered page buttons for default variant', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 1, total: 25, perPage: 10 } })
    // 25/10 = 3 pages, all visible with default siblingCount (no collapsing needed)
    expect(wrapper.findAll('.seneu-pagination__page').length).toBe(3)
  })

  it('marks the active page with aria-current="page"', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 3, total: 42, perPage: 10 } })
    const active = wrapper.find('.seneu-pagination__page--active')
    expect(active.exists()).toBe(true)
    expect(active.text()).toBe('3')
    expect(active.attributes('aria-current')).toBe('page')
  })

  it('disables the Previous button on page 1', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 1, total: 42, perPage: 10 } })
    expect(wrapper.find('.seneu-pagination__btn--prev').attributes('disabled')).toBeDefined()
  })

  it('disables the Next button on the last page', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 3, total: 42, perPage: 10 } })
    expect(wrapper.find('.seneu-pagination__btn--next').attributes('disabled')).toBeUndefined()
    const wrapperLast = mount(SeneuPagination, { props: { modelValue: 5, total: 42, perPage: 10 } })
    expect(wrapperLast.find('.seneu-pagination__btn--next').attributes('disabled')).toBeDefined()
  })

  it('clamps to a single disabled page when total is 0', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 1, total: 0, perPage: 10 } })
    expect(wrapper.findAll('.seneu-pagination__page').length).toBe(1)
    expect(wrapper.find('.seneu-pagination__btn--prev').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.seneu-pagination__btn--next').attributes('disabled')).toBeDefined()
  })
})

describe('SeneuPagination — ellipsis collapsing', () => {
  it('collapses middle pages with an ellipsis for long ranges', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 10, total: 500, perPage: 10 } })
    expect(wrapper.find('.seneu-pagination__ellipsis').exists()).toBe(true)
    expect(wrapper.findAll('.seneu-pagination__page').length).toBeLessThan(50)
  })

  it('always includes first and last page', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 25, total: 500, perPage: 10 } })
    const labels = wrapper.findAll('.seneu-pagination__page').map(el => el.text())
    expect(labels[0]).toBe('1')
    expect(labels.at(-1)).toBe('50')
  })
})

describe('SeneuPagination — navigation', () => {
  it('emits update:modelValue and change when a page number is clicked', async () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 1, total: 25, perPage: 10 } })
    const pages = wrapper.findAll('.seneu-pagination__page')
    await pages[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    expect(wrapper.emitted('change')?.[0]).toEqual([{ from: 1, to: 3 }])
  })

  it('emits when Next is clicked', async () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 2, total: 42, perPage: 10 } })
    await wrapper.find('.seneu-pagination__btn--next').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('emits when Previous is clicked', async () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 2, total: 42, perPage: 10 } })
    await wrapper.find('.seneu-pagination__btn--prev').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('does not emit when clicking the active page', async () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 1, total: 42, perPage: 10 } })
    await wrapper.find('.seneu-pagination__page--active').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})

describe('SeneuPagination — edge buttons', () => {
  it('does not render first/last buttons by default', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 5, total: 500, perPage: 10 } })
    expect(wrapper.findAll('.seneu-pagination__btn').length).toBe(2)
  })

  it('renders and wires first/last buttons when showEdgeButtons is true', async () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 5, total: 500, perPage: 10, showEdgeButtons: true } })
    const btns = wrapper.findAll('.seneu-pagination__btn')
    expect(btns.length).toBe(4)
    await btns[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })
})

describe('SeneuPagination — variant simple', () => {
  it('renders "current / total" instead of page buttons', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 3, total: 120, perPage: 10, variant: 'simple' } })
    expect(wrapper.find('.seneu-pagination__page').exists()).toBe(false)
    expect(wrapper.find('.seneu-pagination__info').text()).toBe('3/12')
  })
})

describe('SeneuPagination — showLabels', () => {
  it('shows Previous/Next text by default', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 2, total: 42, perPage: 10 } })
    const labels = wrapper.findAll('.seneu-pagination__btn-label')
    expect(labels.map(l => l.text())).toEqual(['Previous', 'Next'])
  })

  it('hides Previous/Next text when showLabels is false', () => {
    const wrapper = mount(SeneuPagination, { props: { modelValue: 2, total: 42, perPage: 10, showLabels: false } })
    expect(wrapper.find('.seneu-pagination__btn-label').exists()).toBe(false)
  })
})

describe('SeneuPagination — loading', () => {
  it('shows skeleton placeholders instead of controls', () => {
    const wrapper = mount(SeneuPagination, { props: { total: 0, loading: true } })
    expect(wrapper.find('.seneu-pagination__skeleton').exists()).toBe(true)
    expect(wrapper.find('.seneu-pagination__page').exists()).toBe(false)
    expect(wrapper.find('.seneu-pagination__btn').exists()).toBe(false)
  })
})
