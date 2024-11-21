chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    console.log("Received request to extract data for URL:", request.url);

    // Logic lấy dữ liệu từ trang
    const pageData = {
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
      postURL: request.url,
    };

    // Gửi kết quả về popup.js
    sendResponse({ status: "success", data: pageData });
  }
});
