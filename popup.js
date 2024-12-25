// popup.js
document.getElementById("search-button").addEventListener("click", () => {
  const results = document.getElementById("results");
  const loadingSpinner = document.getElementById("loading-spinner");

  // Show loading indicator
  loadingSpinner.style.display = "block";
  results.innerHTML = "";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getPageData" }, (response) => {
      if (!response) {
        showError("No response received from content script. Please try again.");
        loadingSpinner.style.display = "none";
        return;
      }

      const { title, chapter, domain } = response;
      chrome.runtime.sendMessage(
        { action: "searchAlternatives", title: decodeURIComponent(title), chapter: decodeURIComponent(chapter) },
        (res) => {
          loadingSpinner.style.display = "none";
          if (!res || !res.success) {
            showError("Failed to fetch search results. Please try again later.");
          } else {
            displayResults(res.links, domain);
          }
        }
      );
    });
  });
});

function showError(message) {} // TODO

function displayResults(links, currentDomain) {) // TODO

function adjustPopupSize() {) // TODO
