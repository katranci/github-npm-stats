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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getRepoInfo = url => {
  const parsedUrl = new URL(url);
  const [, owner, repo] = parsedUrl.pathname.split('/');

  if (!owner || !repo) {
    return null;
  }

  return { owner, repo };
};

/* harmony default export */ __webpack_exports__["a"] = (getRepoInfo);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__process_page__ = __webpack_require__(3);


const run = () => {
  Object(__WEBPACK_IMPORTED_MODULE_0__process_page__["a" /* default */])();
  handleNavigation();
};

const handleNavigation = () => {
  const pageContainer = document.getElementById('js-repo-pjax-container');

  if (!pageContainer) {
    return;
  }

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.classList.contains('pagehead')) {
          Object(__WEBPACK_IMPORTED_MODULE_0__process_page__["a" /* default */])();
          break;
        }
      }
    }
  });

  observer.observe(pageContainer, { childList: true });
};

if (!process || !process.env || process.env.NODE_ENV !== 'test') {
  run();
}

/* harmony default export */ __webpack_exports__["default"] = (run);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__get_repo_info__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__get_package_name_get_package_name__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__get_stats_get_stats__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__render_stats__ = __webpack_require__(17);





const processPage = async () => {
  const { owner, repo } = Object(__WEBPACK_IMPORTED_MODULE_0__get_repo_info__["a" /* default */])(location.href) || {};
  if (!owner) return;

  const packageName = await Object(__WEBPACK_IMPORTED_MODULE_1__get_package_name_get_package_name__["a" /* default */])(owner, repo);
  if (!packageName) return;

  const stats = await Object(__WEBPACK_IMPORTED_MODULE_2__get_stats_get_stats__["a" /* default */])(packageName);
  if (!stats) return;

  Object(__WEBPACK_IMPORTED_MODULE_3__render_stats__["a" /* default */])(packageName, stats);
};

/* harmony default export */ __webpack_exports__["a"] = (processPage);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__get_cache_key__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__get_cached_package__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__is_fresh__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__create_package__ = __webpack_require__(8);





const getPackageName = async (owner, repo) => {
  const cacheKey = Object(__WEBPACK_IMPORTED_MODULE_0__get_cache_key__["a" /* default */])(owner, repo);
  let pkg = await Object(__WEBPACK_IMPORTED_MODULE_1__get_cached_package__["a" /* default */])(cacheKey);
  if (!Object(__WEBPACK_IMPORTED_MODULE_2__is_fresh__["a" /* default */])(pkg)) pkg = await Object(__WEBPACK_IMPORTED_MODULE_3__create_package__["a" /* default */])(cacheKey, owner, repo);
  return pkg && pkg.name !== 'N/A' ? pkg.name : null;
};

/* harmony default export */ __webpack_exports__["a"] = (getPackageName);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getCacheKey = (owner, repo) => {
  return `github.${owner}/${repo}`;
};

/* harmony default export */ __webpack_exports__["a"] = (getCacheKey);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getCachedPackage = cacheKey => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(cacheKey, result => {
      if (chrome.runtime.lastError) {
        resolve(null);
        console.warn(`[github-npm-stats] ${chrome.runtime.lastError}`);
      } else {
        resolve(result[cacheKey] || null);
      }
    });
  });
};

/* harmony default export */ __webpack_exports__["a"] = (getCachedPackage);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const isFresh = pkg => {
  if (!pkg) {
    return false;
  }

  const expirationTime = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  const isFresh = pkg.timeCreated > Date.now() - expirationTime;
  return isFresh;
};

/* harmony default export */ __webpack_exports__["a"] = (isFresh);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fetch_package_name__ = __webpack_require__(9);


const createPackage = async (cacheKey, owner, repo) => {
  const name = await Object(__WEBPACK_IMPORTED_MODULE_0__fetch_package_name__["a" /* default */])(owner, repo);
  if (!name) return null;

  const timeCreated = Date.now();
  const pkg = { name, timeCreated };

  chrome.storage.local.set({
    [cacheKey]: pkg
  }, () => {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError);
    }
  });

  return pkg;
};

/* harmony default export */ __webpack_exports__["a"] = (createPackage);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__resolve_private_package__ = __webpack_require__(10);


const fetchPackageName = async (owner, repo) => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`);

  if (response.status === 403) {
    console.warn('[github-npm-stats] Error: Hourly GitHub api rate limit exceeded');
    return null;
  }

  if (response.status === 404) {
    return 'N/A';
  }

  const responseBody = await response.json();
  const packageJson = JSON.parse(atob(responseBody.content));
  let packageName = packageJson.name;

  if (!packageName) {
    return 'N/A';
  }

  if (packageJson.private) {
    packageName = await Object(__WEBPACK_IMPORTED_MODULE_0__resolve_private_package__["a" /* default */])(owner, repo, packageName);
  }

  return packageName;
};

/* harmony default export */ __webpack_exports__["a"] = (fetchPackageName);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__get_repo_info__ = __webpack_require__(0);


const resolvePrivatePackage = async (owner, repo, packageName) => {
  const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);

  if (Math.floor(response.status / 100) === 4) {
    console.warn(`[github-npm-stats] Couldn't find "${packageName}" in npm registry`);
    return null;
  }

  const responseBody = await response.json();

  if (responseBody.bugs && responseBody.bugs.url) {
    const repoInfo = Object(__WEBPACK_IMPORTED_MODULE_0__get_repo_info__["a" /* default */])(responseBody.bugs.url);
    if (repoInfo.owner === owner && repoInfo.repo === repo) {
      return packageName;
    }
  }

  return null;
};

