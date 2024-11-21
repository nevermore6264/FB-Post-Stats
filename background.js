chrome.runtime.onInstalled.addListener(() => {
  console.log("Facebook Scraper Extension Installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "extractData") {
    console.log("Raw response:", response);

    // Start scraping logic here
    extractDataFromPage(request.url)
      .then((data) => sendResponse({ status: "success", data }))
      .catch((err) => sendResponse({ status: "error", error: err }));
    return true; // Keeps the message channel open for async response
  }
});

async function extractDataFromPage(url) {
  let data = [];
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch URL: ${url}`);

    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    // Trích xuất dữ liệu từ DOM
    const pageName = doc.querySelector("h1")?.innerText || "Unknown Page";
    const postID = url.split("/").pop(); // ID bài viết
    const caption =
      doc.querySelector('[data-ft="{}"]')?.innerText || "No caption";
    const likes = doc.querySelector('[aria-label*="like"]')?.innerText || "0";
    const shares = doc.querySelector('[aria-label*="share"]')?.innerText || "0";
    const comments =
      doc.querySelector('[aria-label*="comment"]')?.innerText || "0";
    const dateTime =
      doc.querySelector("abbr")?.getAttribute("title") || "Unknown Date";
    const pageID = url.split("/")[3] || "Unknown Page ID";

    data.push({
      pageName,
      postID,
      caption,
      likes: parseInt(likes.replace(/\D/g, "")),
      shares: parseInt(shares.replace(/\D/g, "")),
      comments: parseInt(comments.replace(/\D/g, "")),
      dateTime,
      postURL: url,
      pageURL: `https://www.facebook.com/${pageID}`,
    });
  } catch (error) {
    console.error("Error processing URL:", url, error.message);
  }
  return data;
}
