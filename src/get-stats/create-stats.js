import fetchStats from './fetch-stats'

const createStats = async (cacheKey, packageName) => {
  const stats = await fetchStats(packageName)
  if (!stats) return null

  chrome.storage.local.set({
    [cacheKey]: stats
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
    }
  })

  return stats
}

export default createStats
