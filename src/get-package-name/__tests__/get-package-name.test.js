import getPackageName from '../get-package-name'

jest.mock('../get-cache-key')
jest.mock('../get-cached-package')
jest.mock('../is-fresh')
jest.mock('../create-package')

import getCacheKeyMock from '../get-cache-key'
import getCachedPackageMock from '../get-cached-package'
import isFreshMock from '../is-fresh'
import createPackageMock from '../create-package'

describe('getPackageName', () => {
  it('returns name from cached package if cache is still fresh', async () => {
    const cachedPackage = { name: 'vue' }

    getCacheKeyMock.mockReturnValue('cache-key')
    getCachedPackageMock.mockReturnValue(Promise.resolve(cachedPackage))
    isFreshMock.mockReturnValue(true)

    const packageName = await getPackageName('vuejs', 'vue')

    expect(getCacheKeyMock.mock.calls.length).toBe(1)
    expect(getCacheKeyMock.mock.calls[0]).toEqual(['vuejs', 'vue'])

    expect(getCachedPackageMock.mock.calls.length).toBe(1)
    expect(getCachedPackageMock.mock.calls[0]).toEqual(['cache-key'])

    expect(isFreshMock.mock.calls.length).toBe(1)
    expect(isFreshMock.mock.calls[0]).toEqual([cachedPackage])

    expect(createPackageMock.mock.calls.length).toBe(0)
    expect(packageName).toBe(cachedPackage.name)
  })

  it('creates package if cache is stale or it doesn`t exist', async () => {
    const pkg = { name: 'vuex' }

    isFreshMock.mockReturnValue(false)
    createPackageMock.mockReturnValue(Promise.resolve(pkg))

    const packageName = await getPackageName('vuejs', 'vuex')

    expect(createPackageMock.mock.calls.length).toBe(1)
    expect(createPackageMock.mock.calls[0]).toEqual(['cache-key', 'vuejs', 'vuex'])

    expect(packageName).toBe(pkg.name)
  })

  it('returns null if creating package has failed', async () => {
    isFreshMock.mockReturnValue(false)
    createPackageMock.mockReturnValue(Promise.resolve(null))

    const packageName = await getPackageName('vuejs', 'vue')

    expect(packageName).toBeNull()
  })
})
