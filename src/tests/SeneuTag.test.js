import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuTag from '../components/display/SeneuTag.vue'

describe('SeneuTag — rendering', () => {
  it('renders as a <span> by default', () => {
    const wrapper = mount(SeneuTag, { slots: { default: 'Vue' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.find('.seneu-tag__label').text()).toBe('Vue')
  })

  it('renders as a <button> when clickable', () => {
    const wrapper = mount(SeneuTag, { props: { clickable: true }, slots: { default: 'Filter' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('renders the icon when provided', () => {
    const wrapper = mount(SeneuTag, { props: { icon: 'label' }, slots: { default: 'Feature' } })
    expect(wrapper.find('.seneu-tag__icon').exists()).toBe(true)
  })

  it('applies variant/type/size classes', () => {
    const wrapper = mount(SeneuTag, { props: { variant: 'danger', type: 'solid', size: 'lg' } })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['seneu-tag--danger', 'seneu-tag--solid', 'seneu-tag--lg']),
    )
  })
})

describe('SeneuTag — clickable / active', () => {
  it('emits click when clickable', async () => {
    const wrapper = mount(SeneuTag, { props: { clickable: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('sets aria-pressed to reflect active state when clickable', () => {
    const wrapper = mount(SeneuTag, { props: { clickable: true, active: true } })
    expect(wrapper.attributes('aria-pressed')).toBe('true')
  })

  it('applies the active class only when clickable and active', () => {
    const wrapper = mount(SeneuTag, { props: { clickable: true, active: true } })
    expect(wrapper.classes()).toContain('seneu-tag--active')
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(SeneuTag, { props: { clickable: true, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})

describe('SeneuTag — removable', () => {
  it('does not render a remove control by default', () => {
    const wrapper = mount(SeneuTag, { slots: { default: 'Vue' } })
    expect(wrapper.find('.seneu-tag__remove').exists()).toBe(false)
  })

  it('renders a remove control when removable', () => {
    const wrapper = mount(SeneuTag, { props: { removable: true }, slots: { default: 'Vue' } })
    expect(wrapper.find('.seneu-tag__remove').exists()).toBe(true)
  })

  it('emits remove when the remove control is clicked', async () => {
    const wrapper = mount(SeneuTag, { props: { removable: true } })
    await wrapper.find('.seneu-tag__remove').trigger('click')
    expect(wrapper.emitted('remove')).toBeTruthy()
  })

  it('emits remove on Enter/Space on the remove control', async () => {
    const wrapper = mount(SeneuTag, { props: { removable: true } })
    await wrapper.find('.seneu-tag__remove').trigger('keydown.enter')
    expect(wrapper.emitted('remove')?.length).toBe(1)
    await wrapper.find('.seneu-tag__remove').trigger('keydown.space')
    expect(wrapper.emitted('remove')?.length).toBe(2)
  })

  it('does not emit remove when disabled', async () => {
    const wrapper = mount(SeneuTag, { props: { removable: true, disabled: true } })
    await wrapper.find('.seneu-tag__remove').trigger('click')
    expect(wrapper.emitted('remove')).toBeFalsy()
  })

  it('does not bubble the remove click into a click on a clickable tag', async () => {
    const wrapper = mount(SeneuTag, { props: { clickable: true, removable: true } })
    await wrapper.find('.seneu-tag__remove').trigger('click')
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
