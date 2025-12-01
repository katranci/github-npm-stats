import resolvePrivatePackage from './resolve-private-package'
import resolveMonorepoPackage from './resolve-monorepo-package'

const isMonorepo = (packageJson) => {
  return packageJson.workspaces || (packageJson.private && !packageJson.name)
}

const fetchPackageName = async (owner, repo) => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`)

  if (response.status === 403) {
    console.warn('[github-npm-stats] Error: Hourly GitHub api rate limit exceeded')
    return null
  }

  if (response.status === 404) {
    return 'N/A'
  }

  const responseBody = await response.json()
  const packageJson = JSON.parse(atob(responseBody.content))

  // Handle monorepos: try to find a package matching the repo name
  if (isMonorepo(packageJson)) {
    const monorepoPackage = await resolveMonorepoPackage(owner, repo)
    if (monorepoPackage) {
      return monorepoPackage
    }
    return 'N/A'
  }

  let packageName = packageJson.name

  if (!packageName) {
    return 'N/A'
  }

  if (packageJson.private) {
    packageName = await resolvePrivatePackage(owner, repo, packageName)
  }

  return packageName
}

export default fetchPackageName
