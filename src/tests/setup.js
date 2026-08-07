import { vi } from 'vitest'

// jsdom in this environment doesn't provide a standard localStorage.
// Full mock so useTheme and other components can be tested correctly.
const createLocalStorageMock = () => {
  let store = {}
  return {
    getItem:    (key) => store[key] ?? null,
    setItem:    (key, val) => { store[key] = String(val) },
    removeItem: (key) => { delete store[key] },
    clear:      () => { store = {} },
    get length() { return Object.keys(store).length },
    key:        (i) => Object.keys(store)[i] ?? null,
  }
}

vi.stubGlobal('localStorage', createLocalStorageMock())

// jsdom doesn't implement the createObjectURL/revokeObjectURL pair used
// by SeneuFileUpload for image previews.
if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
if (!globalThis.URL.revokeObjectURL) globalThis.URL.revokeObjectURL = vi.fn()
