const isFresh = (pkg) => {
  if (!pkg) {
    return false
  }

  const expirationTime = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
  const isFresh = pkg.timeCreated > Date.now() - expirationTime
  return isFresh
}

export default isFresh
