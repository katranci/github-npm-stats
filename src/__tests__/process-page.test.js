import getPackageNameMock from "../get-package-name/get-package-name"
import getRepoInfoMock from "../get-repo-info"
import getStatsMock from "../get-stats/get-stats"
import processPage from "../process-page"
import renderStatsMock from "../render-stats"

vi.mock("../get-repo-info")
vi.mock("../get-package-name/get-package-name")
vi.mock("../get-stats/get-stats")
vi.mock("../render-stats")

afterEach(() => {
  location.href = "about:blank"
  getRepoInfoMock.mockReset()
  getPackageNameMock.mockReset()
  getStatsMock.mockReset()
  renderStatsMock.mockReset()
})

describe("processPage", () => {
  it("retrieves package name and stats and renders them", async () => {
    vi.stubGlobal("location", {
      ...window.location,
      href: "https://github.com/vuejs/vue"
    })
    getRepoInfoMock.mockReturnValue({ owner: "vuejs", repo: "vue" })
    getPackageNameMock.mockReturnValue(Promise.resolve("vue"))
    getStatsMock.mockReturnValue(Promise.resolve({ lastDay: 10000 }))

    await processPage()

    expect(getRepoInfoMock.mock.calls[0]).toEqual([
      "https://github.com/vuejs/vue"
    ])
    expect(getPackageNameMock.mock.calls[0]).toEqual(["vuejs", "vue"])
    expect(getStatsMock.mock.calls[0]).toEqual(["vue"])
    expect(renderStatsMock.mock.calls[0]).toEqual(["vue", { lastDay: 10000 }])
  })

  it("doesn`t render anything if repo info is missing", async () => {
    getRepoInfoMock.mockReturnValue(null)

    await processPage()

    expect(getPackageNameMock).toHaveBeenCalledTimes(0)
    expect(getStatsMock).toHaveBeenCalledTimes(0)
    expect(renderStatsMock).toHaveBeenCalledTimes(0)
  })

  it("doesn`t render anything if package name is missing", async () => {
    getRepoInfoMock.mockReturnValue({ owner: "vuejs", repo: "vue" })
    getPackageNameMock.mockReturnValue(Promise.resolve(null))

    await processPage()

    expect(getStatsMock).toHaveBeenCalledTimes(0)
    expect(renderStatsMock).toHaveBeenCalledTimes(0)
  })

  it("doesn`t render anything if stats is missing", async () => {
    getRepoInfoMock.mockReturnValue({ owner: "vuejs", repo: "vue" })
    getPackageNameMock.mockReturnValue(Promise.resolve("vue"))
    getStatsMock.mockReturnValue(Promise.resolve(null))

    await processPage()

    expect(renderStatsMock).toHaveBeenCalledTimes(0)
  })
})
