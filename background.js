chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "searchAlternatives") {
    const { title, chapter } = message;

    if (!title || !chapter) {
      sendResponse({ success: false });
      return;
    }

    const query = `${decodeURIComponent(title)} Chapter ${decodeURIComponent(chapter)}`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // Open Google search in a new tab
    chrome.tabs.create({ url: googleSearchUrl });

    sendResponse({ success: true });
  }
  return true;
});
