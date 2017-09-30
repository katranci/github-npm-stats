
const getCacheKey = (owner, repo) => {
  return `github.${atob(owner + repo)}`
}

const getRepoInfo = () => {
  const [, owner, repo ] = location.pathname.split('/')
  return { owner, repo }
}

const getCachedPackage = (cacheKey) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(cacheKey, (result) => {
      chrome.runtime.lastError
        ? reject(chrome.runtime.lastError)
        : resolve(result[cacheKey])
    })
  })
}

const isFresh = (pkg) => {
  if (!pkg) {
    return false
  }

  const expirationTime = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
  const isFresh = pkg.timeCreated > Date.now() - expirationTime
  return isFresh
}

const fetchPackageName = (owner, repo) => {
  return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`)
    .then(response => {
      if (response.status === 404) throw new Error('package.json is not found')
      return response.json()
    })
    .then(response => JSON.parse(atob(response.content)).name)
}

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

const getPackageName = async () => {
  const { owner, repo } = getRepoInfo()
  const cacheKey = getCacheKey(owner, repo)
  let pkg = await getCachedPackage(cacheKey)
  if (!isFresh(pkg)) {
    pkg = await createPackage(cacheKey, owner, repo)
  }
  return pkg.name
}

export default getPackageName
