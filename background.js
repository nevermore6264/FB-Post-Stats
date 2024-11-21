chrome.runtime.onInstalled.addListener(() => {
  console.log("Facebook Scraper Extension Installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "extractData") {
    console.log("Raw response:", response);

    // Start scraping logic here
    extractDataFromPage(request.urls)
      .then((data) => sendResponse({ status: "success", data }))
      .catch((err) => sendResponse({ status: "error", error: err }));
    return true; // Keeps the message channel open for async response
  }
});

async function extractDataFromPage(urls) {
  let data = [];
  for (const url of urls) {
    await fetch(url) // Fetch data from the Facebook page URL
      .then((response) => {
        response.json();
      })
      .then((postData) => {
        data.push({
          pageName: postData.pageName,
          postID: postData.postID,
          postCaption: postData.caption,
          postLikes: postData.likes,
          postShares: postData.shares,
          postDateTime: postData.dateTime,
          postComments: postData.comments,
          postURL: url,
          pageURL: `https://m.facebook.com/${postData.pageID}`,
        });
      })
      .catch((err) => console.error("Error fetching data:", err));
  }
  return data;
}
