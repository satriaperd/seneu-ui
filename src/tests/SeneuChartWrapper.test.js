import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuChartWrapper from '../components/display/SeneuChartWrapper.vue'

const setOption = vi.fn()
const resize = vi.fn()
const dispose = vi.fn()
const init = vi.fn(() => ({ setOption, resize, dispose }))

vi.mock('echarts', () => ({ init }))

beforeEach(() => {
  init.mockClear()
  setOption.mockClear()
  resize.mockClear()
  dispose.mockClear()
})

const option = { series: [{ type: 'bar', data: [1, 2, 3] }] }

function flush() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

describe('SeneuChartWrapper — header', () => {
  it('renders title and subtitle', () => {
    const wrapper = mount(SeneuChartWrapper, { props: { title: 'Revenue', subtitle: 'Last 30 days' } })
    expect(wrapper.find('.seneu-chartwrap__title').text()).toBe('Revenue')
    expect(wrapper.find('.seneu-chartwrap__subtitle').text()).toBe('Last 30 days')
  })

  it('hides the header divider when there is no title, subtitle, or actions slot', () => {
    const wrapper = mount(SeneuChartWrapper)
    expect(wrapper.find('.seneu-chartwrap__title').exists()).toBe(false)
    expect(wrapper.find('.seneu-chartwrap__divider').exists()).toBe(false)
  })

  it('renders the actions slot', () => {
    const wrapper = mount(SeneuChartWrapper, {
      props: { title: 'x' },
      slots: { actions: '<button class="act">Go</button>' },
    })
    expect(wrapper.find('.seneu-chartwrap__actions .act').exists()).toBe(true)
  })
})

describe('SeneuChartWrapper — states', () => {
  it('shows a skeleton when loading', () => {
    const wrapper = mount(SeneuChartWrapper, { props: { loading: true, option } })
    expect(wrapper.find('.seneu-skeleton').exists()).toBe(true)
  })

  it('shows the empty state when there is no option', () => {
    const wrapper = mount(SeneuChartWrapper, { props: { emptyTitle: 'No data' } })
    expect(wrapper.find('.seneu-empty-state__title').text()).toBe('No data')
  })

  it('initializes the chart when an option is provided', async () => {
    mount(SeneuChartWrapper, { props: { option } })
    await flush()
    expect(init).toHaveBeenCalledTimes(1)
    expect(setOption).toHaveBeenCalledTimes(1)
  })

  it('merges token colors under the consumer option', async () => {
    mount(SeneuChartWrapper, { props: { option } })
    await flush()
    const [calledOption] = setOption.mock.calls[0]
    expect(calledOption.series).toEqual(option.series)
    expect(Array.isArray(calledOption.color)).toBe(true)
  })

  it('does not initialize the chart when there is no option', async () => {
    mount(SeneuChartWrapper)
    await flush()
    expect(init).not.toHaveBeenCalled()
  })
})

describe('SeneuChartWrapper — reactivity', () => {
  it('re-renders when the option prop changes', async () => {
    const wrapper = mount(SeneuChartWrapper, { props: { option } })
    await flush()
    await wrapper.setProps({ option: { series: [{ type: 'line', data: [4, 5, 6] }] } })
    await flush()
    expect(setOption).toHaveBeenCalledTimes(2)
  })

  it('disposes the chart when option is cleared', async () => {
    const wrapper = mount(SeneuChartWrapper, { props: { option } })
    await flush()
    await wrapper.setProps({ option: null })
    expect(dispose).toHaveBeenCalledTimes(1)
  })

  it('disposes the chart on unmount', async () => {
    const wrapper = mount(SeneuChartWrapper, { props: { option } })
    await flush()
    wrapper.unmount()
    expect(dispose).toHaveBeenCalledTimes(1)
  })
})
