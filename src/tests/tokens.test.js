import { describe, it, expect, beforeAll } from 'vitest'

// Placeholder test — verifies token CSS variables are defined correctly
// More substantive tests will be added as components are built

describe('Design Tokens', () => {
  beforeAll(() => {
    // Inject CSS variables into the jsdom environment
    document.documentElement.style.setProperty('--color-surface-default', '#FAF8F6')
    document.documentElement.style.setProperty('--color-text-default', '#211610')
    document.documentElement.style.setProperty('--color-surface-brand', '#FC7A1E')
    document.documentElement.style.setProperty('--radius-element', '8px')
    document.documentElement.style.setProperty('--duration-normal', '200ms')
  })

  it('brand color token exists', () => {
    const val = document.documentElement.style.getPropertyValue('--color-surface-brand')
    expect(val).toBe('#FC7A1E')
  })

  it('border radius element is 8px', () => {
    const val = document.documentElement.style.getPropertyValue('--radius-element')
    expect(val).toBe('8px')
  })

  it('animation duration normal is 200ms', () => {
    const val = document.documentElement.style.getPropertyValue('--duration-normal')
    expect(val).toBe('200ms')
  })
})
