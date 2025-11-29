const renderSparkline = (container, stats) => {
  const downloads = stats.apiResponse.downloads.map((d) => d.downloads)
  const width = 280
  const height = 60
  const padding = 4

  const maxValue = Math.max(...downloads)
  const minValue = Math.min(...downloads)
  const range = maxValue - minValue || 1

  const points = downloads.map((value, index) => {
    const x = padding + (index / (downloads.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", width)
  svg.setAttribute("height", height)
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
  svg.style.display = "block"

  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline")
  polyline.setAttribute("points", points.join(" "))
  polyline.setAttribute("fill", "none")
  polyline.setAttribute("stroke", "#28a745")
  polyline.setAttribute("stroke-width", "1.5")
  polyline.setAttribute("stroke-linejoin", "round")
  polyline.setAttribute("stroke-linecap", "round")

  svg.appendChild(polyline)
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
