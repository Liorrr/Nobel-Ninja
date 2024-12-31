document.getElementById("search-button").addEventListener("click", () => {
  const results = document.getElementById("results");
  const loadingSpinner = document.getElementById("loading-spinner");

  // Show loading indicator
  loadingSpinner.style.display = "block";
  results.innerHTML = "";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    if (!activeTab.url.startsWith("http")) {
      showError("Content script cannot be injected into this page.");
      loadingSpinner.style.display = "none";
      return;
    }

    // Dynamically inject the content script
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        files: ["content.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          showError("Failed to inject content script: " + chrome.runtime.lastError.message);
          loadingSpinner.style.display = "none";
          return;
        }

        // Send a message to the content script after injection
        chrome.tabs.sendMessage(activeTab.id, { action: "getPageData" }, (response) => {
          if (chrome.runtime.lastError || !response) {
            showError("Failed to retrieve data from the page. Please try again.");
            loadingSpinner.style.display = "none";
            return;
          }

          const { title, chapter, domain } = response;
          chrome.runtime.sendMessage(
            { action: "searchAlternatives", title: decodeURIComponent(title), chapter: decodeURIComponent(chapter) },
            (res) => {
              loadingSpinner.style.display = "none";
              if (!res || !res.success) {
                showError(res.error || "Failed to fetch search results. Please try again later.");
              } else {
                displayResults(res.links, domain);
              }
            }
          );
        });
      }
    );
  });
});

function showError(message) {
  const results = document.getElementById("results");
  results.innerHTML = `<p>${message} <button id='report-bug'>Report</button></p>`;
  document.getElementById("report-bug").addEventListener("click", () => {
    document.getElementById("bug-report").style.display = "block";
    document.getElementById("submit-bug").addEventListener("click", () => {
      const description = document.querySelector("textarea").value;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        chrome.runtime.sendMessage({
          action: "reportBug",
          description,
          url,
        });
      });
    });
  });
}

function displayResults(links, currentDomain) {
  const results = document.getElementById("results");

  // Hide duplicates and filter current domain
  const uniqueLinks = [];
  const seenDomains = new Set();

  links.forEach(link => {
    if (link.domain !== currentDomain && !seenDomains.has(link.domain)) {
      seenDomains.add(link.domain);
      uniqueLinks.push(link);
    }
  });

  results.innerHTML = "<ul>" +
    uniqueLinks.map(
      (link) => `<li><a href="${link.link}" target="_blank">${sanitizeInput(link.title)}</a></li>`
    ).join("") +
    "</ul>";
}

function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}
