import run from '../index'

jest.mock('../get-repo-info')
jest.mock('../get-package-name/get-package-name')
jest.mock('../get-stats/get-stats')
jest.mock('../render-stats')

import getRepoInfoMock from '../get-repo-info'
import getPackageNameMock from '../get-package-name/get-package-name'
import getStatsMock from '../get-stats/get-stats'
import renderStatsMock from '../render-stats'

afterEach(() => {
  location.href = 'about:blank'
  getRepoInfoMock.mockReset()
  getPackageNameMock.mockReset()
  getStatsMock.mockReset()
  renderStatsMock.mockReset()
})

describe('run', () => {
  it('retrieves package name and stats and renders them', async () => {
    location.href = 'https://github.com/vuejs/vue'
    getRepoInfoMock.mockReturnValue({ owner: 'vuejs', repo: 'vue' })
    getPackageNameMock.mockReturnValue(Promise.resolve('vue'))
    getStatsMock.mockReturnValue(Promise.resolve({ lastDay: 10000 }))

    await run()

    expect(getRepoInfoMock.mock.calls[0]).toEqual(['https://github.com/vuejs/vue'])
    expect(getPackageNameMock.mock.calls[0]).toEqual(['vuejs', 'vue'])
    expect(getStatsMock.mock.calls[0]).toEqual(['vue'])
    expect(renderStatsMock.mock.calls[0]).toEqual(['vue', { lastDay: 10000 }])
  })

  it('doesn`t render anything if repo info is missing', async () => {
    getRepoInfoMock.mockReturnValue(null)

    await run()

    expect(getPackageNameMock).toHaveBeenCalledTimes(0)
    expect(getStatsMock).toHaveBeenCalledTimes(0)
    expect(renderStatsMock).toHaveBeenCalledTimes(0)
  })

  it('doesn`t render anything if package name is missing', async () => {
    getRepoInfoMock.mockReturnValue({ owner: 'vuejs', repo: 'vue' })
    getPackageNameMock.mockReturnValue(Promise.resolve(null))

    await run()

    expect(getStatsMock).toHaveBeenCalledTimes(0)
    expect(renderStatsMock).toHaveBeenCalledTimes(0)
  })

  it('doesn`t render anything if stats is missing', async () => {
    getRepoInfoMock.mockReturnValue({ owner: 'vuejs', repo: 'vue' })
    getPackageNameMock.mockReturnValue(Promise.resolve('vue'))
    getStatsMock.mockReturnValue(Promise.resolve(null))

    await run()

    expect(renderStatsMock).toHaveBeenCalledTimes(0)
  })
})
