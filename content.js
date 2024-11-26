chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    console.log("Received request to extract data for URL:", request.url);

    // Tìm tất cả các bài viết trong nhóm
    const posts = document.querySelectorAll("[aria-posinset]");

    if (!posts || posts.length === 0) {
      sendResponse({ status: "error", error: "No posts found on the page." });
      return;
    }

    // Lấy link group
    const facebookUrl = request.url;

    // Lấy tên page
    const pageName =
      document.querySelector(".html-h1 span a")?.innerText || "-";

    // Duyệt qua từng bài post để thu thập thông tin
    const postData = Array.from(posts).map((post, _) => {
      const posterElement = post.querySelector(
        '[data-ad-rendering-role="profile_name"]'
      );

      // Lấy tên người đăng
      const posterName =
        posterElement?.querySelector("a")?.innerText || "Unknown Poster";

      // Lấy URL người đăng
      let posterUrl = posterElement?.querySelector("a")?.getAttribute("href");
      posterUrl =
        "https://www.facebook.com" + posterUrl?.split("/?")[0] || "Unknown URL";

      const text =
        post.querySelector('[data-ad-rendering-role="story_message"]')
          ?.innerText || "No content";

      // Số lượt thích
      const likesText =
        post
          .querySelector('[aria-label^="Thích:"]')
          ?.getAttribute("aria-label")
          ?.match(/\d+/)[0] || "0";
      const likes = parseInt(likesText) || 0;
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
