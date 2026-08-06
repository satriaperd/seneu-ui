import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuDatePicker from '../components/form/SeneuDatePicker.vue'

describe('SeneuDatePicker — rendering', () => {
  it('renders a text input by default', () => {
    const wrapper = mount(SeneuDatePicker)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renders label when prop is set', () => {
    const wrapper = mount(SeneuDatePicker, { props: { label: 'Birth date' } })
    expect(wrapper.find('.seneu-datepicker__label').text()).toBe('Birth date')
  })

  it('does not render the popover until opened', () => {
    const wrapper = mount(SeneuDatePicker)
    expect(wrapper.find('.seneu-datepicker__popover').exists()).toBe(false)
  })

  it('opens the popover on input focus', async () => {
    const wrapper = mount(SeneuDatePicker)
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.seneu-datepicker__popover').exists()).toBe(true)
  })

  it('renders weekday header with 7 columns', async () => {
    const wrapper = mount(SeneuDatePicker)
    await wrapper.find('input').trigger('focus')
    expect(wrapper.findAll('.seneu-datepicker__dow')).toHaveLength(7)
  })
})

describe('SeneuDatePicker — single mode formatting', () => {
  it('formats modelValue using the default format', () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 5) } })
    expect(wrapper.find('input').element.value).toBe('05/03/2026')
  })

  it('formats modelValue using a custom format', () => {
    const wrapper = mount(SeneuDatePicker, {
      props: { modelValue: new Date(2026, 2, 5), format: 'YYYY-MM-DD' },
    })
    expect(wrapper.find('input').element.value).toBe('2026-03-05')
  })

  it('renders full month name with MMMM token', () => {
    const wrapper = mount(SeneuDatePicker, {
      props: { modelValue: new Date(2026, 2, 5), format: 'DD MMMM YYYY' },
    })
    expect(wrapper.find('input').element.value).toBe('05 Maret 2026')
  })

  it('shows empty input when modelValue is null', () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: null } })
    expect(wrapper.find('input').element.value).toBe('')
  })
})

describe('SeneuDatePicker — single mode selection', () => {
  it('emits update:modelValue with a Date when a day is clicked', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 5) } })
    await wrapper.find('input').trigger('focus')
    const selected = wrapper.find('.seneu-datepicker__day--selected')
    expect(selected.exists()).toBe(true)
    await selected.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0].getDate()).toBe(5)
  })

  it('closes the popover after selecting a day', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 5) } })
    await wrapper.find('input').trigger('focus')
    await wrapper.find('.seneu-datepicker__day--selected').trigger('click')
    expect(wrapper.find('.seneu-datepicker__popover').exists()).toBe(false)
  })

  it('marks today with the today class', async () => {
    const wrapper = mount(SeneuDatePicker)
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.seneu-datepicker__day--today').exists()).toBe(true)
  })
})

describe('SeneuDatePicker — typed input', () => {
  it('parses and commits a valid typed date on blur', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: null } })
    const input = wrapper.find('input')
    await input.setValue('15/06/2026')
    await input.trigger('blur')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const d = emitted[emitted.length - 1][0]
    expect(d.getDate()).toBe(15)
    expect(d.getMonth()).toBe(5)
    expect(d.getFullYear()).toBe(2026)
  })

  it('reverts to the last valid value when typed text is invalid', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 5) } })
    const input = wrapper.find('input')
    await input.setValue('not a date')
    await input.trigger('blur')
    expect(input.element.value).toBe('05/03/2026')
  })

  it('clears modelValue when typed text is emptied', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 5) } })
    const input = wrapper.find('input')
    await input.setValue('')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })
})

describe('SeneuDatePicker — min/max/disabled dates', () => {
  it('disables days before minDate', async () => {
    const minDate = new Date(2026, 2, 10)
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 15), minDate } })
    await wrapper.find('input').trigger('focus')
    const days = wrapper.findAll('.seneu-datepicker__day')
    const day5 = days.find(d => d.text() === '5' && !d.classes().includes('seneu-datepicker__day--out'))
    expect(day5.attributes('disabled')).toBeDefined()
  })

  it('disables days after maxDate', async () => {
    const maxDate = new Date(2026, 2, 20)
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 15), maxDate } })
    await wrapper.find('input').trigger('focus')
    const days = wrapper.findAll('.seneu-datepicker__day')
    const day25 = days.find(d => d.text() === '25' && !d.classes().includes('seneu-datepicker__day--out'))
    expect(day25.attributes('disabled')).toBeDefined()
  })

  it('disables dates matched by the disabledDates predicate', async () => {
    const wrapper = mount(SeneuDatePicker, {
      props: { modelValue: new Date(2026, 2, 15), disabledDates: d => d.getDate() === 13 },
    })
    await wrapper.find('input').trigger('focus')
    const days = wrapper.findAll('.seneu-datepicker__day')
    const day13 = days.find(d => d.text() === '13' && !d.classes().includes('seneu-datepicker__day--out'))
    expect(day13.attributes('disabled')).toBeDefined()
  })

  it('does not emit when clicking a disabled day', async () => {
    const wrapper = mount(SeneuDatePicker, {
      props: { modelValue: new Date(2026, 2, 15), disabledDates: d => d.getDate() === 13 },
    })
    await wrapper.find('input').trigger('focus')
    const days = wrapper.findAll('.seneu-datepicker__day')
    const day13 = days.find(d => d.text() === '13' && !d.classes().includes('seneu-datepicker__day--out'))
    await day13.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})

