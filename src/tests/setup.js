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

// jsdom doesn't implement ResizeObserver — used by SeneuChartWrapper to
// keep the chart instance sized to its container.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// jsdom doesn't implement matchMedia — used by useTheme (and any
// component that calls it, e.g. SeneuChartWrapper) to read the OS
// color-scheme preference. Individual tests can still override this
// with their own vi.fn() when they need to assert specific matches.
if (!globalThis.matchMedia) {
  globalThis.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
}

// jsdom doesn't implement pointer capture — used by SeneuColorPicker's
// saturation/value square and hue slider to keep receiving pointermove
// even if the cursor leaves the element bounds mid-drag.
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}
