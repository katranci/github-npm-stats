const fetchPackageName = (owner, repo) => {
  return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`)
    .then(response => {
      if (response.status === 404) throw new Error('package.json is not found')
      return response.json()
    })
    .then(response => JSON.parse(atob(response.content)).name)
}

export default fetchPackageName
