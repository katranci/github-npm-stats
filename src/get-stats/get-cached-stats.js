const getCachedStats = (cacheKey) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(cacheKey, (result) => {
      if (chrome.runtime.lastError) {
        resolve(null)
        console.warn(`[github-npm-stats] ${chrome.runtime.lastError}`)
      } else {
        resolve(result[cacheKey] || null)
      }
    })
  })
}

export default getCachedStats
