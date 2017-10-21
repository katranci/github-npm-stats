const getRepoInfo = (url) => {
  const parsedUrl = new URL(url)
  const [, owner, repo ] = parsedUrl.pathname.split('/')

  if (!owner || !repo) {
    return null
  }

  return { owner, repo }
}

export default getRepoInfo
