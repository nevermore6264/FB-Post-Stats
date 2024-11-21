chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    console.log("Received request to extract data for URL:", request.url);

    // Tìm tất cả bài viết trên trang
    const posts = document.querySelectorAll('[role="article"]'); // Lấy các phần tử bài viết

    if (!posts || posts.length === 0) {
      sendResponse({ status: "error", error: "No posts found on the page." });
      return;
    }

    // Duyệt qua từng bài post để thu thập thông tin
    const postData = Array.from(posts).map((post) => {
      const facebookUrl = request.url;
      const pageName =
        document.querySelector("h1")?.innerText || "Unknown Page";
      const pageId =
        document
          .querySelector("[data-page-id]")
          ?.getAttribute("data-page-id") || "Unknown Page ID";
      const postId = post.getAttribute("aria-posinset") || "Unknown Post ID";
      const text = post.querySelector("p")?.innerText || "No content";
      const likes = parseInt(
        post
          .querySelector('[aria-label*="like"]')
          ?.innerText.replace(/\D/g, "") || "0"
      );
      const comments = parseInt(
        post
          .querySelector('[aria-label*="comment"]')
          ?.innerText.replace(/\D/g, "") || "0"
      );
      const shares = parseInt(
        post
          .querySelector('[aria-label*="share"]')
          ?.innerText.replace(/\D/g, "") || "0"
      );
      const time =
        post.querySelector("abbr")?.getAttribute("title") || "Unknown Time";
      const timestamp = new Date(time).getTime();
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
