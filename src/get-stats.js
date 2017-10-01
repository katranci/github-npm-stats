const getCacheKey = (packageName) => {
  return `npm.${packageName}`
}

const getCachedStats = (cacheKey) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(cacheKey, (result) => {
      chrome.runtime.lastError
        ? reject(chrome.runtime.lastError)
        : resolve(result[cacheKey])
    })
  })
}

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

const fetchStats = async (packageName) => {
  return fetch(`https://api.npmjs.org/downloads/range/last-month/${packageName}`)
    .then(response => {
      if (response.status === 404) throw new Error('npm stats is not found')
      return response.json()
    })
    .then(response => {
      let { downloads } = response

      const lastDay = downloads[downloads.length - 1].downloads
      const lastWeek = downloads.slice(downloads.length - 7, downloads.length).reduce((sum, day) => (sum + day.downloads), 0)
      const lastMonth = downloads.reduce((sum, day) => (sum + day.downloads), 0)

      return { apiResponse: response, lastDay, lastWeek, lastMonth }
    })
}

const createStats = async (cacheKey, packageName) => {
  const stats = await fetchStats(packageName)

  chrome.storage.local.set({
    [cacheKey]: stats
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
    }
  })

  return stats
}

const getStats = async (packageName) => {
  const cacheKey = getCacheKey(packageName)
  let stats = await getCachedStats(cacheKey)
  if (!isFresh(stats)) {
    stats = await createStats(cacheKey, packageName)
  }
  return stats
}

export default getStats
