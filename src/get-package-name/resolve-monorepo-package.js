import getRepoInfo from '../get-repo-info'

/**
 * Normalizes a repo name from npm registry format.
 * Strips .git suffix that's common in repository URLs.
 */
const normalizeRepoName = (repoName) => {
  return repoName.replace(/\.git$/, '')
}

/**
 * Checks if npm package's repo info matches the given owner/repo.
 */
const matchesRepo = (repoInfo, owner, repo) => {
  if (!repoInfo) return false
  const npmRepoName = normalizeRepoName(repoInfo.repo).toLowerCase()
  return repoInfo.owner.toLowerCase() === owner.toLowerCase() && npmRepoName === repo.toLowerCase()
}

/**
 * Attempts to resolve a package name for a monorepo by trying the repo name
 * and verifying it belongs to the current GitHub repository.
 */
const resolveMonorepoPackage = async (owner, repo) => {
  // Normalize repo name: next.js -> next, react.js -> react
  const normalizedName = repo.replace(/\.js$/, '')

  const response = await fetch(`https://registry.npmjs.org/${normalizedName}/latest`)

  if (Math.floor(response.status / 100) === 4) {
    return null
  }

  const responseBody = await response.json()

  // Check repository.url first (more reliable)
  if (responseBody.repository && responseBody.repository.url) {
    const repoInfo = getRepoInfo(responseBody.repository.url)
    if (matchesRepo(repoInfo, owner, repo)) {
      return normalizedName
    }
  }

  // Fallback to bugs.url
  if (responseBody.bugs && responseBody.bugs.url) {
    const repoInfo = getRepoInfo(responseBody.bugs.url)
    if (matchesRepo(repoInfo, owner, repo)) {
      return normalizedName
    }
  }

  return null
}

export default resolveMonorepoPackage
