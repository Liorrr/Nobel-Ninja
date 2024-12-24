document.getElementById("search-button").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getPageData" }, (response) => {
      if (!response) {
        showError();
        return;
      }

      const { title, chapter, domain } = response;
      chrome.runtime.sendMessage(
        { action: "searchAlternatives", title, chapter },
        (res) => {
          if (!res || !res.success) {
            showError();
          } else {
            displayResults(res.links, domain);
          }
        }
      );
    });
  });
});
