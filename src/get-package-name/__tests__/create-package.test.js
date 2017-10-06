import createPackage from '../create-package'

jest.mock('../fetch-package-name')
import fetchPackageNameMock from '../fetch-package-name'
fetchPackageNameMock.mockReturnValue(Promise.resolve('vue'))

const now = Date.now()
const nowFunc = Date.now.bind(Date)

beforeAll(() => {
  Date.now = jest.fn(() => now)
})

afterAll(() => {
  Date.now = nowFunc
})

describe('createPackage', () => {
  it('returns package that consist of name and timestamp', async () => {
    const pkg = await createPackage('cache-key', 'vuejs', 'vue')

    expect(fetchPackageNameMock.mock.calls.length).toBe(1)
    expect(fetchPackageNameMock.mock.calls[0]).toEqual(['vuejs', 'vue'])
    expect(pkg).toEqual({
      name: 'vue',
      timeCreated: now
    })
  })

  it('caches package in storage', async () => {
    chrome.storage.local.set.mockImplementationOnce((object, callback) => {
      expect(object['cache-key']).toEqual({
        name: 'vue',
        timeCreated: now
      })
      callback()
    })

    const pkg = await createPackage('cache-key', 'vuejs', 'vue')
  })
})
