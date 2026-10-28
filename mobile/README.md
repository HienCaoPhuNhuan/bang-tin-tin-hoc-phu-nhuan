# Bản mobile · Tiếp nối sáng tạo

Link riêng: `https://hiencaophunhuan.github.io/bang-tin-tin-hoc-phu-nhuan/mobile/`.

Bản mobile sử dụng nội dung đã duyệt của bảng tin, có bố cục riêng để đọc trên điện thoại. Bản in ở thư mục gốc được giữ nguyên.

- 88 ảnh trong 9 album, gồm 76 ảnh bổ sung từ thư mục `Hinh anh` và 12 ảnh đã có.
- 8 dải thumbnail tự chạy từ phải sang trái. Album một ảnh chỉ hiển thị ảnh lớn.
- Vuốt cảm ứng, kéo chuột có quán tính, nút trước/sau và tạm dừng từng dải ảnh. Tự chạy tạm ngừng khi người xem tương tác; dải ngoài màn hình không cập nhật vị trí.
- Trình xem ảnh toàn màn hình: chuyển bằng nút, vuốt, phím mũi tên; phóng to/thu nhỏ; Escape để đóng. Ảnh lớn giữ trọn khung, thumbnail dùng crop để bố cục gọn.
- Mục lục, thanh điều hướng dưới, tiến độ đọc, nút về đầu trang và chia sẻ liên kết.
- Tình huống an toàn mạng, mô phỏng tổng bằng vòng lặp, thay đổi số liệu minh họa và tương tác sáu miền năng lực số.
- Chuyển động trang trí, hiệu ứng xuất hiện khi cuộn và trạng thái khi chạm/chọn. Có nút dừng chuyển động toàn trang; tự tắt chuyển động khi thiết bị bật reduced motion.
- Không tài khoản, không gửi dữ liệu khảo sát ra máy chủ, không theo dõi người xem. Số liệu mô phỏng được ghi rõ là ví dụ.

## Nguồn và cập nhật

`qa/prepare-mobile.py` đọc nội dung hiện tại của `index.html` ở thư mục gốc, tạo `mobile/content.html` và cập nhật vùng nội dung được đánh dấu trong `mobile/index.html`. Script tạo ảnh WebP tối đa 2000 × 1600 px và thumbnail tối đa 480 × 360 px, giữ nguyên ảnh nguồn. Album phân nhóm theo tên thư mục do người dùng cung cấp. Ảnh mới không được gán thêm tên người hoặc thành tích chưa xác nhận.

Chạy script bằng Python có Pillow khi nội dung hoặc ảnh thay đổi. Chỉnh giao diện ở `mobile/mobile.css`, hành vi ở `mobile/mobile.js`, phần đầu/cuối trang ở `mobile/index.html`. Không chạy script này để thay đổi bản in.

Giữ các tệp `mobile/`, `assets/` và bản in trong cùng GitHub Pages để đường dẫn tương đối hoạt động. Workflow Pages sao chép cả thư mục mobile, không đổi trang in gốc.

## Kiểm tra

Khởi động HTTP server ở thư mục repo, chạy `node qa/check-mobile.cjs`. Cần Playwright và Microsoft Edge; có thể đặt `PLAYWRIGHT_MODULE` trỏ đến gói Playwright cài sẵn. Kiểm tra bao gồm:

- Đối chiếu đầy đủ đoạn nội dung với bản in, số ảnh/album, lỗi JavaScript và tràn ngang.
- Thumbnail tự chạy, tạm dừng, kéo bằng chuột, vuốt cảm ứng qua CDP và cuộn dọc từ khu vực album.
- Xem ảnh lớn, chuyển ảnh, phóng to, đóng và phục hồi cuộn trang.
- Mô phỏng vòng lặp, dữ liệu, câu hỏi an toàn mạng, mục lục và tương tác năng lực số.
- Màn hình 320/375/390/430/768 px, desktop 1440 px và chế độ giảm chuyển động.

Có thể truyền URL công khai vào script để kiểm tra sau xuất bản. Các ảnh chụp và báo cáo QA nằm trong `qa/` và được bỏ qua bởi Git.
