import fetchPackageName from "../fetch-package-name"
import resolvePrivatePackageMock from "../resolve-private-package"

vi.mock("../resolve-private-package")

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
  console.warn = vi.fn()
})

afterAll(() => {
  console.warn = warnFunc
})

afterEach(() => {
  fetch.mockReset()
  console.warn.mockReset()
})

describe("fetchPackageName", () => {
  it("retrieves name from package.json file of the given repo", async () => {
    fetch.mockImplementation((url) => {
      expect(url).toBe(
        "https://api.github.com/repos/vuejs/vue/contents/package.json"
      )

      return Promise.resolve({
        json: () => Promise.resolve(apiResponse())
      })
    })

    const packageName = await fetchPackageName("vuejs", "vue")
    expect(packageName).toBe("vue")
  })

  it("returns N/A if api returns with 404", async () => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        status: 404
      })
    })

    const packageName = await fetchPackageName("vuejs", "vue")
    expect(packageName).toBe("N/A")
    expect(console.warn).not.toHaveBeenCalled()
  })

  it("returns null if api returns with 403", async () => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        status: 403
      })
    })

    const packageName = await fetchPackageName("vuejs", "vue")
    expect(packageName).toBeNull()
    expect(console.warn).toHaveBeenCalledWith(
      "[github-npm-stats] Error: Hourly GitHub api rate limit exceeded"
    )
  })

  it("returns N/A if name is absent from package.json", async () => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        json: () =>
          Promise.resolve(
            apiResponse({
              packageJson: {
                name: undefined
              }
            })
          )
      })
    })

    const packageName = await fetchPackageName("vuejs", "vue")
    expect(packageName).toBe("N/A")
  })

  describe("if package is private", () => {
    beforeEach(() => {
      fetch.mockImplementation((url) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve(
              apiResponse({
                packageJson: {
                  private: true
                }
              })
            )
        })
      })
    })

    it("returns name if package is resolved", async () => {
      resolvePrivatePackageMock.mockReturnValue(Promise.resolve("vue"))

      const packageName = await fetchPackageName("vuejs", "vue")

      expect(resolvePrivatePackageMock).toHaveBeenCalled()
      expect(packageName).toBe("vue")
    })

    it("returns null otherwise", async () => {
      resolvePrivatePackageMock.mockReturnValue(Promise.resolve(null))

      const packageName = await fetchPackageName("vuejs", "vue")
      expect(packageName).toBeNull()
    })
  })
})
