
(() => {
  const domain = window.location.hostname.split('.')[1]; // Extract domain name without subdomains

  // Extract title and chapter from URL
  const urlParts = window.location.pathname.split('/');
  const title = urlParts[2] || ""; // Assuming title is the second segment in the path
  const chapterMatch = urlParts.find(part => part.match(/chapter-(\d+)/i));
  const chapter = chapterMatch ? chapterMatch.match(/chapter-(\d+)/i)[1] : null;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getPageData") {
      sendResponse({ domain, title, chapter });
    }
  });
})();
