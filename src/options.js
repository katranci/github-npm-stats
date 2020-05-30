
function saveSelection(event) {
  console.log(event.target)
  chrome.storage.sync.set({period: event.target.value})
}

function init() {
  let periodSelect = document.getElementById('period-select')

  chrome.storage.sync.get("period", ({period}) => {
    periodSelect.value = period
  })
}

init()
