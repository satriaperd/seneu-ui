import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuSearchBar from '../components/form/SeneuSearchBar.vue'

const SUGGESTIONS = [
  { label: 'Dashboard Analytics', sub: 'Page', type: 'Pages', icon: 'dashboard' },
  { label: 'Satria Perdana', sub: 'satria@example.com', type: 'Users', icon: 'person' },
]

describe('SeneuSearchBar — rendering', () => {
  it('renders a text input by default', () => {
    const wrapper = mount(SeneuSearchBar)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renders label when prop is set', () => {
    const wrapper = mount(SeneuSearchBar, { props: { label: 'Search' } })
    expect(wrapper.find('.seneu-searchbar__label').text()).toBe('Search')
  })

  it('renders placeholder', () => {
    const wrapper = mount(SeneuSearchBar, { props: { placeholder: 'Find anything…' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Find anything…')
  })

  it('does not show the dropdown until focused', () => {
    const wrapper = mount(SeneuSearchBar)
    expect(wrapper.find('.seneu-searchbar__dropdown').exists()).toBe(false)
  })
})

describe('SeneuSearchBar — v-model', () => {
  it('reflects modelValue in the input', () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'hello' } })
    expect(wrapper.find('input').element.value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('world')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world'])
  })

  it('opens the dropdown on input', async () => {
    const wrapper = mount(SeneuSearchBar)
    await wrapper.find('input').setValue('a')
    expect(wrapper.find('.seneu-searchbar__dropdown').exists()).toBe(true)
  })
})

describe('SeneuSearchBar — clear', () => {
  it('shows the clear button when a value is set', () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'hello' } })
    expect(wrapper.find('.seneu-searchbar__clear').exists()).toBe(true)
  })

  it('hides the clear button when clearable is false', () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'hello', clearable: false } })
    expect(wrapper.find('.seneu-searchbar__clear').exists()).toBe(false)
  })

  it('emits empty string and clear event on clear click', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'hello' } })
    await wrapper.find('.seneu-searchbar__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toBeTruthy()
  })
})

describe('SeneuSearchBar — suggestions', () => {
  it('groups suggestions by type', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'a', suggestions: SUGGESTIONS } })
    await wrapper.find('input').trigger('focus')
    const headers = wrapper.findAll('.seneu-searchbar__group-header')
    expect(headers.map(h => h.text())).toEqual(['Pages', 'Users'])
  })

  it('renders one item per suggestion', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'a', suggestions: SUGGESTIONS } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.findAll('.seneu-searchbar__item')).toHaveLength(2)
  })

  it('emits select and update:modelValue when a suggestion is clicked', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'dash', suggestions: SUGGESTIONS } })
    await wrapper.find('input').trigger('focus')
    await wrapper.find('.seneu-searchbar__item').trigger('click')
    expect(wrapper.emitted('select')?.[0][0].label).toBe('Dashboard Analytics')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Dashboard Analytics'])
  })

  it('shows the no-results state when suggestions are empty and query is set', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'xyz', suggestions: [] } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.seneu-searchbar__empty--noresult').exists()).toBe(true)
  })
})

describe('SeneuSearchBar — recent searches', () => {
  it('shows recent searches when query is empty', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: '', recentSearches: ['foo', 'bar'] } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.findAll('.seneu-searchbar__item')).toHaveLength(2)
  })

  it('shows empty message when there are no recent searches', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: '', recentSearches: [] } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.seneu-searchbar__empty').text()).toContain('Belum ada pencarian terbaru')
  })

  it('emits update:recentSearches without the removed entry', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: '', recentSearches: ['foo', 'bar'] } })
    await wrapper.find('input').trigger('focus')
    await wrapper.find('.seneu-searchbar__item-remove').trigger('click')
    expect(wrapper.emitted('update:recentSearches')?.[0][0]).toEqual(['bar'])
  })

  it('emits an empty array on clear all', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: '', recentSearches: ['foo', 'bar'] } })
    await wrapper.find('input').trigger('focus')
    await wrapper.find('.seneu-searchbar__clear-recent').trigger('click')
    expect(wrapper.emitted('update:recentSearches')?.[0][0]).toEqual([])
  })

  it('falls through to suggestions when showRecent is false, even with an empty query', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: '', recentSearches: ['foo'], showRecent: false, suggestions: SUGGESTIONS } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.seneu-searchbar__item').text()).not.toContain('foo')
    expect(wrapper.find('.seneu-searchbar__group-header').text()).toBe('Pages')
  })

  it('shows the no-results state when showRecent is false and there are no suggestions either', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: '', recentSearches: ['foo'], showRecent: false, suggestions: [] } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.seneu-searchbar__item').exists()).toBe(false)
    expect(wrapper.find('.seneu-searchbar__empty--noresult').exists()).toBe(true)
  })
})

