const fetchPackageName = (owner, repo) => {
  return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`)
    .then(response => {
      if (response.status === 403) throw new Error('Hourly GitHub api rate limit exceeded')
      if (response.status === 404) return 'N/A'
      return response.json()
    })
    .then(response => {
      if (response === 'N/A') return response

      const packageJson = JSON.parse(atob(response.content))
      if (packageJson.private) return null
      return packageJson.name
    })
    .catch((error) => {
      console.warn(`[github-npm-stats] ${error}`)
      return null
    })
}

export default fetchPackageName
