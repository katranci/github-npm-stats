const renderChart = (chartCanvas, stats) => {
  const ctx = chartCanvas.getContext('2d')
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: stats.apiResponse.downloads.map(d => d.day),
      datasets: [{
        label: "Downloads",
        data: stats.apiResponse.downloads.map(d => d.downloads),
        borderWidth: 1,
        borderColor: '#28a745'
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            callback (value, index, values) {
              return value.toLocaleString()
            }
          }
        }]
      }
    }
  })
}

const renderStats = (packageName, stats, opts) => {
  const pageheadActions = document.querySelector('ul.pagehead-actions')

  if (pageheadActions.querySelector('.npm-stats')) {
    return
  }

  const observer = new MutationObserver(mutations => {
    const chartCanvas = document.getElementById('npm-stats-chart')
    if (!chartCanvas) return
    observer.disconnect()
    renderChart(chartCanvas, stats)
  })

  observer.observe(pageheadActions, { childList: true })

  const li = document.createElement('li')
  li.className = 'npm-stats'
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
        ${stats[opts.period].toLocaleString()}
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
        <canvas id="npm-stats-chart"></canvas>
      </details-menu>
    </details>
  `
  pageheadActions.appendChild(li)

  const availSpace = window.innerWidth - li.getBoundingClientRect().right > 300
  if (!availSpace) {
    li.classList.add('npm-stats--inside')
  }
}

export default renderStats
