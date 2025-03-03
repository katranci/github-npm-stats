import createPackageMock from "../create-package"
import getCacheKeyMock from "../get-cache-key"
import getCachedPackageMock from "../get-cached-package"
import getPackageName from "../get-package-name"
import isFreshMock from "../is-fresh"

vi.mock("../get-cache-key")
vi.mock("../get-cached-package")
vi.mock("../is-fresh")
vi.mock("../create-package")

afterEach(() => {
  getCacheKeyMock.mockReset()
  getCachedPackageMock.mockReset()
  isFreshMock.mockReset()
  createPackageMock.mockReset()
})

describe("getPackageName", () => {
  it("returns name from cached package if cache is still fresh", async () => {
    const cachedPackage = { name: "vue" }

    getCacheKeyMock.mockReturnValue("cache-key")
    getCachedPackageMock.mockReturnValue(Promise.resolve(cachedPackage))
    isFreshMock.mockReturnValue(true)

    const packageName = await getPackageName("vuejs", "vue")

    expect(getCacheKeyMock).toHaveBeenCalledWith("vuejs", "vue")
    expect(getCachedPackageMock).toHaveBeenCalledWith("cache-key")
    expect(isFreshMock).toHaveBeenCalledWith(cachedPackage)
    expect(createPackageMock).not.toHaveBeenCalled()
    expect(packageName).toBe(cachedPackage.name)
  })

  it("creates package if cache is stale or it doesn`t exist", async () => {
    const pkg = { name: "vuex" }

    getCacheKeyMock.mockReturnValue("cache-key")
    isFreshMock.mockReturnValue(false)
    createPackageMock.mockReturnValue(Promise.resolve(pkg))

    const packageName = await getPackageName("vuejs", "vuex")

    expect(createPackageMock).toHaveBeenCalledWith("cache-key", "vuejs", "vuex")
    expect(packageName).toBe(pkg.name)
  })

  it("returns null if creating package has failed", async () => {
    isFreshMock.mockReturnValue(false)
    createPackageMock.mockReturnValue(Promise.resolve(null))

    const packageName = await getPackageName("vuejs", "vue")

    expect(packageName).toBeNull()
  })

  it("returns null if repo doesn`t belong to a npm package", async () => {
    const cachedPackage = { name: "N/A" }
    getCachedPackageMock.mockReturnValue(Promise.resolve(cachedPackage))
    isFreshMock.mockReturnValue(true)

    const packageName = await getPackageName("ipython", "ipython")

    expect(packageName).toBeNull()
  })
})
