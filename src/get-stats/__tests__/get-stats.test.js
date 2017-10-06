import getStats from '../get-stats'

jest.mock('../get-cache-key')
jest.mock('../get-cached-stats')
jest.mock('../is-fresh')
jest.mock('../create-stats')

import getCacheKeyMock from '../get-cache-key'
import getCachedStatsMock from '../get-cached-stats'
import isFreshMock from '../is-fresh'
import createStatsMock from '../create-stats'

describe('getStats', () => {
  it('returns stats from cache if it is still fresh', async () => {
    const cachedStats = { lastDay: 10000 }

    getCacheKeyMock.mockReturnValue('cache-key')
    getCachedStatsMock.mockReturnValue(Promise.resolve(cachedStats))
    isFreshMock.mockReturnValue(true)

    const stats = await getStats('vue')

    expect(getCacheKeyMock.mock.calls.length).toBe(1)
    expect(getCacheKeyMock.mock.calls[0]).toEqual(['vue'])

    expect(getCachedStatsMock.mock.calls.length).toBe(1)
    expect(getCachedStatsMock.mock.calls[0]).toEqual(['cache-key'])

    expect(isFreshMock.mock.calls.length).toBe(1)
    expect(isFreshMock.mock.calls[0]).toEqual([cachedStats])

    expect(createStatsMock.mock.calls.length).toBe(0)
    expect(stats).toBe(cachedStats)
  })

  it('creates stats if cache is stale or it doesn`t exist', async () => {
    const createdStats = { lastDay: 10000 }

    isFreshMock.mockReturnValue(false)
    createStatsMock.mockReturnValue(Promise.resolve(createdStats))

    const stats = await getStats('vue')

    expect(createStatsMock.mock.calls.length).toBe(1)
    expect(createStatsMock.mock.calls[0]).toEqual(['cache-key', 'vue'])

    expect(stats).toBe(createdStats)
  })

  it('returns null if creating stats has failed', async () => {
    isFreshMock.mockReturnValue(false)
    createStatsMock.mockReturnValue(Promise.resolve(null))

    const stats = await getStats('vue')

    expect(stats).toBeNull()
  })
})
