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
})
