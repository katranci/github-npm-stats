const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(0) + "K"
  return num.toString()
}

const renderSparkline = (container, stats) => {
  const downloads = stats.apiResponse.downloads.map((d) => d.downloads)
  const width = 280
  const height = 80
  const paddingX = 4
  const paddingTop = 14
  const paddingBottom = 4
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
    minLabel.setAttribute("y", height - paddingBottom + 10)
    minLabel.setAttribute("text-anchor", "middle")
    minLabel.setAttribute("font-size", "10")
    minLabel.setAttribute("fill", "#6a737d")
    minLabel.textContent = formatNumber(minValue)
    svg.appendChild(minLabel)
  }

  container.appendChild(svg)
}

const renderStats = (packageName, stats) => {
  const pageheadActions = document.querySelector("ul.pagehead-actions")

  const observer = new MutationObserver(() => {
    const chartContainer = document.getElementById("npm-stats-chart")
    if (!chartContainer) return
    observer.disconnect()
    renderSparkline(chartContainer, stats)
  })

  observer.observe(pageheadActions, { childList: true })

  const li = document.createElement("li")
  li.className = "npm-stats"
  li.innerHTML = `
    <a href="https://www.npmjs.com/package/${packageName}" target="_blank" class="btn btn-sm btn-with-count" title="View package on npmjs.com" aria-label="View package on npmjs.com">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="13px" viewBox="0 0 18 7">
        <path fill="#CB3837" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/>
        <polygon fill="#FFFFFF" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 "/>
        <path fill="#FFFFFF" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z"/>
        <polygon fill="#FFFFFF" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 "/>
      </svg>
    </a>
    <details class="details-reset details-overlay select-menu float-left">
      <summary class="social-count select-menu-button" aria-haspopup="menu" role="button" aria-label="Toggle npm stats menu">
        ${stats.lastDay.toLocaleString()}
      </summary>
      <details-menu class="select-menu-modal position-absolute mt-5">
        <div class="select-menu-header">
          <span class="select-menu-title">Downloads</span>
        </div>
        <dl>
          <dt>Last day</dt>
          <dd>${stats.lastDay.toLocaleString()}</dd>
          <dt>Last week</dt>
          <dd>${stats.lastWeek.toLocaleString()}</dd>
          <dt>Last month</dt>
          <dd>${stats.lastMonth.toLocaleString()}</dd>
        </dl>
        <div id="npm-stats-chart"></div>
      </details-menu>
    </details>
  `
  pageheadActions.appendChild(li)

  const availSpace = window.innerWidth - li.getBoundingClientRect().right > 300
  if (!availSpace) {
    li.classList.add("npm-stats--inside")
  }
}

export default renderStats
