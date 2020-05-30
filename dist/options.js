/* global chrome */
function saveSelection(event) {
  const { value } = event.target;
  chrome.storage.sync.get('period', ({ period }) => {
    if (period !== value) {
      chrome.storage.sync.set({ period: value });
    }
  });
}

function init() {
  const periodSelect = document.getElementById('period-select');
  periodSelect.addEventListener('change', saveSelection);

  chrome.storage.sync.get('period', ({ period }) => {
    periodSelect.value = period;
  });
}

init();
