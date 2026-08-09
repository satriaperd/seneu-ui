import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuAlert from '../components/feedback/SeneuAlert.vue'

describe('SeneuAlert — rendering', () => {
  it('renders the default slot as the message', () => {
    const wrapper = mount(SeneuAlert, { slots: { default: 'Something happened.' } })
    expect(wrapper.find('.seneu-alert__message').text()).toBe('Something happened.')
  })

  it('applies variant/type modifier classes', () => {
    const wrapper = mount(SeneuAlert, { props: { variant: 'danger', type: 'solid' } })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['seneu-alert--danger', 'seneu-alert--solid']),
    )
  })

  it('defaults to info/subtle', () => {
    const wrapper = mount(SeneuAlert)
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['seneu-alert--info', 'seneu-alert--subtle']),
    )
  })

  it('renders the title when provided', () => {
    const wrapper = mount(SeneuAlert, { props: { title: 'Payment successful' } })
    expect(wrapper.find('.seneu-alert__title').text()).toBe('Payment successful')
  })

  it('does not render a title element when title is empty', () => {
    const wrapper = mount(SeneuAlert)
    expect(wrapper.find('.seneu-alert__title').exists()).toBe(false)
  })

  it('has role="alert"', () => {
    const wrapper = mount(SeneuAlert)
    expect(wrapper.attributes('role')).toBe('alert')
  })
})

describe('SeneuAlert — icon', () => {
  it('uses the default icon for the variant', () => {
    const wrapper = mount(SeneuAlert, { props: { variant: 'success' } })
    expect(wrapper.find('.seneu-alert__icon').text()).toBe('check_circle')
  })

  it('uses a custom icon when provided', () => {
    const wrapper = mount(SeneuAlert, { props: { icon: 'rocket_launch' } })
    expect(wrapper.find('.seneu-alert__icon').text()).toBe('rocket_launch')
  })
})

describe('SeneuAlert — actions slot', () => {
  it('does not render the actions wrapper without the actions slot', () => {
    const wrapper = mount(SeneuAlert)
    expect(wrapper.find('.seneu-alert__actions').exists()).toBe(false)
  })

  it('renders the actions slot when provided', () => {
    const wrapper = mount(SeneuAlert, {
      slots: { actions: '<button class="act">Retry</button>' },
    })
    expect(wrapper.find('.seneu-alert__actions .act').exists()).toBe(true)
  })
})

describe('SeneuAlert — dismissible', () => {
  it('does not render a close button by default', () => {
    const wrapper = mount(SeneuAlert)
    expect(wrapper.find('.seneu-alert__close').exists()).toBe(false)
  })

  it('renders a close button when dismissible', () => {
    const wrapper = mount(SeneuAlert, { props: { dismissible: true } })
    expect(wrapper.find('.seneu-alert__close').exists()).toBe(true)
  })

  it('emits close when the close button is clicked', async () => {
    const wrapper = mount(SeneuAlert, { props: { dismissible: true } })
    await wrapper.find('.seneu-alert__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
