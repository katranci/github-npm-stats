import getRepoInfo from '../get-repo-info'

const resolvePrivatePackage = async (owner, repo, packageName) => {
  const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`)

  // 404

  const responseBody = await response.json()
  const repoInfo = getRepoInfo(responseBody.bugs.url)

  if (repoInfo.owner === owner && repoInfo.repo === repo) {
    return packageName
  }

  // return null
}

export default resolvePrivatePackage
