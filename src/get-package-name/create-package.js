import fetchPackageName from './fetch-package-name'

const createPackage = async (cacheKey, owner, repo) => {
  const name = await fetchPackageName(owner, repo)
  const timeCreated = Date.now()
  const pkg = { name, timeCreated }

  chrome.storage.local.set({
    [cacheKey]: pkg
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
    }
  })

  return pkg
}

export default createPackage
