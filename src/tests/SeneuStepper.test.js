import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuStepper from '../components/layout/SeneuStepper.vue'

const steps = [
  { title: 'Account' },
  { title: 'Profile' },
  { title: 'Confirm' },
]

describe('SeneuStepper — rendering', () => {
  it('renders role="list" with one role="listitem" per step', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 1, steps } })
    expect(wrapper.attributes('role')).toBe('list')
    expect(wrapper.findAll('[role="listitem"]').length).toBe(3)
  })

  it('renders a connector line between steps but not before the first', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 1, steps } })
    expect(wrapper.findAll('.seneu-stepper__line').length).toBe(2)
  })

  it('marks the active step with aria-current="step"', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 2, steps } })
    const items = wrapper.findAll('[role="listitem"]')
    expect(items[1].attributes('aria-current')).toBe('step')
    expect(items[0].attributes('aria-current')).toBeUndefined()
  })

  it('applies completed/active/upcoming classes correctly', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 2, steps } })
    const items = wrapper.findAll('[role="listitem"]')
    expect(items[0].classes()).toContain('seneu-stepper__step--completed')
    expect(items[1].classes()).toContain('seneu-stepper__step--active')
    expect(items[2].classes()).toContain('seneu-stepper__step--upcoming')
  })

  it('shows a checkmark icon for completed steps', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 2, steps } })
    const items = wrapper.findAll('[role="listitem"]')
    expect(items[0].find('.seneu-icon').text()).toBe('check')
  })

  it('shows the step number for numbered variant on non-completed steps', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 2, steps } })
    const items = wrapper.findAll('[role="listitem"]')
    expect(items[1].find('.seneu-stepper__num').text()).toBe('2')
  })

  it('renders description when provided', () => {
    const wrapper = mount(SeneuStepper, {
      props: { modelValue: 1, steps: [{ title: 'A', description: 'Do the thing' }] },
    })
    expect(wrapper.find('.seneu-stepper__desc').text()).toBe('Do the thing')
  })

  it('applies error class and icon for a step with status "error"', () => {
    const wrapper = mount(SeneuStepper, {
      props: { modelValue: 2, steps: [{ title: 'A' }, { title: 'B', status: 'error' }, { title: 'C' }] },
    })
    const items = wrapper.findAll('[role="listitem"]')
    expect(items[1].classes()).toContain('seneu-stepper__step--error')
    expect(items[1].find('.seneu-icon').text()).toBe('error')
  })
})

describe('SeneuStepper — variants', () => {
  it('does not render a number or icon for dot variant', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 2, steps, variant: 'dot' } })
    const items = wrapper.findAll('[role="listitem"]')
    expect(items[2].find('.seneu-stepper__num').exists()).toBe(false)
  })

  it('shows step.icon for icon variant on upcoming steps', () => {
    const wrapper = mount(SeneuStepper, {
      props: { modelValue: 1, variant: 'icon', steps: [{ title: 'A' }, { title: 'B', icon: 'star' }] },
    })
    const items = wrapper.findAll('[role="listitem"]')
    expect(items[1].find('.seneu-icon').text()).toBe('star')
  })
})

describe('SeneuStepper — clickable', () => {
  it('renders completed steps as <button> when clickable', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 3, steps, clickable: true } })
    const items = wrapper.findAll('.seneu-stepper__step')
    expect(items[0].element.tagName).toBe('BUTTON')
    expect(items[1].element.tagName).toBe('BUTTON')
    expect(items[2].element.tagName).toBe('DIV')
  })

  it('renders steps as <div> when not clickable', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 3, steps, clickable: false } })
    const items = wrapper.findAll('.seneu-stepper__step')
    expect(items.every(el => el.element.tagName === 'DIV')).toBe(true)
  })

  it('emits update:modelValue and change when a completed step is clicked', async () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 3, steps, clickable: true } })
    await wrapper.findAll('.seneu-stepper__step')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([{ from: 3, to: 1 }])
  })

  it('does not emit when the active/upcoming step is clicked even if clickable', async () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 1, steps, clickable: true } })
    await wrapper.findAll('.seneu-stepper__step')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})

describe('SeneuStepper — orientation', () => {
  it('defaults to horizontal', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 1, steps } })
    expect(wrapper.classes()).toContain('seneu-stepper--horizontal')
  })

  it('applies vertical class', () => {
    const wrapper = mount(SeneuStepper, { props: { modelValue: 1, steps, orientation: 'vertical' } })
    expect(wrapper.classes()).toContain('seneu-stepper--vertical')
  })
})

describe('SeneuStepper — loading', () => {
  it('shows skeleton steps instead of real steps', () => {
    const wrapper = mount(SeneuStepper, { props: { steps, loading: true } })
    expect(wrapper.find('.seneu-stepper__skeleton-circle').exists()).toBe(true)
    expect(wrapper.find('[role="listitem"]').exists()).toBe(false)
  })
})
