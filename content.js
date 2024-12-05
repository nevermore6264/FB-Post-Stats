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
      // Lấy all tác vụ
      const infor = post.getAttribute("aria-describedby").split(" ");

      const posterElement = post.querySelector(
        '[data-ad-rendering-role="profile_name"]'
      );

      // Lấy tên người đăng
      const posterName = posterElement?.querySelector("a")?.innerText || "-";

      // Lấy URL người đăng
      let posterUrl = posterElement?.querySelector("a")?.getAttribute("href");
      posterUrl =
        posterUrl != null
          ? "https://www.facebook.com" + posterUrl?.split("/?")[0]
          : "-";

      const text =
        post.querySelector('[data-ad-rendering-role="story_message"]')
          ?.innerText || "-";

      // Số lượt thích
      const likesText =
        post
          .querySelector('[aria-label^="Thích:"]')
          ?.getAttribute("aria-label")
          ?.match(/\d+/)[0] || "0";
      const likes = parseInt(likesText) || 0;

      const commentsText =
        document.getElementById(infor[infor.length - 1])?.innerText || "-";
      const comments = parseInt(commentsText) || 0;

      let shares = 0;
      // Tìm tất cả các thẻ có attribute data-visualcompletion="ignore-dynamic"
      let elements = post.querySelectorAll(
        '[data-visualcompletion="ignore-dynamic"]'
      );

      // Duyệt qua các phần tử tìm được
      elements.forEach((element) => {
        // Tìm tất cả các thẻ span bên trong phần tử hiện tại
        let spans = element.querySelectorAll("span");

        spans.forEach((span) => {
          // Kiểm tra nếu span có class và chứa chữ "lượt chia sẻ"
          if (
            span.classList.length > 0 &&
            span.textContent.includes("lượt chia sẻ")
          ) {
            const sharesText = span.textContent?.match(/\d+/)[0] || "0";
            shares = parseInt(sharesText) || 0;
          }
        });
      });

      const idOfTimeColumn =
        document
          ?.getElementById(infor[0])
          ?.querySelector("[aria-labelledby]")
          ?.getAttribute("aria-labelledby") || null;

      const time =
        idOfTimeColumn != null
          ? document.getElementById(`${idOfTimeColumn}`)?.innerText
          : "-";

      const postURL =
        document
          .getElementById(infor[0])
          ?.querySelector("a")
          ?.getAttribute("href") || "-";
      return {
        facebookUrl,
        posterName,
        posterUrl,
        pageName,
        text,
        time,
        likes,
        comments,
        shares,
        postURL,
      };
    });

    // Gửi dữ liệu đã thu thập về popup.js
    sendResponse({ status: "success", data: postData });
  }
});
