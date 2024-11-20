document.getElementById("start").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["content.js"], // Chạy file content.js trên trang Facebook
      },
      () => console.log("Script đã được chạy!")
    );
  });
});
