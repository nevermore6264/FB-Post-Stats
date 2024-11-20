(() => {
  const posts = document.querySelectorAll("div[role='article']"); // Tìm tất cả bài viết
  let results = [];

  posts.forEach((post) => {
    let time =
      post.querySelector("time")?.getAttribute("datetime") || "Không xác định";
    let likes = post.querySelector("[aria-label*='thích']")?.innerText || "0";
    let shares =
      post.querySelector("[aria-label*='chia sẻ']")?.innerText || "0";
    let comments =
      post.querySelector("[aria-label*='bình luận']")?.innerText || "0";

    results.push({
      "Thời gian": time,
      "Lượt thích": parseInt(likes.replace(/[^0-9]/g, "")) || 0,
      "Lượt chia sẻ": parseInt(shares.replace(/[^0-9]/g, "")) || 0,
      "Bình luận": parseInt(comments.replace(/[^0-9]/g, "")) || 0,
    });
  });

  // Hiển thị kết quả lên console
  console.table(results);

  // Xuất file Excel
  const exportToExcel = (data, filename) => {
    // 1. Chuyển đổi dữ liệu JSON thành một worksheet của Excel
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Tạo một workbook mới
    const workbook = XLSX.utils.book_new();

    // 3. Thêm worksheet vừa tạo vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facebook Stats");

    // 4. Xuất workbook ra file Excel với tên chỉ định
    XLSX.writeFile(workbook, filename);
  };

  console.log(exportToExcel);

  if (results.length > 0) {
    exportToExcel(results, "Facebook_Post_Stats.xlsx");
    alert(`Thống kê xong! Đã xuất ${results.length} bài viết ra file Excel.`);
  } else {
    alert("Không tìm thấy bài viết nào để thống kê.");
  }
})();