describe('SeneuDatePicker — clear', () => {
  it('shows clear button when a value is set and clearable', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 5) } })
    expect(wrapper.find('.seneu-datepicker__icon-btn--clear').exists()).toBe(true)
  })

  it('does not show clear button when clearable is false', () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 5), clearable: false } })
    expect(wrapper.find('.seneu-datepicker__icon-btn--clear').exists()).toBe(false)
  })

  it('emits null and clear event on clear click', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 5) } })
    await wrapper.find('.seneu-datepicker__icon-btn--clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('clear')).toBeTruthy()
  })
})

describe('SeneuDatePicker — range mode', () => {
  it('renders two inputs in range mode', () => {
    const wrapper = mount(SeneuDatePicker, { props: { range: true } })
    expect(wrapper.findAll('input')).toHaveLength(2)
  })

  it('renders start/end labels', () => {
    const wrapper = mount(SeneuDatePicker, {
      props: { range: true, labelStart: 'From', labelEnd: 'To' },
    })
    const labels = wrapper.findAll('.seneu-datepicker__sublabel')
    expect(labels[0].text()).toBe('From')
    expect(labels[1].text()).toBe('To')
  })

  it('formats start/end values', () => {
    const wrapper = mount(SeneuDatePicker, {
      props: { range: true, modelValue: { start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) } },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs[0].element.value).toBe('01/01/2026')
    expect(inputs[1].element.value).toBe('10/01/2026')
  })

  it('selects a range across two day clicks', async () => {
    const wrapper = mount(SeneuDatePicker, {
      props: { range: true, modelValue: { start: null, end: null } },
    })
    await wrapper.find('input').trigger('focus')
    const days = wrapper.findAll('.seneu-datepicker__day').filter(d => !d.classes().includes('seneu-datepicker__day--out'))
    await days[4].trigger('click')
    await days[9].trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    const last = emitted[emitted.length - 1][0]
    expect(last.start).toBeInstanceOf(Date)
    expect(last.end).toBeInstanceOf(Date)
    expect(last.start.getTime()).toBeLessThanOrEqual(last.end.getTime())
  })

  it('shows presets when showPresets is true', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { range: true, showPresets: true } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.findAll('.seneu-datepicker__preset-btn').length).toBeGreaterThan(0)
  })

  it('applies a preset range on click', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { range: true, showPresets: true } })
    await wrapper.find('input').trigger('focus')
    await wrapper.find('.seneu-datepicker__preset-btn').trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const val = emitted[emitted.length - 1][0]
    expect(val.start).toBeInstanceOf(Date)
    expect(val.end).toBeInstanceOf(Date)
  })
})

describe('SeneuDatePicker — native mode', () => {
  it('renders input[type=date] when native is true', () => {
    const wrapper = mount(SeneuDatePicker, { props: { native: true } })
    expect(wrapper.find('input[type="date"]').exists()).toBe(true)
  })

  it('does not render the calendar popover in native mode', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { native: true } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.seneu-datepicker__popover').exists()).toBe(false)
  })

  it('emits a Date on native change', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { native: true } })
    await wrapper.find('input').setValue('2026-07-20')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const d = emitted[0][0]
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(6)
    expect(d.getDate()).toBe(20)
  })
})

describe('SeneuDatePicker — size', () => {
  const sizes = ['sm', 'base', 'lg']

  for (const size of sizes) {
    it(`applies .seneu-datepicker--${size} class`, () => {
      const wrapper = mount(SeneuDatePicker, { props: { size } })
      expect(wrapper.classes()).toContain(`seneu-datepicker--${size}`)
    })
  }

  it('defaults to base size', () => {
    const wrapper = mount(SeneuDatePicker)
    expect(wrapper.classes()).toContain('seneu-datepicker--base')
  })
})

describe('SeneuDatePicker — disabled', () => {
  it('sets disabled attribute on input', () => {
    const wrapper = mount(SeneuDatePicker, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('does not open the popover when disabled', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { disabled: true } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.seneu-datepicker__popover').exists()).toBe(false)
  })
})

describe('SeneuDatePicker — hint & error', () => {
  it('shows hint message text', () => {
    const wrapper = mount(SeneuDatePicker, { props: { hint: 'Pick a date' } })
    expect(wrapper.find('.seneu-datepicker__message--hint').text()).toContain('Pick a date')
  })

  it('applies error class and shows error message', () => {
    const wrapper = mount(SeneuDatePicker, { props: { error: 'Required' } })
    expect(wrapper.classes()).toContain('seneu-datepicker--error')
    expect(wrapper.find('.seneu-datepicker__message--error').text()).toContain('Required')
  })
})

describe('SeneuDatePicker — loading', () => {
  it('shows spinner when loading is true', () => {
    const wrapper = mount(SeneuDatePicker, { props: { loading: true } })
    expect(wrapper.find('.seneu-datepicker__spinner').exists()).toBe(true)
  })

  it('applies .seneu-datepicker--loading class', () => {
    const wrapper = mount(SeneuDatePicker, { props: { loading: true } })
    expect(wrapper.classes()).toContain('seneu-datepicker--loading')
  })
})

describe('SeneuDatePicker — keyboard navigation', () => {
  it('moves the active day by one with ArrowRight', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 5) } })
    await wrapper.find('input').trigger('focus')
    const grid = wrapper.find('.seneu-datepicker__popover')
    await grid.trigger('keydown', { key: 'ArrowRight' })
    const activeDay = wrapper.find('[tabindex="0"].seneu-datepicker__day')
    expect(activeDay.text()).toBe('6')
  })

  it('selects the active day on Enter', async () => {
    const wrapper = mount(SeneuDatePicker, { props: { modelValue: new Date(2026, 2, 5) } })
    await wrapper.find('input').trigger('focus')
    const grid = wrapper.find('.seneu-datepicker__popover')
    await grid.trigger('keydown', { key: 'Enter' })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0].getDate()).toBe(5)
  })
})
