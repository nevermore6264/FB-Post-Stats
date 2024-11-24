let extractedData = []; // Biến lưu trữ dữ liệu bài post

document.getElementById("startButton").addEventListener("click", () => {
  console.log("Bắt đầu crawl data");
  const groupURL = document.getElementById("urls").value.trim();

  if (!groupURL) {
    alert("Please enter a valid Facebook group URL!");
    return;
  }

  // Gửi tin nhắn đến content.js
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "extractData", url: groupURL },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
            alert("Failed to communicate with the content script.");
          } else if (response?.status === "success") {
            extractedData = response.data; // Lưu dữ liệu bài post
            renderTable(extractedData); // Hiển thị dữ liệu lên bảng
          } else {
            alert(
              "Error extracting data: " + (response?.error || "Unknown error")
            );
          }
        }
      );
    } else {
      console.error("No active tab found.");
      alert("No active tab found.");
    }
  });
});

// Hàm hiển thị dữ liệu lên bảng
function renderTable(data) {
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = ""; // Xóa nội dung cũ

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.pageName}</td>
        <td>${item.postId}</td>
        <td>${item.text}</td>
        <td>${item.likes}</td>
        <td>${item.shares}</td>
        <td>${item.time}</td>
        <td>${item.comments}</td>
        <td><a href="${item.postURL}" target="_blank">Link</a></td>
      `;
    tableBody.appendChild(row);
  });
}

// Export dữ liệu thành CSV
document.getElementById("exportButton").addEventListener("click", () => {
  if (extractedData.length === 0) {
    alert("No data available to export!");
    return;
  }
  downloadData(extractedData);
});

function downloadData(data) {
  let csvContent =
    "facebookUrl,pageId,postId,pageName,url,time,timestamp,likes,comments,shares,text,link,thumb,topLevelUrl,facebookId,postFacebookId\n";
  data.forEach((item) => {
    csvContent += `"${item.facebookUrl}","${item.pageId}","${item.postId}","${item.pageName}","${item.url}","${item.time}",${item.timestamp},${item.likes},${item.comments},${item.shares},"${item.text}","${item.link}","${item.thumb}","${item.topLevelUrl}","${item.facebookId}","${item.postFacebookId}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "facebook_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}
