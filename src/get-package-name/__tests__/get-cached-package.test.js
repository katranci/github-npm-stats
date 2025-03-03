import getCachedPackage from "../get-cached-package"

const pkg = {
  name: "vue",
  timeCreated: Date.now()
}
const warnFunc = console.warn.bind(console)

beforeAll(() => {
  console.warn = vi.fn()
})

afterAll(() => {
  console.warn = warnFunc
  chrome.runtime.lastError = null
})

describe("getCachedPackage", () => {
  it("resolves with cached package if it exists in storage", async () => {
    chrome.storage.local.get.mockImplementationOnce((cacheKey, callback) => {
      callback({
        [cacheKey]: pkg
      })
    })

    const cachedPackage = await getCachedPackage("github.vuejs/vue")
    expect(cachedPackage).toBe(pkg)
  })

  it("resolves with null if there is no cache belonging to the package", async () => {
    chrome.storage.local.get.mockImplementationOnce((cacheKey, callback) => {
      callback({})
    })

    const cachedPackage = await getCachedPackage("github.vuejs/vue")
    expect(cachedPackage).toBeNull()
  })

  it("resolves with null if there is an error in chrome runtime", async () => {
    chrome.runtime.lastError = "Err"
    chrome.storage.local.get.mockImplementationOnce((cacheKey, callback) => {
      callback({})
    })

    const cachedPackage = await getCachedPackage("github.vuejs/vue")
    expect(cachedPackage).toBeNull()
    expect(console.warn).toHaveBeenCalled()
  })
})
