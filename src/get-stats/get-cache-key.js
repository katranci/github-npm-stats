const getCacheKey = (packageName) => {
  return `npm.${packageName}`
}

export default getCacheKey
