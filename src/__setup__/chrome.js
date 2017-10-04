Object.defineProperty(window, 'chrome', {
  value: {
    runtime: {
      lastError: null
    },
    storage: {
      local: {
        get: jest.fn(),
        set: jest.fn()
      }
    }
  },
  configurable: false,
  writable: false
})
