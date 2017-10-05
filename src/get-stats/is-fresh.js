const isFresh = (stats) => {
  if (!stats) {
    return false
  }

  const now = new Date()
  const timeToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const timeStats = new Date(stats.apiResponse.end).getTime()
  const oneDay = 24 * 60 * 60 * 1000 // 1 day in milliseconds
  const isFresh = (timeToday - timeStats) / oneDay <= 1
  return isFresh
}

export default isFresh
