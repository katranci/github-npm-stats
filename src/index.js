import processPage from "./process-page"

const run = () => {
  processPage()
  handleNavigation()
}

const handleNavigation = () => {
  const pageContainer = document.getElementById("js-repo-pjax-container")

  if (!pageContainer) {
    return
  }

  const observer = new MutationObserver(() => {
    if (
      pageContainer.querySelector(".pagehead-actions") &&
      !pageContainer.querySelector(".npm-stats")
    ) {
      processPage()
    }
  })

  observer.observe(pageContainer, { childList: true })
}

if (!process || !process.env || process.env.NODE_ENV !== "test") {
  run()
}

export default run
