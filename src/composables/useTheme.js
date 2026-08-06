import { ref, watch } from 'vue'

const STORAGE_KEY = 'seneu-theme'

// Singleton — one state for the whole app.
// Every useTheme() call shares the same isDark.
const isDark = ref(false)
let _initialized = false

function applyClass(dark) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', dark)
}

function initializeTheme() {
  if (_initialized || typeof window === 'undefined') return
  _initialized = true

  const stored = localStorage.getItem(STORAGE_KEY)

  isDark.value = stored
    ? stored === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches

  applyClass(isDark.value)

  // Sync to the DOM every time isDark changes
  watch(isDark, applyClass)

  // Follow system preference changes — but only if the user hasn't set an override
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        isDark.value = e.matches
      }
    })
}

/**
 * Composable for light/dark theme control.
 *
 * @example
 * const { isDark, toggle, setTheme } = useTheme()
 *
 * toggle()              // flip between light and dark
 * setTheme('dark')      // force dark
 * setTheme('light')     // force light
 * setTheme('system')    // follow OS preference, clear override
 */
export function useTheme() {
  initializeTheme()

  /** Flip between light and dark, persist to localStorage. */
  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
  }

  /**
   * Set the theme explicitly.
   * @param {'light' | 'dark' | 'system'} theme
   */
  function setTheme(theme) {
    if (theme === 'system') {
      localStorage.removeItem(STORAGE_KEY)
      isDark.value =
        typeof window !== 'undefined'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : false
    } else {
      isDark.value = theme === 'dark'
      localStorage.setItem(STORAGE_KEY, theme)
    }
  }

  return { isDark, toggle, setTheme }
}
