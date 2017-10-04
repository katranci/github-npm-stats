const getCacheKey = (owner, repo) => {
  return `github.${owner}/${repo}`
}

export default getCacheKey
