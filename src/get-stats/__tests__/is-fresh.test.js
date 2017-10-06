import isFresh from '../is-fresh'

const formatDate = (date) => {
  const year = date.getUTCFullYear()

  let month = date.getUTCMonth() + 1
  month = month <= 9 ? `0${month}` : month

  let day = date.getUTCDate()
  day = day <= 9 ? `0${day}` : day

  return `${year}-${month}-${day}`
}

const today = () => {
  return formatDate(new Date())
}

const daysAgo = (days) => {
  const oneDay = 24 * 60 * 60 * 1000
  const now = new Date()
  return formatDate(new Date(now.getTime() - oneDay * days))
}

const yesterday = () => {
  return daysAgo(1)
}

describe('isFresh', () => {
  it('returns false if stats doesn`t exist', () => {
    expect(isFresh()).toBe(false)
    expect(isFresh(null)).toBe(false)
  })

  it('returns false if stats.apiResponse.end is older than yesterday', () => {
    expect(isFresh({ apiResponse: { end: daysAgo(2) } })).toBe(false)
  })

  it('returns true if stats.apiResponse.end is yesterday or today', () => {
    expect(isFresh({ apiResponse: { end: yesterday() } })).toBe(true)
    expect(isFresh({ apiResponse: { end: today() } })).toBe(true)
  })
})