/* harmony default export */ __webpack_exports__["a"] = (resolvePrivatePackage);

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__get_cache_key__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__get_cached_stats__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__is_fresh__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__create_stats__ = __webpack_require__(15);





const getStats = async packageName => {
  const cacheKey = Object(__WEBPACK_IMPORTED_MODULE_0__get_cache_key__["a" /* default */])(packageName);
  let stats = await Object(__WEBPACK_IMPORTED_MODULE_1__get_cached_stats__["a" /* default */])(cacheKey);
  if (!Object(__WEBPACK_IMPORTED_MODULE_2__is_fresh__["a" /* default */])(stats)) stats = await Object(__WEBPACK_IMPORTED_MODULE_3__create_stats__["a" /* default */])(cacheKey, packageName);
  return stats;
};

/* harmony default export */ __webpack_exports__["a"] = (getStats);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getCacheKey = packageName => {
  return `npm.${packageName}`;
};

/* harmony default export */ __webpack_exports__["a"] = (getCacheKey);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getCachedStats = cacheKey => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(cacheKey, result => {
      if (chrome.runtime.lastError) {
        resolve(null);
        console.warn(`[github-npm-stats] ${chrome.runtime.lastError}`);
      } else {
        resolve(result[cacheKey] || null);
      }
    });
  });
};

/* harmony default export */ __webpack_exports__["a"] = (getCachedStats);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const isFresh = stats => {
  if (!stats) {
    return false;
  }

  const now = new Date();
  const timeToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const timeStats = new Date(stats.apiResponse.end).getTime();
  const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  const isFresh = (timeToday - timeStats) / oneDay <= 1;
  return isFresh;
};

/* harmony default export */ __webpack_exports__["a"] = (isFresh);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fetch_stats__ = __webpack_require__(16);


const createStats = async (cacheKey, packageName) => {
  const stats = await Object(__WEBPACK_IMPORTED_MODULE_0__fetch_stats__["a" /* default */])(packageName);
  if (!stats) return null;

  chrome.storage.local.set({
    [cacheKey]: stats
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    }
  });

  return stats;
};

/* harmony default export */ __webpack_exports__["a"] = (createStats);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const fetchStats = async packageName => {
  const response = await fetch(`https://api.npmjs.org/downloads/range/last-month/${packageName}`);

  if (response.status === 404) {
    console.warn('[github-npm-stats] npm stats is not found');
    return null;
  }

  const responseBody = await response.json();
  const { downloads } = responseBody;

  const lastDay = downloads[downloads.length - 1].downloads;
  const lastWeek = downloads.slice(downloads.length - 7, downloads.length).reduce((sum, day) => sum + day.downloads, 0);
  const lastMonth = downloads.reduce((sum, day) => sum + day.downloads, 0);

  return {
    apiResponse: responseBody,
    lastDay,
    lastWeek,
    lastMonth
  };
};

/* harmony default export */ __webpack_exports__["a"] = (fetchStats);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const renderChart = (chartCanvas, stats) => {
  const ctx = chartCanvas.getContext('2d');
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
            callback(value, index, values) {
              return value.toLocaleString();
            }
          }
        }]
      }
    }
  });
};

const renderStats = (packageName, stats) => {
  const pageheadActions = document.querySelector('ul.pagehead-actions');

  if (pageheadActions.querySelector('.npm-stats')) {
    return;
  }

  const observer = new MutationObserver(mutations => {
    const chartCanvas = document.getElementById('npm-stats-chart');
    if (!chartCanvas) return;
    observer.disconnect();
    renderChart(chartCanvas, stats);
  });

  observer.observe(pageheadActions, { childList: true });

  const li = document.createElement('li');
  li.className = 'npm-stats';
  li.innerHTML = `
    <div class="select-menu js-menu-container js-select-menu">
      <a href="https://www.npmjs.com/package/${packageName}" target="_blank" class="btn btn-sm btn-with-count" title="View package on npmjs.com" aria-label="View package on npmjs.com">
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
  `;
  pageheadActions.appendChild(li);

  const availSpace = window.innerWidth - li.getBoundingClientRect().right > 300;
  if (!availSpace) {
    li.classList.add('npm-stats--inside');
  }
};

/* harmony default export */ __webpack_exports__["a"] = (renderStats);

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map