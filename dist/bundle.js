/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__get_package_name__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__get_stats__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__render_stats__ = __webpack_require__(3);




const run = async () => {
  const packageName = await Object(__WEBPACK_IMPORTED_MODULE_0__get_package_name__["a" /* default */])()
  const stats = await Object(__WEBPACK_IMPORTED_MODULE_1__get_stats__["a" /* default */])(packageName)
  Object(__WEBPACK_IMPORTED_MODULE_2__render_stats__["a" /* default */])(packageName, stats)
}

run()


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getCacheKey = (owner, repo) => {
  return `github.${owner}/${repo}`
}

const getRepoInfo = () => {
  const [, owner, repo ] = location.pathname.split('/')
  return { owner, repo }
}

const getCachedPackage = (cacheKey) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(cacheKey, (result) => {
      chrome.runtime.lastError
        ? reject(chrome.runtime.lastError)
        : resolve(result[cacheKey])
    })
  })
}

const isFresh = (pkg) => {
  if (!pkg) {
    return false
  }

  const expirationTime = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
  const isFresh = pkg.timeCreated > Date.now() - expirationTime
  return isFresh
}

const fetchPackageName = (owner, repo) => {
  return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`)
    .then(response => {
      if (response.status === 404) throw new Error('package.json is not found')
      return response.json()
    })
    .then(response => JSON.parse(atob(response.content)).name)
}

const createPackage = async (cacheKey, owner, repo) => {
  const name = await fetchPackageName(owner, repo)
  const timeCreated = Date.now()
  const pkg = { name, timeCreated }

  chrome.storage.local.set({
    [cacheKey]: pkg
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
    }
  })

  return pkg
}

const getPackageName = async () => {
  const { owner, repo } = getRepoInfo()
  const cacheKey = getCacheKey(owner, repo)
  let pkg = await getCachedPackage(cacheKey)
  if (!isFresh(pkg)) {
    pkg = await createPackage(cacheKey, owner, repo)
  }
  return pkg.name
}

/* harmony default export */ __webpack_exports__["a"] = (getPackageName);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getCacheKey = (packageName) => {
  return `npm.${packageName}`
}

const getCachedStats = (cacheKey) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(cacheKey, (result) => {
      chrome.runtime.lastError
        ? reject(chrome.runtime.lastError)
        : resolve(result[cacheKey])
    })
  })
}

const isFresh = (stats) => {
  if (!stats) {
    return false
  }

  const now = new Date()
  const timeToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const timeStats = new Date(stats.apiResponse.end).getTime()
  const oneDay = 24 * 60 * 60 * 1000 // 1 day in milliseconds
  const isFresh = (timeToday - timeStats) / oneDay <= 1
  return isFresh
}

const fetchStats = async (packageName) => {
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

      return { apiResponse: response, lastDay, lastWeek, lastMonth }
    })
}

const createStats = async (cacheKey, packageName) => {
  const stats = await fetchStats(packageName)

  chrome.storage.local.set({
    [cacheKey]: stats
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
    }
  })

  return stats
}

const getStats = async (packageName) => {
  const cacheKey = getCacheKey(packageName)
  let stats = await getCachedStats(cacheKey)
  if (!isFresh(stats)) {
    stats = await createStats(cacheKey, packageName)
  }
  return stats
}

/* harmony default export */ __webpack_exports__["a"] = (getStats);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

const renderStats = (packageName, stats) => {
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
      <a href="https://www.npmjs.com/package/${packageName}" target="_blank" class="btn btn-sm btn-with-count">
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

/* harmony default export */ __webpack_exports__["a"] = (renderStats);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map