describe('SeneuSearchBar — keyboard navigation', () => {
  it('moves active index down with ArrowDown', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'a', suggestions: SUGGESTIONS } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.findAll('.seneu-searchbar__item')[0].classes()).toContain('seneu-searchbar__item--active')
  })

  it('selects the active item on Enter', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'a', suggestions: SUGGESTIONS } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Dashboard Analytics'])
  })

  it('emits search on Enter when no item is active', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'freeform query' } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('search')?.[0]).toEqual(['freeform query'])
  })

  it('closes the dropdown on Escape', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'a' } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.find('.seneu-searchbar__dropdown').exists()).toBe(true)
    await input.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.seneu-searchbar__dropdown').exists()).toBe(false)
  })
})

describe('SeneuSearchBar — debounce', () => {
  it('does not emit search immediately while typing when debounce is 0', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('a')
    expect(wrapper.emitted('search')).toBeFalsy()
  })

  it('emits search after the debounce delay', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: '', debounce: 300 } })
    await wrapper.find('input').setValue('a')
    vi.advanceTimersByTime(300)
    expect(wrapper.emitted('search')?.[0]).toEqual(['a'])
    vi.useRealTimers()
  })
})

describe('SeneuSearchBar — min characters', () => {
  it('shows a min-chars message before the threshold is reached', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'ab', minChars: 3, suggestions: SUGGESTIONS } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.seneu-searchbar__empty').text()).toContain('3 karakter')
  })
})

describe('SeneuSearchBar — variants', () => {
  it('renders a button for the trigger variant', () => {
    const wrapper = mount(SeneuSearchBar, { props: { variant: 'trigger', placeholder: 'Search…' } })
    expect(wrapper.find('button.seneu-searchbar__wrapper--trigger').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('shows the shortcut badge in trigger variant', () => {
    const wrapper = mount(SeneuSearchBar, { props: { variant: 'trigger', shortcut: '⌘K' } })
    expect(wrapper.find('.seneu-searchbar__kbd').text()).toBe('⌘K')
  })

  it('emits trigger on click', async () => {
    const wrapper = mount(SeneuSearchBar, { props: { variant: 'trigger' } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('trigger')).toBeTruthy()
  })

  it('applies compact modifier class', () => {
    const wrapper = mount(SeneuSearchBar, { props: { variant: 'compact' } })
    expect(wrapper.find('.seneu-searchbar--compact').exists()).toBe(true)
  })
})

describe('SeneuSearchBar — size', () => {
  const sizes = ['sm', 'base', 'lg']
  for (const size of sizes) {
    it(`applies .seneu-searchbar--${size} class`, () => {
      const wrapper = mount(SeneuSearchBar, { props: { size } })
      expect(wrapper.classes()).toContain(`seneu-searchbar--${size}`)
    })
  }
})

describe('SeneuSearchBar — disabled & loading', () => {
  it('sets disabled attribute on input', () => {
    const wrapper = mount(SeneuSearchBar, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('shows a spinner icon when loading', () => {
    const wrapper = mount(SeneuSearchBar, { props: { loading: true } })
    expect(wrapper.find('.seneu-searchbar__icon--spin').exists()).toBe(true)
  })
})

describe('SeneuSearchBar — hint & error', () => {
  it('shows hint message text', () => {
    const wrapper = mount(SeneuSearchBar, { props: { hint: 'Try a product name' } })
    expect(wrapper.find('.seneu-searchbar__message--hint').text()).toContain('Try a product name')
  })

  it('applies error class and shows error message', () => {
    const wrapper = mount(SeneuSearchBar, { props: { error: 'No results' } })
    expect(wrapper.find('.seneu-searchbar__wrapper--error').exists()).toBe(true)
    expect(wrapper.find('.seneu-searchbar__message--error').text()).toContain('No results')
  })
})

describe('SeneuSearchBar — XSS safety', () => {
  it('escapes HTML in suggestion labels instead of rendering it', async () => {
    const malicious = [{ label: '<img src=x onerror=alert(1)>', type: 'Pages' }]
    const wrapper = mount(SeneuSearchBar, { props: { modelValue: 'img', suggestions: malicious } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.seneu-searchbar__item-label').find('img').exists()).toBe(false)
    expect(wrapper.html()).not.toContain('<img src=x')
    expect(wrapper.html()).toContain('&lt;')
  })
})
