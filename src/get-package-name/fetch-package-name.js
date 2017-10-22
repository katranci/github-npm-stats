import resolvePrivatePackage from './resolve-private-package'

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
  let packageName = packageJson.name

  if (packageJson.private) {
    packageName = await resolvePrivatePackage(owner, repo, packageName)
  }

  return packageName
}

export default fetchPackageName
