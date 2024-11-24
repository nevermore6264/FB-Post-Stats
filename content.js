chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    console.log("Received request to extract data for URL:", request.url);

    // Tìm tất cả các bài viết trong nhóm
    const posts = document.querySelectorAll(".html-div"); // Điều chỉnh selector theo class thực tế

    if (!posts || posts.length === 0) {
      sendResponse({ status: "error", error: "No posts found on the page." });
      return;
    }

    // Duyệt qua từng bài post để thu thập thông tin
    const postData = Array.from(posts).map((post, index) => {
      const facebookUrl = request.url;
      const pageName =
        document.querySelector(".html-h2 span")?.innerText || "Unknown Page";
      const pageId =
        document
          .querySelector("[data-page-id]")
          ?.getAttribute("data-page-id") || "Unknown Page ID";
      const postId =
        post.getAttribute("aria-posinset") || `Unknown Post ID ${index + 1}`;
      const text =
        post.querySelector('[data-ad-rendering-role="story_message"]')
          ?.innerText || "No content";
      const likesText =
        post.querySelector('[aria-label*="like"]')?.innerText || "0";
      const likes = parseInt(likesText.replace(/\D/g, "")) || 0;
      const commentsText =
        post.querySelector('[aria-label*="comment"]')?.innerText || "0";
      const comments = parseInt(commentsText.replace(/\D/g, "")) || 0;
      const sharesText =
        post.querySelector('[aria-label*="share"]')?.innerText || "0";
      const shares = parseInt(sharesText.replace(/\D/g, "")) || null;
      const time =
        post.querySelector("abbr")?.getAttribute("title") || "Unknown Time";
      const timestamp =
        time !== "Unknown Time" ? new Date(time).getTime() : null;
      const link = post.querySelector("a")?.href || facebookUrl;
      const thumb = post.querySelector("img")?.src || null;
      const topLevelUrl = `${facebookUrl}/posts/${postId}`;

      return {
        facebookUrl,
        pageId,
        postId,
        pageName,
        url: link,
        time,
        timestamp,
        likes,
        comments,
        shares,
        text,
        link,
        thumb,
        topLevelUrl,
        facebookId: pageId,
        postFacebookId: postId,
      };
    });

    // Gửi dữ liệu đã thu thập về popup.js
    sendResponse({ status: "success", data: postData });
  }
});
