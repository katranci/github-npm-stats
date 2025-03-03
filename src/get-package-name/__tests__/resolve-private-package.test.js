import resolvePrivatePackage from "../resolve-private-package"

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

const noBugsApiResponse = {}
const noBugsUrlApiResponse = { bugs: {} }

const warnFunc = console.warn.bind(console)

beforeAll(() => {
  console.warn = vi.fn()
})

afterAll(() => {
  console.warn = warnFunc
})

afterEach(() => {
  fetch.mockReset()
})

describe("resolvePrivatePackage", () => {
  it("fetches package information, compares repo details with the given repo and returns package name if they match", async () => {
    fetch.mockImplementation((url) => {
      expect(url).toBe("https://registry.npmjs.org/package/latest")

      return Promise.resolve({
        json: () => Promise.resolve(matchingApiResponse)
      })
    })

    const packageName = await resolvePrivatePackage("owner", "repo", "package")

    expect(fetch).toHaveBeenCalled()
    expect(packageName).toBe("package")
  })

  it("returns null if provided package does`t exist in npm registry", async () => {
    fetch.mockImplementation((url) =>
      Promise.resolve({
        status: 404
      })
    )

    const packageName = await resolvePrivatePackage("owner", "repo", "package")
    expect(packageName).toBeNull()
    expect(console.warn).toHaveBeenCalledWith(
      '[github-npm-stats] Couldn\'t find "package" in npm registry'
    )
  })

  it("returns null if provided repo details doesn`t match npm registry details", async () => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        json: () => Promise.resolve(nonMatchingApiResponse)
      })
    })

    const packageName = await resolvePrivatePackage("owner", "repo", "package")
    expect(packageName).toBeNull()
  })

  it("returns null if npm registry doesn`t have a bugs section", async () => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        json: () => Promise.resolve(noBugsApiResponse)
      })
    })

    const packageName = await resolvePrivatePackage("owner", "repo", "package")
    expect(packageName).toBeNull()
  })

  it("returns null if npm registry doesn`t have a bugs url", async () => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        json: () => Promise.resolve(noBugsUrlApiResponse)
      })
    })

    const packageName = await resolvePrivatePackage("owner", "repo", "package")
    expect(packageName).toBeNull()
  })
})
