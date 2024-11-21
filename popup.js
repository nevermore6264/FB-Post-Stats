let extractedData = [];

document.getElementById("startButton").addEventListener("click", () => {
  const urls = document
    .getElementById("urls")
    .value.split(",")
    .map((url) => url.trim());

  chrome.runtime.sendMessage(
    { action: "extractData", urls: urls },
    (response) => {
      if (response.status === "success") {
        extractedData = response.data; // Lưu dữ liệu vào biến toàn cục
        renderTable(extractedData); // Hiển thị dữ liệu lên bảng
      } else {
        alert("Error: " + response.error);
      }
    }
  );
});

document.getElementById("exportButton").addEventListener("click", () => {
  if (extractedData.length === 0) {
    alert("No data available to export!");
    return;
  }
  downloadData(extractedData);
});

// Hiển thị dữ liệu lên bảng
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

// Tải xuống dữ liệu dưới dạng CSV
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
