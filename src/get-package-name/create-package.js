import fetchPackageName from './fetch-package-name'

const createPackage = async (cacheKey, owner, repo) => {
  const name = await fetchPackageName(owner, repo)
  if (!name) return null

  const timeCreated = Date.now()
  const pkg = { name, timeCreated }

  chrome.storage.local.set({
    [cacheKey]: pkg
  }, () => {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError)
    }
    // if there is no error, perhaps some local storage flag "logging" flag could be set
  })

  return pkg
}

export default createPackage
