const getPackageName = () => {
  const [, owner, repo ] = location.pathname.split('/')

  return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`)
    .then(response => {
      if (response.status === 404) throw new Error('package.json is not found')
      return response.json()
    })
    .then(response => JSON.parse(atob(response.content)).name)
}

const getStats = (packageName) => {
  return fetch(`https://api.npmjs.org/downloads/range/last-month/${packageName}`)
    .then(response => {
      if (response.status === 404) throw new Error('npm stats is not found')
      return response.json()
    })
    .then(response => {
      let { downloads } = response

      const lastDay = downloads[downloads.length - 1].downloads
      const lastWeek = downloads.slice(downloads.length - 7, downloads.length).reduce((sum, day) => (sum + day.downloads), 0)
      const lastMonth = downloads.reduce((sum, day) => (sum + day.downloads), 0)

      return { packageName, downloads, lastDay, lastWeek, lastMonth }
    })
    .catch(console.error)
}

const renderChart = (chartCanvas, stats) => {
  const ctx = chartCanvas.getContext('2d')
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: stats.downloads.map(d => d.day),
      datasets: [{
        label: "Downloads",
        data: stats.downloads.map(d => d.downloads),
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

const renderStats = (stats) => {
  const pageheadActions = document.querySelector('ul.pagehead-actions')

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
    <div class="select-menu js-menu-container js-select-menu">
      <a href="https://www.npmjs.com/package/${stats.packageName}" target="_blank" class="btn btn-sm btn-with-count">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="13px" viewBox="0 0 18 7">
          <path fill="#CB3837" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/>
          <polygon fill="#FFFFFF" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 "/>
          <path fill="#FFFFFF" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z"/>
          <polygon fill="#FFFFFF" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 "/>
        </svg>
      </a>
      <span class="social-count js-menu-target">
        ${stats.lastDay.toLocaleString()}
        <span role="button" class="select-menu-button" aria-haspopup="true" aria-expanded="false" aria-label="Toggle npm stats menu"></span>
      </span>
      <div class="select-menu-modal-holder">
        <div class="select-menu-modal js-menu-content">
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
        </div>
      </div>
    </div>
  `
  pageheadActions.appendChild(li)

  const availSpace = window.innerWidth - li.getBoundingClientRect().right > 300
  if (!availSpace) {
    li.classList.add('npm-stats--inside')
  }
}

const run = () => {
  getPackageName()
    .then(getStats)
    .then(renderStats)
    .catch(() => {})
}

run()
