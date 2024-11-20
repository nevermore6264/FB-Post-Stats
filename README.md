# **Facebook Post Statistics Extension**

## **Giới thiệu**

Extension này cho phép bạn thống kê các bài viết trên một trang Facebook (Group/Page/Profile). Kết quả sẽ bao gồm:

- Thời gian đăng bài.
- Lượt thích, bình luận, và chia sẻ.
- Xuất dữ liệu thành file Excel (.xlsx).

## **Cấu trúc dự án**

Dự án gồm các file chính sau:

### **1. manifest.json**

- File cấu hình chính cho extension.
- Định nghĩa các quyền, script, và popup giao diện.

### **2. popup.html**

- Giao diện chính của extension.
- Hiển thị nút thao tác để bắt đầu thu thập dữ liệu.

### **3. popup.js**

- Xử lý logic của giao diện `popup.html`.
- Kết nối giao diện với `content.js` để khởi động quá trình thu thập dữ liệu.

### **4. content.js**

- Thu thập dữ liệu từ trang Facebook.
- Chạy các script để quét bài viết, đếm số lượt thích, bình luận, chia sẻ.
- Tích hợp thư viện [SheetJS](https://sheetjs.com/) để xuất dữ liệu ra file Excel.

---

## **Cài đặt**

1. Tải mã nguồn và giải nén vào một thư mục.
2. Truy cập **chrome://extensions/** trên trình duyệt Google Chrome (hoặc Edge).
3. Bật chế độ **Developer Mode** (Góc phải trên cùng).
4. Nhấn **Load unpacked** và chọn thư mục chứa mã nguồn của extension.

---

## **Hướng dẫn sử dụng**

1. Truy cập một trang Facebook (Group/Page/Profile) mà bạn muốn thống kê.
2. Nhấn vào biểu tượng extension trên thanh công cụ trình duyệt.
3. Nhấn nút **Bắt đầu** để quét bài viết.
4. Kết quả sẽ tự động xuất ra file Excel.

---

## **Yêu cầu**

- Trình duyệt hỗ trợ WebExtension: Chrome, Edge, hoặc Firefox.
- File **xlsx.full.min.js** từ [SheetJS](https://github.com/SheetJS/sheetjs) được đặt trong thư mục `libs/`.
