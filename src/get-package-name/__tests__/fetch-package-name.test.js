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

describe('fetchPackageName', () => {
  it('retrieves name from package.json file of the given repo', async () => {
    fetch.mockImplementationOnce((url) => {
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
    fetch.mockImplementationOnce((url) => {
      return Promise.resolve({
        status: 404
      })
    })

    const packageName = await fetchPackageName('vuejs', 'vue')
    expect(packageName).toBe(null)
    expect(console.warn.mock.calls.length).toBe(1)
  })

  it('returns null if package is private', async () => {
    fetch.mockImplementationOnce((url) => {
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
    expect(packageName).toBe(null)
  })
})
