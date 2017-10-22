const fetchStats = async (packageName) => {
  const response = await fetch(`https://api.npmjs.org/downloads/range/last-month/${packageName}`)

  if (response.status === 404) {
    console.warn('[github-npm-stats] npm stats is not found')
    return null
  }

  const responseBody = await response.json()
  const { downloads } = responseBody

  const lastDay = downloads[downloads.length - 1].downloads
  const lastWeek = downloads.slice(downloads.length - 7, downloads.length).reduce((sum, day) => (sum + day.downloads), 0)
  const lastMonth = downloads.reduce((sum, day) => (sum + day.downloads), 0)

  return {
    apiResponse: responseBody,
    lastDay,
    lastWeek,
    lastMonth
  }
}

export default fetchStats
