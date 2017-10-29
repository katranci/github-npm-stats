import getRepoInfo from './get-repo-info'
import getPackageName from './get-package-name/get-package-name'
import getStats from './get-stats/get-stats'
import renderStats from './render-stats'

const processPage = async () => {
  const { owner, repo } = getRepoInfo(location.href) || {}
  if (!owner) return

  const packageName = await getPackageName(owner, repo)
  if (!packageName) return

  const stats = await getStats(packageName)
  if (!stats) return

  renderStats(packageName, stats)
}

export default processPage
