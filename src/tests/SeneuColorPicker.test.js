import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuColorPicker from '../components/form/SeneuColorPicker.vue'

describe('SeneuColorPicker — rendering', () => {
  it('renders a trigger button', () => {
    const wrapper = mount(SeneuColorPicker)
    expect(wrapper.find('.seneu-colorpicker__trigger').exists()).toBe(true)
  })

  it('renders label when prop is set', () => {
    const wrapper = mount(SeneuColorPicker, { props: { label: 'Brand color' } })
    expect(wrapper.find('.seneu-colorpicker__label').text()).toBe('Brand color')
  })

  it('shows placeholder text when modelValue is empty', () => {
    const wrapper = mount(SeneuColorPicker)
    expect(wrapper.find('.seneu-colorpicker__trigger-text').text()).toBe('Pilih warna')
  })

  it('shows modelValue as trigger text when set', () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '#FC7A1E' } })
    expect(wrapper.find('.seneu-colorpicker__trigger-text').text()).toBe('#FC7A1E')
  })

  it('does not render the popover until opened', () => {
    const wrapper = mount(SeneuColorPicker)
    expect(wrapper.find('.seneu-colorpicker__popover').exists()).toBe(false)
  })

  it('opens the popover when the trigger is clicked', async () => {
    const wrapper = mount(SeneuColorPicker)
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.seneu-colorpicker__popover').exists()).toBe(true)
  })

  it('closes the popover on a second trigger click', async () => {
    const wrapper = mount(SeneuColorPicker)
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.seneu-colorpicker__popover').exists()).toBe(false)
  })

  it('closes the popover on Escape', async () => {
    const wrapper = mount(SeneuColorPicker, { attachTo: document.body })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.seneu-colorpicker__popover').exists()).toBe(true)
    await document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.seneu-colorpicker__popover').exists()).toBe(false)
    wrapper.unmount()
  })

  it('closes the popover on outside pointerdown', async () => {
    const wrapper = mount(SeneuColorPicker, { attachTo: document.body })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.seneu-colorpicker__popover').exists()).toBe(true)
    document.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.seneu-colorpicker__popover').exists()).toBe(false)
    wrapper.unmount()
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { disabled: true } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.seneu-colorpicker__popover').exists()).toBe(false)
  })
})

describe('SeneuColorPicker — format parsing (modelValue -> picker state)', () => {
  it('parses a hex modelValue', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '#FC7A1E' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.seneu-colorpicker__preview').attributes('style')).toContain('252, 122, 30')
  })

  it('parses a short hex modelValue', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '#f00' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.seneu-colorpicker__preview').attributes('style')).toContain('255, 0, 0')
  })

  it('parses an rgb() modelValue', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'rgb(99, 102, 241)' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.seneu-colorpicker__preview').attributes('style')).toContain('99, 102, 241')
  })

  it('parses an hsl() modelValue', async () => {
    // hsl(0, 100%, 50%) is pure red
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'hsl(0, 100%, 50%)' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.seneu-colorpicker__preview').attributes('style')).toContain('255, 0, 0')
  })

  it('parses an hsv() modelValue', async () => {
    // hsv(0, 100%, 100%) is pure red
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'hsv(0, 100%, 100%)' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    expect(wrapper.find('.seneu-colorpicker__preview').attributes('style')).toContain('255, 0, 0')
  })

  it('ignores an unparseable modelValue and keeps the previous state', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'not-a-color' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    // falls back to the default starting color rather than crashing
    expect(wrapper.find('.seneu-colorpicker__preview').exists()).toBe(true)
  })
})

describe('SeneuColorPicker — format emission (picker state -> modelValue)', () => {
  it('emits a hex string by default when a preset is picked', async () => {
    const wrapper = mount(SeneuColorPicker, {
      props: { modelValue: '', presets: ['#0D9488'] },
    })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__preset').trigger('click')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['#0D9488'])
  })

  it('emits an rgb() string when format="rgb"', async () => {
    const wrapper = mount(SeneuColorPicker, {
      props: { modelValue: '', format: 'rgb', presets: ['#0D9488'] },
    })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__preset').trigger('click')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['rgb(13, 148, 136)'])
  })

  it('emits an hsl() string when format="hsl"', async () => {
    const wrapper = mount(SeneuColorPicker, {
      props: { modelValue: '', format: 'hsl', presets: ['#FF0000'] },
    })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__preset').trigger('click')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['hsl(0, 100%, 50%)'])
  })

  it('emits an hsv() string when format="hsv"', async () => {
    const wrapper = mount(SeneuColorPicker, {
      props: { modelValue: '', format: 'hsv', presets: ['#FF0000'] },
    })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__preset').trigger('click')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['hsv(0, 100%, 100%)'])
  })

  it('also emits a change event alongside update:modelValue', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '', presets: ['#0D9488'] } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__preset').trigger('click')
    expect(wrapper.emitted('change')[0]).toEqual(['#0D9488'])
  })
})

