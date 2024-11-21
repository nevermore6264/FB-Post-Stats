document.getElementById("startButton").addEventListener("click", () => {
  console.log("Bắt đầu crawl data");
  const url = document.getElementById("urls").value.trim(); // Lấy 1 URL duy nhất

  if (!url) {
    alert("Please enter a valid URL!");
    return;
  }

  // Gửi tin nhắn đến content.js
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "extractData", url: url }, // Chỉ gửi 1 URL
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
          } else if (response?.status === "success") {
            extractedData = [response.data]; // Lưu kết quả vào biến toàn cục
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
    }
  });
});

function renderTable(data) {
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = ""; // Xóa nội dung cũ

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.pageName}</td>
        <td>${item.postID}</td>
        <td>${item.caption}</td>
        <td>${item.likes}</td>
        <td>${item.shares}</td>
        <td>${item.dateTime}</td>
        <td>${item.comments}</td>
        <td>${item.postURL}</td>
      `;
    tableBody.appendChild(row);
  });
}

document.getElementById("exportButton").addEventListener("click", () => {
  if (extractedData.length === 0) {
    alert("No data available to export!");
    return;
  }
  downloadData(extractedData);
});

function downloadData(data) {
  let csvContent =
    "Page Name,Post ID,Caption,Likes,Shares,Date/Time,Comments,Post URL\n";
  data.forEach((item) => {
    csvContent += `"${item.pageName}","${item.postID}","${item.caption}","${item.likes}","${item.shares}","${item.dateTime}","${item.comments}","${item.postURL}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "facebook_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}
