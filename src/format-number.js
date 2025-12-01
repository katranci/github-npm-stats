const formatNumber = (num) => {
  if (num >= 1000000000) {
    const val = (num / 1000000000).toFixed(2)
    if (val.endsWith("0")) {
      const trimmed = val.slice(0, -1)
      return trimmed.endsWith(".0") ? trimmed.slice(0, -2) + "B" : trimmed + "B"
    }
    return val + "B"
  }
  if (num >= 1000000) {
    const val = (num / 1000000).toFixed(1)
    return val.endsWith(".0") ? val.slice(0, -2) + "M" : val + "M"
  }
  if (num >= 1000) {
    const val = (num / 1000).toFixed(1)
    return val.endsWith(".0") ? val.slice(0, -2) + "K" : val + "K"
  }
  return num.toString()
}

export default formatNumber
