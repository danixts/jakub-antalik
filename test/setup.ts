import { vi } from 'vitest'

class ObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  value: ObserverStub,
  configurable: true,
})
Object.defineProperty(globalThis, 'IntersectionObserver', {
  value: ObserverStub,
  configurable: true,
})
Object.defineProperty(window, 'ResizeObserver', {
  value: ObserverStub,
  configurable: true,
})
Object.defineProperty(window, 'IntersectionObserver', {
  value: ObserverStub,
  configurable: true,
})
Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
Object.defineProperty(globalThis, 'requestAnimationFrame', {
  configurable: true,
  value: vi.fn(() => 1),
})
Object.defineProperty(globalThis, 'cancelAnimationFrame', {
  configurable: true,
  value: vi.fn(),
})
