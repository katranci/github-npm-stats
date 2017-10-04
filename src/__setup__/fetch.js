Object.defineProperty(window, 'fetch', {
  value: jest.fn(),
  configurable: false,
  writable: false
})