describe('SeneuColorPicker — hex text input', () => {
  it('committing a valid hex on Enter updates the preview and emits', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '#000000' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    const input = wrapper.find('.seneu-colorpicker__input--hex')
    await input.setValue('#00FF00')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['#00FF00'])
  })

  it('committing an invalid hex on blur reverts to the current color', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '#123456' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    const input = wrapper.find('.seneu-colorpicker__input--hex')
    await input.setValue('not-hex')
    await input.trigger('blur')
    expect(input.element.value).toBe('#123456')
  })
})

describe('SeneuColorPicker — RGB/HSL/HSV tabs', () => {
  it('switches to the RGB tab and shows 3 number inputs', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '#0D9488' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    const tabs = wrapper.findAll('.seneu-colorpicker__tab')
    await tabs[1].trigger('click') // RGB
    const inputs = wrapper.findAll('.seneu-colorpicker__input-group input')
    expect(inputs).toHaveLength(3)
    expect(inputs[0].element.value).toBe('13')
    expect(inputs[1].element.value).toBe('148')
    expect(inputs[2].element.value).toBe('136')
  })

  it('editing an RGB field commits and emits', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '#0D9488' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.findAll('.seneu-colorpicker__tab')[1].trigger('click')
    const inputs = wrapper.findAll('.seneu-colorpicker__input-group input')
    await inputs[0].setValue(255)
    await inputs[0].trigger('change')
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toBe('#FF9488')
  })

  it('switches to the HSL tab and shows H/S/L values', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '#FF0000' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.findAll('.seneu-colorpicker__tab')[2].trigger('click') // HSL
    const inputs = wrapper.findAll('.seneu-colorpicker__input-group input')
    expect(inputs[0].element.value).toBe('0')
    expect(inputs[1].element.value).toBe('100')
    expect(inputs[2].element.value).toBe('50')
  })

  it('switches to the HSV tab and shows H/S/V values', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '#FF0000' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.findAll('.seneu-colorpicker__tab')[3].trigger('click') // HSV
    const inputs = wrapper.findAll('.seneu-colorpicker__input-group input')
    expect(inputs[0].element.value).toBe('0')
    expect(inputs[1].element.value).toBe('100')
    expect(inputs[2].element.value).toBe('100')
  })
})

describe('SeneuColorPicker — saturation/value square keyboard', () => {
  it('ArrowRight increases saturation and emits', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'hsv(0, 50%, 100%)', format: 'hsv' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__sv').trigger('keydown', { key: 'ArrowRight' })
    const [value] = wrapper.emitted('update:modelValue').at(-1)
    expect(value).toBe('hsv(0, 51%, 100%)')
  })

  it('Shift+ArrowUp increases brightness by 10', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'hsv(0, 100%, 50%)', format: 'hsv' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__sv').trigger('keydown', { key: 'ArrowUp', shiftKey: true })
    const [value] = wrapper.emitted('update:modelValue').at(-1)
    expect(value).toBe('hsv(0, 100%, 60%)')
  })

  it('does not go below 0 or above 100', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'hsv(0, 0%, 0%)', format: 'hsv' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__sv').trigger('keydown', { key: 'ArrowLeft' })
    await wrapper.find('.seneu-colorpicker__sv').trigger('keydown', { key: 'ArrowDown' })
    const [value] = wrapper.emitted('update:modelValue').at(-1)
    expect(value).toBe('hsv(0, 0%, 0%)')
  })
})

describe('SeneuColorPicker — hue slider keyboard', () => {
  it('ArrowRight increases hue and emits', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'hsv(100, 100%, 100%)', format: 'hsv' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__hue').trigger('keydown', { key: 'ArrowRight' })
    const [value] = wrapper.emitted('update:modelValue').at(-1)
    expect(value).toBe('hsv(101, 100%, 100%)')
  })

  it('wraps from 359 back to 0', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'hsv(359, 100%, 100%)', format: 'hsv' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__hue').trigger('keydown', { key: 'ArrowRight' })
    const [value] = wrapper.emitted('update:modelValue').at(-1)
    expect(value).toBe('hsv(0, 100%, 100%)')
  })

  it('Home sets hue to 0, End sets hue to 359', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'hsv(100, 100%, 100%)', format: 'hsv' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    await wrapper.find('.seneu-colorpicker__hue').trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toBe('hsv(359, 100%, 100%)')
    await wrapper.find('.seneu-colorpicker__hue').trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toBe('hsv(0, 100%, 100%)')
  })
})

