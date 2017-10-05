const getCachedStats = (cacheKey) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(cacheKey, (result) => {
      chrome.runtime.lastError
        ? reject(chrome.runtime.lastError)
        : resolve(result[cacheKey])
    })
  })
}

export default getCachedStats
