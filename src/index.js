import processPage from './process-page'

const run = () => {
  chrome.storage.sync.get('period', ({ period }) => {
    const opts = { period }
    if (!period) {
      opts.period = 'lastDay'
    }
    processPage(opts)
    handleNavigation(opts)
  })
}

const handleNavigation = (opts) => {
  const pageContainer = document.getElementById('js-repo-pjax-container')

  if (!pageContainer) {
    return
  }

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.classList && addedNode.classList.contains('pagehead')) {
          processPage(opts)
          break
        }
      }
    }
  })

  observer.observe(pageContainer, { childList: true })
}

if (!process || !process.env || process.env.NODE_ENV !== 'test') {
  run()
}

export default run
