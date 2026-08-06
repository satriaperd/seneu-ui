import { describe, it, expect, beforeEach, vi } from 'vitest'

// useTheme has singleton module-level state (_initialized flag).
// Each describe block re-imports the module to keep state fresh.

function mockMatchMedia(prefersDark = false) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: prefersDark,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  vi.resetModules()
})

describe('useTheme — initial state', () => {
  it('defaults to light when system prefers light', async () => {
    mockMatchMedia(false)
    const { useTheme } = await import('../composables/useTheme.js')
    const { isDark } = useTheme()
    expect(isDark.value).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('defaults to dark when system prefers dark', async () => {
    mockMatchMedia(true)
    const { useTheme } = await import('../composables/useTheme.js')
    const { isDark } = useTheme()
    expect(isDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('respects stored "dark" over system preference', async () => {
    mockMatchMedia(false)
    localStorage.setItem('seneu-theme', 'dark')
    const { useTheme } = await import('../composables/useTheme.js')
    const { isDark } = useTheme()
    expect(isDark.value).toBe(true)
  })

  it('respects stored "light" over system preference', async () => {
    mockMatchMedia(true)
    localStorage.setItem('seneu-theme', 'light')
    const { useTheme } = await import('../composables/useTheme.js')
    const { isDark } = useTheme()
    expect(isDark.value).toBe(false)
  })
})

describe('useTheme — toggle()', () => {
  it('flips isDark from false to true', async () => {
    mockMatchMedia(false)
    const { useTheme } = await import('../composables/useTheme.js')
    const { isDark, toggle } = useTheme()
    toggle()
    expect(isDark.value).toBe(true)
  })

  it('flips isDark from true to false', async () => {
    mockMatchMedia(true)
    const { useTheme } = await import('../composables/useTheme.js')
    const { isDark, toggle } = useTheme()
    toggle()
    expect(isDark.value).toBe(false)
  })

  it('persists choice to localStorage', async () => {
    mockMatchMedia(false)
    const { useTheme } = await import('../composables/useTheme.js')
    const { toggle } = useTheme()
    toggle()
    expect(localStorage.getItem('seneu-theme')).toBe('dark')
    toggle()
    expect(localStorage.getItem('seneu-theme')).toBe('light')
  })

  it('toggles .dark class on documentElement', async () => {
    mockMatchMedia(false)
    const { useTheme } = await import('../composables/useTheme.js')
    const { toggle } = useTheme()
    toggle()
    await vi.waitFor(() =>
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    )
  })
})

describe('useTheme — setTheme()', () => {
  it('setTheme("dark") forces dark mode', async () => {
    mockMatchMedia(false)
    const { useTheme } = await import('../composables/useTheme.js')
    const { isDark, setTheme } = useTheme()
    setTheme('dark')
    expect(isDark.value).toBe(true)
    expect(localStorage.getItem('seneu-theme')).toBe('dark')
  })

  it('setTheme("light") forces light mode', async () => {
    mockMatchMedia(true)
    const { useTheme } = await import('../composables/useTheme.js')
    const { isDark, setTheme } = useTheme()
    setTheme('light')
    expect(isDark.value).toBe(false)
    expect(localStorage.getItem('seneu-theme')).toBe('light')
  })

  it('setTheme("system") removes override and follows OS', async () => {
    mockMatchMedia(true)
    localStorage.setItem('seneu-theme', 'light')
    const { useTheme } = await import('../composables/useTheme.js')
    const { isDark, setTheme } = useTheme()
    setTheme('system')
    expect(localStorage.getItem('seneu-theme')).toBeNull()
    expect(isDark.value).toBe(true)
  })
})

describe('useTheme — singleton', () => {
  it('multiple useTheme() calls share the same isDark ref', async () => {
    mockMatchMedia(false)
    const { useTheme } = await import('../composables/useTheme.js')
    const a = useTheme()
    const b = useTheme()
    expect(a.isDark).toBe(b.isDark)
  })

  it('toggle from one instance reflects in another', async () => {
    mockMatchMedia(false)
    const { useTheme } = await import('../composables/useTheme.js')
    const a = useTheme()
    const b = useTheme()
    a.toggle()
    expect(b.isDark.value).toBe(true)
  })
})
