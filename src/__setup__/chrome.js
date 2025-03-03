Object.defineProperty(window, "chrome", {
  value: {
    runtime: {
      lastError: null
    },
    storage: {
      local: {
        get: vi.fn(),
        set: vi.fn()
      }
    }
  },
  configurable: false,
  writable: false
})
