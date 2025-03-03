import createPackage from "../create-package"
import fetchPackageNameMock from "../fetch-package-name"

vi.mock("../fetch-package-name")

const now = Date.now()
const nowFunc = Date.now.bind(Date)

beforeAll(() => {
  Date.now = vi.fn(() => now)
})

afterAll(() => {
  Date.now = nowFunc
})

afterEach(() => {
  fetchPackageNameMock.mockReset()
  chrome.storage.local.set.mockReset()
})

describe("createPackage", () => {
  it("returns package that consist of name and timestamp", async () => {
    fetchPackageNameMock.mockReturnValue(Promise.resolve("vue"))

    const pkg = await createPackage("cache-key", "vuejs", "vue")

    expect(fetchPackageNameMock).toHaveBeenCalledWith("vuejs", "vue")
    expect(pkg).toEqual({
      name: "vue",
      timeCreated: now
    })
  })

  it("caches package in storage", async () => {
    fetchPackageNameMock.mockReturnValue(Promise.resolve("vue"))

    chrome.storage.local.set.mockImplementation((object, callback) => {
      expect(object["cache-key"]).toEqual({
        name: "vue",
        timeCreated: now
      })
      callback()
    })

    const pkg = await createPackage("cache-key", "vuejs", "vue")
  })

  it("returns null if package name is null", async () => {
    fetchPackageNameMock.mockReturnValue(Promise.resolve(null))

    const pkg = await createPackage("cache-key", "vuejs", "vue")

    expect(pkg).toBeNull()
    expect(chrome.storage.local.set).not.toHaveBeenCalled()
  })
})
