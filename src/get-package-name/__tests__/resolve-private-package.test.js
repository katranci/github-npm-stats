import resolvePrivatePackage from '../resolve-private-package'

jest.mock('../../get-repo-info')
import getRepoInfoMock from '../../get-repo-info'

const matchingApiResponse = {
  bugs: {
    url: "https://github.com/owner/repo/issues"
  }
}

const nonMatchingApiResponse = {
  bugs: {
    url: "https://github.com/foo/bar/issues"
  }
}

const warnFunc = console.warn.bind(console)

beforeAll(() => {
  console.warn = jest.fn()
})

afterAll(() => {
  console.warn = warnFunc
})

afterEach(() => {
  fetch.mockReset()
  getRepoInfoMock.mockReset()
})

describe('resolvePrivatePackage', () => {
  it('fetches package information, compares repo details with the given repo and returns package name if they match', async () => {
    fetch.mockImplementation((url) => {
      expect(url).toBe('https://registry.npmjs.org/package/latest')

      return Promise.resolve({
        json () {
          return Promise.resolve(matchingApiResponse)
        }
      })
    })

    getRepoInfoMock.mockReturnValue({ owner: 'owner', repo: 'repo' })

    const packageName = await resolvePrivatePackage('owner', 'repo', 'package')

    expect(fetch).toHaveBeenCalled()
    expect(getRepoInfoMock.mock.calls[0]).toEqual([matchingApiResponse.bugs.url])
    expect(packageName).toBe('package')
  })

  it('returns null if provided package does`t exist in npm registry', async () => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        status: 404
      })
    })

    const packageName = await resolvePrivatePackage('owner', 'repo', 'package')
    expect(packageName).toBeNull()
    expect(console.warn).toHaveBeenCalledWith('[github-npm-stats] Couldn\'t find "package" in npm registry')
  })
})
