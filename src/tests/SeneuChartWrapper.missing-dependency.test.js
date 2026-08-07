import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuChartWrapper from '../components/display/SeneuChartWrapper.vue'

vi.mock('echarts', () => {
  throw new Error('Cannot find module "echarts"')
})

function flush() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

describe('SeneuChartWrapper — missing echarts dependency', () => {
  it('shows a helpful notice instead of crashing when echarts fails to load', async () => {
    const wrapper = mount(SeneuChartWrapper, { props: { option: { series: [] } } })
    await flush()
    expect(wrapper.find('.seneu-empty-state__title').text()).toBe("echarts isn't installed")
  })

  it('does not throw an unhandled error', async () => {
    expect(() => mount(SeneuChartWrapper, { props: { option: { series: [] } } })).not.toThrow()
    await flush()
  })
})
