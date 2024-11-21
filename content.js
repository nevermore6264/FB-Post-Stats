// Function to scrape data from the current Facebook page
function scrapePageData() {
  try {
    const pageData = {
      pageName: document.querySelector("h1")?.innerText || "Unknown Page",
      postID: window.location.href.split("/").pop() || "Unknown Post ID",
      caption:
        document.querySelector('div[data-ft="{}"]')?.innerText || "No Caption",
      likes:
        document.querySelector('[aria-label*="likes"]')?.innerText || "0 Likes",
      shares:
        document.querySelector('[aria-label*="shares"]')?.innerText ||
        "0 Shares",
      dateTime:
        document.querySelector("abbr")?.getAttribute("title") || "No Date/Time",
      comments:
        document.querySelectorAll(
          'div[data-testid="UFI2CommentsList/root_depth_0"]'
        )?.length || 0,
      postURL: window.location.href,
    };
    return pageData;
  } catch (error) {
    console.error("Error scraping page data:", error);
    return {
      pageName: "Error",
      postID: "Error",
      caption: "Error",
      likes: "Error",
      shares: "Error",
      dateTime: "Error",
      comments: "Error",
      postURL: "Error",
    };
  }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    const data = scrapePageData();
    sendResponse(data);
  }
});
