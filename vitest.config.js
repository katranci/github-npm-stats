import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [
      "src/__setup__/chrome.js",
      "src/__setup__/fetch.js"
      // "src/__setup__/location.js"
    ]
  }
})
