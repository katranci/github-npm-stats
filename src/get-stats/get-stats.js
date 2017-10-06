import getCacheKey from './get-cache-key'
import getCachedStats from './get-cached-stats'
import isFresh from './is-fresh'
import createStats from './create-stats'

const getStats = async (packageName) => {
  const cacheKey = getCacheKey(packageName)
  let stats = await getCachedStats(cacheKey)
  if (!isFresh(stats)) stats = await createStats(cacheKey, packageName)
  return stats
}

export default getStats
