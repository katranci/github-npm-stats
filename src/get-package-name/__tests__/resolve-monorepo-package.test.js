import resolveMonorepoPackage from "../resolve-monorepo-package"

const matchingRepoApiResponse = {
  repository: {
    url: "git+https://github.com/vercel/next.js.git"
  }
}

const matchingBugsApiResponse = {
  bugs: {
    url: "https://github.com/vercel/next.js/issues"
  }
}

const nonMatchingApiResponse = {
  repository: {
    url: "git+https://github.com/foo/bar.git"
  }
}

const noRepoApiResponse = {}

afterEach(() => {
  fetch.mockReset()
})

describe("resolveMonorepoPackage", () => {
  it("normalizes repo name by removing .js suffix and fetches from npm", async () => {
    fetch.mockImplementation((url) => {
      expect(url).toBe("https://registry.npmjs.org/next/latest")

      return Promise.resolve({
        json: () => Promise.resolve(matchingRepoApiResponse)
      })
    })

    const packageName = await resolveMonorepoPackage("vercel", "next.js")

    expect(fetch).toHaveBeenCalled()
    expect(packageName).toBe("next")
  })

  it("returns package name when repository.url matches", async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(matchingRepoApiResponse)
      })
    )

    const packageName = await resolveMonorepoPackage("vercel", "next.js")
    expect(packageName).toBe("next")
  })

  it("returns package name when bugs.url matches (fallback)", async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(matchingBugsApiResponse)
      })
    )

    const packageName = await resolveMonorepoPackage("vercel", "next.js")
    expect(packageName).toBe("next")
  })

  it("returns null if package doesn't exist on npm", async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 404
      })
    )

    const packageName = await resolveMonorepoPackage("owner", "repo")
    expect(packageName).toBeNull()
  })

  it("returns null if repository doesn't match", async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(nonMatchingApiResponse)
      })
    )

    const packageName = await resolveMonorepoPackage("vercel", "next.js")
    expect(packageName).toBeNull()
  })

  it("returns null if no repository or bugs info available", async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(noRepoApiResponse)
      })
    )

    const packageName = await resolveMonorepoPackage("vercel", "next.js")
    expect(packageName).toBeNull()
  })

  it("handles case-insensitive owner/repo matching", async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            repository: {
              url: "git+https://github.com/Vercel/Next.js.git"
            }
          })
      })
    )

    const packageName = await resolveMonorepoPackage("vercel", "next.js")
    expect(packageName).toBe("next")
  })

  it("works with repos that don't have .js suffix", async () => {
    fetch.mockImplementation((url) => {
      expect(url).toBe("https://registry.npmjs.org/react/latest")

      return Promise.resolve({
        json: () =>
          Promise.resolve({
            repository: {
              url: "git+https://github.com/facebook/react.git"
            }
          })
      })
    })

    const packageName = await resolveMonorepoPackage("facebook", "react")
    expect(packageName).toBe("react")
  })
})
