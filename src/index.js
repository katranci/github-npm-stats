import processPage from './process-page'

const run = () => {
  processPage()
  handleNavigation()
}

const handleNavigation = () => {
  const pageContainer = document.getElementById('js-repo-pjax-container')

  if (!pageContainer) {
    return
  }

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.classList.contains('pagehead')) {
          processPage()
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
