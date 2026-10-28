# Bảng tin Tin học · THPT Phú Nhuận

Bản web tĩnh để in **một trang A1 dọc (594 × 841 mm)**, gồm **14 ô cắt rời**, chào mừng 50 năm thành lập Trường THPT Phú Nhuận (1976–2026).

## In và dán bảng tin

Ưu tiên tải `output/pdf/bang-tin-tin-hoc-A1.pdf` và in **Actual size / 100%**, giấy **A1 dọc**. PDF có sẵn nền màu và đường cắt.

Nếu in từ web: nhấn **In trang A1**, chọn giấy A1, lề Không, bật Đồ họa nền, tắt đầu/chân trang. Có khoảng an toàn 12 mm quanh giấy. Hộp “Đường cắt” chỉ thay đổi bản in trực tiếp từ web; PDF tải xuống luôn có đường cắt.

Cắt theo viền nét đứt từng ô. Tiêu đề đặt phía trên; các ô khác có thể sắp xếp lại tùy kích thước bảng tin cứng. Không có chữ, ảnh hoặc nền chạy xuyên qua hai ô.

## Nội dung

- Ô 01: tiêu đề, logo trường, logo Tổ Tin học và logo kỷ niệm 50 năm.
- Ô 02–11: đủ 11 ảnh hoạt động do người dùng cung cấp; chú thích theo tên tệp. Hai ảnh chưa có tên hoạt động được người dùng xác nhận là trải nghiệm các công nghệ kỹ thuật của trường đại học và trại lập trình bồi dưỡng học sinh.
- Ô 12: tên sáu miền năng lực số theo Thông tư 02/2025/TT-BGDĐT, tham khảo [Báo Điện tử Chính phủ](https://baochinhphu.vn/ban-hanh-quy-dinh-khung-nang-luc-so-cho-nguoi-hoc-102250207122046742.htm) và [văn bản trên Cổng Thông tin điện tử Chính phủ](https://vanban.chinhphu.vn/?classid=1&docid=212648&orggroupid=4&pageid=27160).
- Ô 13–14: gợi ý thực hành AI có trách nhiệm và thử thách tạo sản phẩm số. Đây là nội dung biên soạn cho bảng tin, không phải thông báo về một cuộc thi do trường tổ chức.

Không tự bổ sung tên người, thứ hạng giải thưởng hoặc số liệu thành tích chưa được cung cấp. Ảnh giữ trọn khung bằng `object-fit: contain`, không cắt người. Bản nguồn độ phân giải đầy đủ vẫn ở thư mục cha; bản dùng trên web được tối ưu tối đa 3200 px, không sửa nội dung ảnh. Logo tổ có độ phân giải gốc 189 × 47 px nên chỉ đặt ở kích thước nhỏ.

## Chỉnh sửa

- Sửa tiêu đề, chú thích và nội dung trong `index.html`.
- Sửa màu sắc, cỡ chữ, chiều cao các ô trong `styles.css`. Tổng chiều cao nội dung là 817 mm, cộng hai lề 12 mm thành 841 mm; các hàng cách nhau 5 mm.
- Thay ảnh và logo trong `assets/`, giữ tên tệp để không phải sửa HTML.
- Phông Noto Sans được lưu cục bộ, hỗ trợ tiếng Việt; giấy phép ở `assets/OFL.txt`.
- `app.js` xử lý thu phóng bản xem trước, hướng dẫn in và nút in; không thu thập dữ liệu.
- GitHub Actions tự xuất bản khi đẩy thay đổi lên `main`. **PDF là bản xuất sẵn:** khi sửa nội dung phải xuất lại PDF rồi commit cùng thay đổi web.

## Kiểm tra và xuất PDF

Mở máy chủ HTTP tại thư mục này. Script `qa/check.cjs` dùng Playwright và Edge để kiểm tra ảnh, phông, kích thước, tràn khung, giao diện điện thoại và các nút; đồng thời xuất PDF. Cài gói Playwright trong môi trường chạy hoặc đặt biến PLAYWRIGHT_MODULE trỏ tới gói có sẵn.

PDF đã được kiểm tra số trang, kích thước và xem ảnh dựng từ PDF. Không thêm hiệu ứng chuyển động để giữ bản in ổn định.

Ảnh và logo thuộc đơn vị/cá nhân cung cấp; việc công bố ở repo này không cấp quyền tái sử dụng ảnh. Mã HTML/CSS/JS có thể chỉnh sửa phục vụ bảng tin của trường.

