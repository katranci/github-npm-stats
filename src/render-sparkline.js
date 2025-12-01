import formatNumber from "./format-number"

const renderSparkline = (container, stats) => {
  const downloads = stats.apiResponse.downloads.map((d) => d.downloads)
  const width = 300
  const height = 90
  const paddingX = 4
  const paddingTop = 14
  const paddingBottom = 14
  const chartHeight = height - paddingTop - paddingBottom

  const maxValue = Math.max(...downloads)
  const minValue = Math.min(...downloads)
  const range = maxValue - minValue || 1

  const maxIndex = downloads.indexOf(maxValue)
  const minIndex = downloads.indexOf(minValue)

  const points = downloads.map((value, index) => {
    const x = paddingX + (index / (downloads.length - 1)) * (width - paddingX * 2)
    const y = paddingTop + chartHeight - ((value - minValue) / range) * chartHeight
    return { x, y, value }
  })

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", width)
  svg.setAttribute("height", height)
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
  svg.style.display = "block"

  // Gradient fill under the line
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
  const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
  gradient.setAttribute("id", "sparkline-gradient")
  gradient.setAttribute("x1", "0%")
  gradient.setAttribute("y1", "0%")
  gradient.setAttribute("x2", "0%")
  gradient.setAttribute("y2", "100%")

  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
  stop1.setAttribute("offset", "0%")
  stop1.setAttribute("stop-color", "#28a745")
  stop1.setAttribute("stop-opacity", "0.2")

  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
  stop2.setAttribute("offset", "100%")
  stop2.setAttribute("stop-color", "#28a745")
  stop2.setAttribute("stop-opacity", "0.02")

  gradient.appendChild(stop1)
  gradient.appendChild(stop2)
  defs.appendChild(gradient)
  svg.appendChild(defs)

  // Fill area
  const fillPoints = [
    `${paddingX},${height - paddingBottom}`,
    ...points.map((p) => `${p.x},${p.y}`),
    `${width - paddingX},${height - paddingBottom}`
  ].join(" ")

  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
  polygon.setAttribute("points", fillPoints)
  polygon.setAttribute("fill", "url(#sparkline-gradient)")
  svg.appendChild(polygon)

  // Line
  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline")
  polyline.setAttribute("points", points.map((p) => `${p.x},${p.y}`).join(" "))
  polyline.setAttribute("fill", "none")
  polyline.setAttribute("stroke", "#28a745")
  polyline.setAttribute("stroke-width", "1.5")
  polyline.setAttribute("stroke-linejoin", "round")
  polyline.setAttribute("stroke-linecap", "round")
  svg.appendChild(polyline)

  // Max label
  const maxPoint = points[maxIndex]
  const maxLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
  maxLabel.setAttribute("x", Math.min(Math.max(maxPoint.x, 20), width - 20))
  maxLabel.setAttribute("y", paddingTop - 4)
  maxLabel.setAttribute("text-anchor", "middle")
  maxLabel.setAttribute("font-size", "10")
  maxLabel.setAttribute("fill", "#28a745")
  maxLabel.textContent = formatNumber(maxValue)
  svg.appendChild(maxLabel)

  // Min label (only if different position from max)
  if (Math.abs(maxIndex - minIndex) > 3) {
    const minPoint = points[minIndex]
    const minLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
    minLabel.setAttribute("x", Math.min(Math.max(minPoint.x, 20), width - 20))
    minLabel.setAttribute("y", height - 2)
    minLabel.setAttribute("text-anchor", "middle")
    minLabel.setAttribute("font-size", "10")
    minLabel.setAttribute("fill", "#6a737d")
    minLabel.textContent = formatNumber(minValue)
    svg.appendChild(minLabel)
  }

  container.appendChild(svg)
}

export default renderSparkline
