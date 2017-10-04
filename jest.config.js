module.exports = {
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.js'
  ],
  setupFiles: [
    './src/__setup__/chrome.js',
    './src/__setup__/fetch.js',
    './src/__setup__/location.js'
  ]
}
