import isFresh from '../is-fresh'

const thirtyDays = 30 * 24 * 60 * 60 * 1000
const now = Date.now()
const nowFunc = Date.now.bind(Date)

beforeAll(() => {
  Date.now = jest.fn(() => now)
})

afterAll(() => {
  Date.now = nowFunc
})

describe('isFresh', () => {
  it('returns false if package doesn`t exist', () => {
    expect(isFresh()).toBe(false)
    expect(isFresh(null)).toBe(false)
    expect(Date.now.mock.calls.length).toBe(0)
  })

  it('returns false if package.timeCreated is at least 30 days old', () => {
    expect(isFresh({ timeCreated: now - thirtyDays })).toBe(false)
    expect(isFresh({ timeCreated: now - (thirtyDays + 1) })).toBe(false)
    expect(Date.now.mock.calls.length).toBe(2)
  })

  it('returns true if package.timeCreated is less than 30 days old', () => {
    expect(isFresh({ timeCreated: now - (thirtyDays - 1) })).toBe(true)
  })
})
