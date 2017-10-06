import fetchStats from '../fetch-stats'

const apiResponse = {
  start: '2017-09-06',
  end: '2017-10-05',
  package: 'vue',
  downloads: Array(30).fill().map((_, i) => {
    return {
      downloads: (i + 1) * 1000
    }
  })
}

const calculateDownloads = (start, end) => {
  let sum = 0
  while (start <= end) {
    sum = sum + start * 1000
    start++
  }
  return sum
}

const lastDayDownloads = 30000
const lastWeekDownloads = calculateDownloads(24, 30)
const lastMonthDownloads = calculateDownloads(1, 30)

const warnFunc = console.warn.bind(console)

beforeAll(() => {
  console.warn = jest.fn()
})

afterAll(() => {
  console.warn = warnFunc
})

describe('fetchStats', () => {
  it('retrieves stats from npm api and calculates aggregated downloads', async () => {
    fetch.mockImplementationOnce((url) => {
      expect(url).toBe('https://api.npmjs.org/downloads/range/last-month/vue')

      return Promise.resolve({
        json () {
          return Promise.resolve(apiResponse)
        }
      })
    })

    const stats = await fetchStats('vue')
    expect(stats.apiResponse).toBe(apiResponse)
    expect(stats.lastDay).toBe(lastDayDownloads)
    expect(stats.lastWeek).toBe(lastWeekDownloads)
    expect(stats.lastMonth).toBe(lastMonthDownloads)
  })

  it('returns null if api returns with 404', async () => {
    fetch.mockImplementationOnce((url) => {
      return Promise.resolve({
        status: 404
      })
    })

    const packageName = await fetchStats('vue')
    expect(packageName).toBeNull()
    expect(console.warn).toHaveBeenCalled()
  })
})
