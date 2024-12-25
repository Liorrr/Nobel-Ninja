chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "searchAlternatives") {
    const { title, chapter } = message;

    if (!title || !chapter) {
      sendResponse({ success: false });
      return;
    }

    try {
      const query = `${decodeURIComponent(title)} Chapter ${decodeURIComponent(chapter)}`;
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

      // Open Google search in a new tab
      chrome.tabs.create({ url: googleSearchUrl });

      sendResponse({ success: true });
    } catch (error) {
      console.error("Error in searchAlternatives:", error);
      chrome.runtime.sendMessage({
        action: "reportBug",
        description: `An error occurred during the search operation: ${error.message}`,
        url: sender.url || "unknown",
      });
      sendResponse({ success: false });
    }
  }

  if (message.action === "reportBug") {
    try {
      const email = "mmm.suppor@gmail.com";
      const subject = encodeURIComponent("Bug Report for Nobel Ninja");
      const body = encodeURIComponent(
        `Bug Description: ${message.description}\nCurrent URL: ${message.url}`
      );
      const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
      chrome.tabs.create({ url: mailtoLink });
    } catch (error) {
      console.error("Error in reportBug:", error);
    }
  }
  return true;
});
