import getCacheKey from './get-cache-key'
import getCachedPackage from './get-cached-package'
import isFresh from './is-fresh'
import createPackage from './create-package'

const getPackageName = async (owner, repo) => {
  const cacheKey = getCacheKey(owner, repo)
  let pkg = await getCachedPackage(cacheKey)
  if (!isFresh(pkg)) pkg = await createPackage(cacheKey, owner, repo)
  return pkg ? pkg.name : null
}

export default getPackageName
