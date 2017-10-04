import getRepoInfo from './get-repo-info'
import getPackageName from './get-package-name/get-package-name'
import getStats from './get-stats'
import renderStats from './render-stats'

const run = async () => {
  const { owner, repo } = getRepoInfo()
  const packageName = await getPackageName(owner, repo)
  const stats = await getStats(packageName)
  renderStats(packageName, stats)
}

run()
