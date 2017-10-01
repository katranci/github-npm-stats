const getRepoInfo = () => {
  const [, owner, repo ] = location.pathname.split('/')
  return { owner, repo }
}

export default getRepoInfo
