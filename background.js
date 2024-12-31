chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "searchAlternatives") {
    const { title, chapter } = message;

    if (!title || !chapter) {
      sendResponse({ success: false, error: "Missing title or chapter information." });
      return;
    }

    try {
      const query = `${decodeURIComponent(title)} Chapter ${decodeURIComponent(chapter)}`;
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

      // Perform an HTTP request to Google Search
      const response = await fetch(googleSearchUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch search results.");
      }

      const html = await response.text();

      // Parse the HTML to extract search results
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const links = Array.from(doc.querySelectorAll("a"))
        .map(anchor => ({
          title: anchor.textContent,
          link: anchor.href,
          domain: new URL(anchor.href).hostname,
        }))
        .filter(link => link.title && link.link && link.domain); // Basic validation

      sendResponse({ success: true, links });
    } catch (error) {
      console.error("Error in searchAlternatives:", error);
      sendResponse({ success: false, error: error.message });
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
  return true; // Indicates the listener will respond asynchronously
});
