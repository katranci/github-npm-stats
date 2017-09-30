import getPackageName from './get-package-name'
import getStats from './get-stats'
import renderStats from './render-stats'

const run = async () => {
  const packageName = await getPackageName()
  const stats = await getStats(packageName)
  renderStats(stats)
}

run()
