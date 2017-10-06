import getCachedStats from '../get-cached-stats'

const stats = {
  lastDay: 10000
}
const warnFunc = console.warn.bind(console)

beforeAll(() => {
  console.warn = jest.fn()
})

afterAll(() => {
  console.warn = warnFunc
  chrome.runtime.lastError = null
})

describe('getCachedStats', () => {
  it('resolves with cached stats if it exists in storage', async () => {
    chrome.storage.local.get.mockImplementationOnce((cacheKey, callback) => {
      callback({
        [cacheKey]: stats
      })
    })

    const cachedStats = await getCachedStats('npm.vue')
    expect(cachedStats).toBe(stats)
  })

  it('resolves with null if there is no cache belonging to the stats', async () => {
    chrome.storage.local.get.mockImplementationOnce((cacheKey, callback) => {
      callback({})
    })

    const cachedStats = await getCachedStats('npm.vue')
    expect(cachedStats).toBe(null)
  })

  it('resolves with null if there is an error in chrome runtime', async () => {
    chrome.runtime.lastError = 'Err'
    chrome.storage.local.get.mockImplementationOnce((cacheKey, callback) => {
      callback({})
    })

    const cachedStats = await getCachedStats('npm.vue')
    expect(cachedStats).toBe(null)
    expect(console.warn.mock.calls.length).toBe(1)
  })
})
