chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    console.log("Received request to extract data for URL:", request.url);

    // Lấy danh sách các bài viết
    const posts = document.querySelectorAll("[role='article']"); // Tìm các bài post dựa trên role attribute
    console.log(">>>>>>>>>>>>>>>>>>>", posts);
    if (!posts || posts.length === 0) {
      sendResponse({ status: "error", error: "No posts found on the page." });
      return;
    }

    // Duyệt qua từng bài post để thu thập thông tin
    const postData = Array.from(posts).map((post) => {
      const postID = post.getAttribute("aria-posinset") || "No post ID";
      return {
        pageName: document.querySelector("h1")?.innerText || "No page name", // Tên trang
        postID: postID,
        caption:
          post.querySelector("[data-ad-preview]")?.innerText || "No caption", // Caption của bài viết
        likes: post.querySelector('[aria-label*="like"]')?.innerText || "0", // Số lượt thích
        shares: post.querySelector('[aria-label*="share"]')?.innerText || "0", // Số lượt chia sẻ
        dateTime:
          post.querySelector("abbr")?.getAttribute("title") || "Unknown", // Thời gian bài viết
        comments:
          post.querySelector('[aria-label*="comment"]')?.innerText || "0", // Số bình luận
        postURL: post.querySelector("a")?.href || "No URL", // URL của bài viết
      };
    });

    // Gửi dữ liệu đã thu thập về popup.js
    sendResponse({ status: "success", data: postData });
  }
});
