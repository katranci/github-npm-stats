Object.defineProperty(window, "fetch", {
  value: vi.fn(),
  configurable: false,
  writable: false
})
