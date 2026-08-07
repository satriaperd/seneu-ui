import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuTooltip from '../components/display/SeneuTooltip.vue'

beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

function mountTooltip(props = {}, slots = {}) {
  return mount(SeneuTooltip, {
    props: { content: 'Hello', ...props },
    slots: { default: '<button>Trigger</button>', ...slots },
  })
}

describe('SeneuTooltip — trigger rendering', () => {
  it('renders the default slot content', () => {
    const wrapper = mountTooltip()
    expect(wrapper.find('button').text()).toBe('Trigger')
  })

  it('does not render the bubble initially', () => {
    const wrapper = mountTooltip()
    expect(wrapper.find('.seneu-tooltip__bubble').exists()).toBe(false)
  })
})

describe('SeneuTooltip — show/hide', () => {
  it('shows the bubble after the delay on mouseenter', async () => {
    const wrapper = mountTooltip({ delay: 300 })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(300)
    expect(wrapper.find('.seneu-tooltip__bubble').exists()).toBe(true)
  })

  it('does not show before the delay elapses', async () => {
    const wrapper = mountTooltip({ delay: 300 })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(200)
    expect(wrapper.find('.seneu-tooltip__bubble').exists()).toBe(false)
  })

  it('hides the bubble after mouseleave', async () => {
    const wrapper = mountTooltip({ delay: 0 })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.find('.seneu-tooltip__bubble').exists()).toBe(true)

    await wrapper.trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(100)
    expect(wrapper.find('.seneu-tooltip__bubble').exists()).toBe(false)
  })

  it('shows on focusin and hides on focusout', async () => {
    const wrapper = mountTooltip({ delay: 0 })
    await wrapper.trigger('focusin')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.find('.seneu-tooltip__bubble').exists()).toBe(true)

    await wrapper.trigger('focusout')
    await vi.advanceTimersByTimeAsync(100)
    expect(wrapper.find('.seneu-tooltip__bubble').exists()).toBe(false)
  })

  it('hides immediately on Escape', async () => {
    const wrapper = mountTooltip({ delay: 0 })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.find('.seneu-tooltip__bubble').exists()).toBe(true)

    await wrapper.trigger('keydown.esc')
    expect(wrapper.find('.seneu-tooltip__bubble').exists()).toBe(false)
  })

  it('never shows when disabled', async () => {
    const wrapper = mountTooltip({ delay: 0, disabled: true })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.find('.seneu-tooltip__bubble').exists()).toBe(false)
  })
})

describe('SeneuTooltip — content', () => {
  it('renders the content prop', async () => {
    const wrapper = mountTooltip({ delay: 0, content: 'Delete this item' })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.find('.seneu-tooltip__bubble').text()).toBe('Delete this item')
  })

  it('prefers the content slot over the content prop', async () => {
    const wrapper = mountTooltip(
      { delay: 0, content: 'ignored' },
      { content: '<strong>Rich content</strong>' },
    )
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.find('.seneu-tooltip__bubble strong').text()).toBe('Rich content')
  })
})

describe('SeneuTooltip — placement and variant', () => {
  it('applies the placement modifier class', async () => {
    const wrapper = mountTooltip({ delay: 0, placement: 'right' })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.find('.seneu-tooltip__bubble').classes()).toContain('seneu-tooltip__bubble--right')
  })

  it('applies the variant modifier class', async () => {
    const wrapper = mountTooltip({ delay: 0, variant: 'light' })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.find('.seneu-tooltip__bubble').classes()).toContain('seneu-tooltip__bubble--light')
  })
})

describe('SeneuTooltip — accessibility', () => {
  it('gives the bubble role="tooltip"', async () => {
    const wrapper = mountTooltip({ delay: 0 })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.find('.seneu-tooltip__bubble').attributes('role')).toBe('tooltip')
  })

  it('wires aria-describedby onto the trigger when visible', async () => {
    const wrapper = mountTooltip({ delay: 0 })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    const bubbleId = wrapper.find('.seneu-tooltip__bubble').attributes('id')
    expect(wrapper.find('button').attributes('aria-describedby')).toBe(bubbleId)
  })

  it('does not set aria-describedby when hidden', () => {
    const wrapper = mountTooltip()
    expect(wrapper.find('button').attributes('aria-describedby')).toBeUndefined()
  })
})
