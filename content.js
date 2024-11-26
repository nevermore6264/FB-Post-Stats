chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    console.log("Received request to extract data for URL:", request.url);

    // Tìm tất cả các bài viết trong nhóm
    const posts = document.querySelectorAll("[aria-posinset]");

    if (!posts || posts.length === 0) {
      sendResponse({ status: "error", error: "No posts found on the page." });
      return;
    }
    const facebookUrl = request.url;

    // Duyệt qua từng bài post để thu thập thông tin
    const postData = Array.from(posts).map((post, _) => {
      const pageName =
        document.querySelector(".html-h1 span")?.innerText || "Unknown Page";
      // Lấy tên và URL người đăng bài
      const posterElement = document.evaluate(
        '//*[@id=":rfn:"]/span/span/a',
        post,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      const posterName =
        posterElement?.querySelector("strong span")?.innerText ||
        "Unknown Poster";
      const posterUrl = posterElement?.getAttribute("href") || "Unknown URL";
      const text =
        post.querySelector('[data-ad-rendering-role="story_message"]')
          ?.innerText || "No content";
      const likesText =
        post.querySelector('[aria-label*="thích"]')?.innerText || "0";
      const likes = parseInt(likesText.replace(/\D/g, "")) || 0;
      const commentsText =
        post.querySelector('[aria-label*="bình luận"]')?.innerText || "0";
      const comments = parseInt(commentsText.replace(/\D/g, "")) || 0;
      const sharesText =
        post.querySelector('[aria-label*="chia sẻ"]')?.innerText || "0";
      const shares = parseInt(sharesText.replace(/\D/g, "")) || null;
      const time =
        post.querySelector("abbr")?.getAttribute("title") || "Unknown Time";
      const timestamp =
        time !== "Unknown Time" ? new Date(time).getTime() : null;

      return {
        facebookUrl,
        posterName,
        posterUrl,
        pageName,
        text,
        time,
        timestamp,
        likes,
        comments,
        shares,
      };
    });

    // Gửi dữ liệu đã thu thập về popup.js
    sendResponse({ status: "success", data: postData });
  }
});
