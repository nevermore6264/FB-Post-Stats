// Runs on the Facebook mobile page (m.facebook.com)
let pageData = {
  pageName: document.querySelector("h1")?.innerText,
  postID: window.location.href.split("/").pop(),
  caption: document.querySelector('div[data-ft="{}"]')?.innerText,
  likes: document.querySelector('[aria-label*="likes"]')?.innerText,
  shares: document.querySelector('[aria-label*="shares"]')?.innerText,
  dateTime: document.querySelector("abbr")?.getAttribute("title"),
  comments:
    document.querySelectorAll(
      'div[data-testid="UFI2CommentsList/root_depth_0"]'
    )?.length || 0,
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    sendResponse(pageData);
  }
});
