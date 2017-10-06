import createStats from '../create-stats'

jest.mock('../fetch-stats')
import fetchStatsMock from '../fetch-stats'
fetchStatsMock.mockReturnValue(Promise.resolve({ lastDay: 10000 }))

const now = Date.now()
const nowFunc = Date.now.bind(Date)

beforeAll(() => {
  Date.now = jest.fn(() => now)
})

afterAll(() => {
  Date.now = nowFunc
})

describe('createStats', () => {
  it('fetches and returns stats data', async () => {
    const stats = await createStats('cache-key', 'vue')

    expect(fetchStatsMock.mock.calls.length).toBe(1)
    expect(fetchStatsMock.mock.calls[0]).toEqual(['vue'])
    expect(stats).toEqual({
      lastDay: 10000
    })
  })

  it('caches package in storage', async () => {
    chrome.storage.local.set.mockImplementationOnce((object, callback) => {
      expect(object['cache-key']).toEqual({
        lastDay: 10000
      })
      callback()
    })

    const stats = await createStats('cache-key', 'vue')
  })
})