describe('SeneuColorPicker — pointer drag', () => {
  afterEach(() => { vi.restoreAllMocks() })

  it('dragging on the SV square sets saturation/value from pointer position', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'hsv(0, 0%, 0%)', format: 'hsv' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    const sv = wrapper.find('.seneu-colorpicker__sv')
    vi.spyOn(sv.element, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 200, height: 140, right: 200, bottom: 140, x: 0, y: 0, toJSON() {},
    })
    sv.element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 100, clientY: 0, pointerId: 1, bubbles: true }))
    await wrapper.vm.$nextTick()
    const [value] = wrapper.emitted('update:modelValue').at(-1)
    // x=100/200 -> s=50%, y=0/140 -> v=100%
    expect(value).toBe('hsv(0, 50%, 100%)')
  })

  it('dragging on the hue slider sets hue from pointer position', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: 'hsv(0, 100%, 100%)', format: 'hsv' } })
    await wrapper.find('.seneu-colorpicker__trigger').trigger('click')
    const hue = wrapper.find('.seneu-colorpicker__hue')
    vi.spyOn(hue.element, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 200, height: 12, right: 200, bottom: 12, x: 0, y: 0, toJSON() {},
    })
    hue.element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 100, clientY: 0, pointerId: 1, bubbles: true }))
    await wrapper.vm.$nextTick()
    const [value] = wrapper.emitted('update:modelValue').at(-1)
    // x=100/200 -> h=180
    expect(value).toBe('hsv(180, 100%, 100%)')
  })
})

describe('SeneuColorPicker — clearable', () => {
  it('shows the clear button only when clearable and a value is set', () => {
    const withValue = mount(SeneuColorPicker, { props: { modelValue: '#FC7A1E', clearable: true } })
    expect(withValue.find('.seneu-colorpicker__clear-btn').exists()).toBe(true)

    const noValue = mount(SeneuColorPicker, { props: { modelValue: '', clearable: true } })
    expect(noValue.find('.seneu-colorpicker__clear-btn').exists()).toBe(false)

    const notClearable = mount(SeneuColorPicker, { props: { modelValue: '#FC7A1E', clearable: false } })
    expect(notClearable.find('.seneu-colorpicker__clear-btn').exists()).toBe(false)
  })

  it('clicking clear emits an empty modelValue and a clear event', async () => {
    const wrapper = mount(SeneuColorPicker, { props: { modelValue: '#FC7A1E', clearable: true } })
    await wrapper.find('.seneu-colorpicker__clear-btn').trigger('click')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toBeTruthy()
  })
})

describe('SeneuColorPicker — states', () => {
  it('applies the error class and message', () => {
    const wrapper = mount(SeneuColorPicker, { props: { error: 'Wajib diisi' } })
    expect(wrapper.classes()).toContain('seneu-colorpicker--error')
    expect(wrapper.find('.seneu-colorpicker__message--error').text()).toContain('Wajib diisi')
  })

  it('applies the disabled class and disables the trigger', () => {
    const wrapper = mount(SeneuColorPicker, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('seneu-colorpicker--disabled')
    expect(wrapper.find('.seneu-colorpicker__trigger').attributes('disabled')).toBeDefined()
  })

  it('shows a spinner icon when loading', () => {
    const wrapper = mount(SeneuColorPicker, { props: { loading: true } })
    expect(wrapper.find('.seneu-colorpicker__spinner').exists()).toBe(true)
  })

  it('renders hint text when no error is present', () => {
    const wrapper = mount(SeneuColorPicker, { props: { hint: 'Optional' } })
    expect(wrapper.find('.seneu-colorpicker__message--hint').text()).toBe('Optional')
  })
})

describe('SeneuColorPicker — sizes', () => {
  it.each(['sm', 'base', 'lg'])('applies the %s size class', size => {
    const wrapper = mount(SeneuColorPicker, { props: { size } })
    expect(wrapper.classes()).toContain(`seneu-colorpicker--${size}`)
  })
})
