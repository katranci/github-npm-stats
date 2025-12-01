const trimTrailingZeros = (val, suffix) => {
  if (val.endsWith("0")) {
    const trimmed = val.slice(0, -1)
    if (trimmed.endsWith("0")) {
      const trimmed2 = trimmed.slice(0, -1)
      return trimmed2.endsWith(".") ? trimmed2.slice(0, -1) + suffix : trimmed2 + suffix
    }
    return trimmed.endsWith(".") ? trimmed.slice(0, -1) + suffix : trimmed + suffix
  }
  return val + suffix
}

const formatNumber = (num) => {
  if (num >= 1000000000) {
    const val = (num / 1000000000).toFixed(2)
    return trimTrailingZeros(val, "B")
  }
  if (num >= 1000000) {
    const decimals = num < 10000000 ? 2 : 1
    const val = (num / 1000000).toFixed(decimals)
    return trimTrailingZeros(val, "M")
  }
  if (num >= 1000) {
    const decimals = num < 10000 ? 2 : 1
    const val = (num / 1000).toFixed(decimals)
    return trimTrailingZeros(val, "K")
  }
  return num.toString()
}

export default formatNumber
