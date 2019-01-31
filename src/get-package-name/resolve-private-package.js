import getRepoInfo from '../get-repo-info'

const resolvePrivatePackage = async (owner, repo, packageName) => {
  const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`)

  if (Math.floor(response.status / 100) === 4) {
    console.warn(`[github-npm-stats] Couldn't find "${packageName}" in npm registry`)
    return null
  }

  const responseBody = await response.json()

  if (responseBody.bugs && responseBody.bugs.url) {
    const repoInfo = getRepoInfo(responseBody.bugs.url)
    if (repoInfo.owner === owner && repoInfo.repo === repo) {
      return packageName
    }
  }

  return null
}

export default resolvePrivatePackage
