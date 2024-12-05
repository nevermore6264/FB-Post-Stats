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
        <td>${item.posterName}</td>
        <td><a href="${item.posterUrl}" target="_blank">${item.posterUrl}</a></td>
        <td>${item.text}</td>
        <td>${item.likes}</td>
        <td>${item.shares}</td>
        <td>${item.time}</td>
        <td>${item.comments}</td>
        <td><a href="${item.postURL}" target="_blank">${item.postURL}</a></td>
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
  // Tạo tiêu đề cột theo yêu cầu
  const headers = [
    "Nhóm",
    "Người đăng",
    "URL FB",
    "Nội dung đăng",
    "Likes",
    "Shares",
    "Date/Time",
    "Comments",
    "Post URL",
  ];

  // Bắt đầu chuỗi CSV với tiêu đề
  let csvContent = headers.join(",") + "\n";

  // Duyệt qua dữ liệu để thêm từng dòng
  data.forEach((item) => {
    const row = [
      item.pageName || "", // Nhóm
      item.posterName || "", // Người đăng
      item.posterUrl || "", // URL FB của người đăng
      item.text || "", // Nội dung đăng
      item.likes || 0, // Likes
      item.shares || 0, // Shares
      item.time || "", // Date/Time
      item.comments || 0, // Comments
      item.postURL || "", // Post URL
    ];
    csvContent += row.map((field) => `"${field}"`).join(",") + "\n";
  });

  // Tạo tệp CSV và kích hoạt tải về
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "facebook_group_posts.csv";
  a.click();
  URL.revokeObjectURL(url);
}
