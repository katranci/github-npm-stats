import createStats from '../create-stats'

jest.mock('../fetch-stats')
import fetchStatsMock from '../fetch-stats'

const now = Date.now()
const nowFunc = Date.now.bind(Date)

beforeAll(() => {
  Date.now = jest.fn(() => now)
})

afterAll(() => {
  Date.now = nowFunc
})

afterEach(() => {
  fetchStatsMock.mockReset()
  chrome.storage.local.set.mockReset()
})

describe('createStats', () => {
  it('fetches and returns stats data', async () => {
    fetchStatsMock.mockReturnValue(Promise.resolve({ lastDay: 10000 }))

    const stats = await createStats('cache-key', 'vue')

    expect(fetchStatsMock).toHaveBeenCalledWith('vue')
    expect(stats).toEqual({
      lastDay: 10000
    })
  })

  it('caches package in storage', async () => {
    fetchStatsMock.mockReturnValue(Promise.resolve({ lastDay: 10000 }))

    chrome.storage.local.set.mockImplementation((object, callback) => {
      expect(object['cache-key']).toEqual({
        lastDay: 10000
      })
      callback()
    })

    const stats = await createStats('cache-key', 'vue')
  })

  it('returns null if stats is null', async () => {
    fetchStatsMock.mockReturnValue(Promise.resolve(null))

    const stats = await createStats('cache-key', 'vue')

    expect(stats).toBeNull()
    expect(chrome.storage.local.set).not.toHaveBeenCalled()
  })
})
