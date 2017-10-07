import fetchPackageName from '../fetch-package-name'

const apiResponse = (options = {}) => {
  const packageJson = {
    name: "vue",
    ...options.packageJson
  }

  return {
    encoding: "base64",
    content: btoa(JSON.stringify(packageJson))
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
  console.warn.mockReset()
})

describe('fetchPackageName', () => {
  it('retrieves name from package.json file of the given repo', async () => {
    fetch.mockImplementation((url) => {
      expect(url).toBe('https://api.github.com/repos/vuejs/vue/contents/package.json')

      return Promise.resolve({
        json () {
          return Promise.resolve(apiResponse())
        }
      })
    })

    const packageName = await fetchPackageName('vuejs', 'vue')
    expect(packageName).toBe('vue')
  })

  it('returns null if api returns with 404', async () => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        status: 404
      })
    })

    const packageName = await fetchPackageName('vuejs', 'vue')
    expect(packageName).toBeNull()
    expect(console.warn).toHaveBeenCalled()
  })

  it('returns null if api returns with 403', async () => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        status: 403
      })
    })

    const packageName = await fetchPackageName('vuejs', 'vue')
    expect(packageName).toBeNull()
    expect(console.warn).toHaveBeenCalledWith('[github-npm-stats] Error: Hourly GitHub api rate limit exceeded')
  })

  it('returns null if package is private', async () => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        json () {
          return Promise.resolve(apiResponse({
            packageJson: {
              private: true
            }
          }))
        }
      })
    })

    const packageName = await fetchPackageName('vuejs', 'vue')
    expect(packageName).toBeNull()
  })
})
