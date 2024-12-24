(() => {
  const domain = (() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // Handle cases with subdomains, e.g., "sub.example.com"
    if (parts.length > 2) {
      return parts.slice(-2, -1)[0]; // Extract the main domain
    }

    // Return the first part for standard domains
    return parts[0];
  })();

  // Extract title and chapter from URL
  const urlParts = window.location.pathname.split('/');
  let title = urlParts.find(part => part && !part.toLowerCase().includes('chapter') && /^[a-z0-9-]+$/i.test(part)) || ""; // Validate and extract title
  const chapterMatch = urlParts.find(part => part.match(/chapter[-.](\d+(\.\d+)?)|ch[-.](\d+(\.\d+)?)/i));
  const chapter = chapterMatch ? chapterMatch.match(/chapter[-.](\d+(\.\d+)?)|ch[-.](\d+(\.\d+)?)/i)[1] : null;

  // Fallback for title extraction from meta tags or page content
  if (!title) {
    const metaTitle = document.querySelector("meta[property='og:title'], meta[name='twitter:title']");
    title = metaTitle ? metaTitle.content.split(' Chapter ')[0].trim() : document.querySelector("h1, h2")?.innerText.split(' Chapter ')[0].trim() || "";
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getPageData") {
      sendResponse({ domain, title: encodeURIComponent(title), chapter: encodeURIComponent(chapter) });
    }
  });
})();
