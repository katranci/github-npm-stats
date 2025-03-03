import getCachedStats from "../get-cached-stats"

const stats = {
  lastDay: 10000
}
const warnFunc = console.warn.bind(console)

beforeAll(() => {
  console.warn = vi.fn()
})

afterAll(() => {
  console.warn = warnFunc
  chrome.runtime.lastError = null
})

describe("getCachedStats", () => {
  it("resolves with cached stats if it exists in storage", async () => {
    chrome.storage.local.get.mockImplementationOnce((cacheKey, callback) => {
      callback({
        [cacheKey]: stats
      })
    })

    const cachedStats = await getCachedStats("npm.vue")
    expect(cachedStats).toBe(stats)
  })

  it("resolves with null if there is no cache belonging to the stats", async () => {
    chrome.storage.local.get.mockImplementationOnce((cacheKey, callback) => {
      callback({})
    })

    const cachedStats = await getCachedStats("npm.vue")
    expect(cachedStats).toBeNull()
  })

  it("resolves with null if there is an error in chrome runtime", async () => {
    chrome.runtime.lastError = "Err"
    chrome.storage.local.get.mockImplementationOnce((cacheKey, callback) => {
      callback({})
    })

    const cachedStats = await getCachedStats("npm.vue")
    expect(cachedStats).toBeNull()
    expect(console.warn).toHaveBeenCalled()
  })
})
