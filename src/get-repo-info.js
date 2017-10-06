const getRepoInfo = () => {
  const [, owner, repo ] = location.pathname.split('/')
  if (!owner || !repo) {
    return null
  }
  return { owner, repo }
}

export default getRepoInfo
