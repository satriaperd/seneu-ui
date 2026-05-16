import { vi } from 'vitest'

// jsdom di environment ini tidak provide localStorage standard.
// Mock lengkap agar useTheme dan komponen lain bisa ditest dengan benar.
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
