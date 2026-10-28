# Bảng tin học tập · Tổ Tin - Công nghệ · THPT Phú Nhuận

Bản web tĩnh và PDF một trang **rộng 60 × cao 90 cm**, gồm **16 ô cắt rời**, chào mừng 50 năm thành lập Trường THPT Phú Nhuận (1976–2026).

## Không gian sử dụng

Người dùng xác nhận 60 × 90 cm là **riêng vùng nền xanh để dán nội dung**, bên dưới phần tên bảng có sẵn. Dải đầu trang là chủ đề kỷ niệm, không lặp lại một khối tên bảng lớn. Có lề an toàn 10 mm quanh giấy và khoảng cắt 4 mm giữa các ô.

Ưu tiên in `output/pdf/bang-tin-tin-hoc-60x90cm.pdf` ở **Actual size / 100%**, khổ giấy tùy chỉnh **600 × 900 mm, hướng dọc**. Nếu in từ web, chọn lề Không, bật Đồ họa nền, tắt đầu/chân trang. PDF tải xuống luôn có đường cắt; hộp “Đường cắt” chỉ điều khiển bản in trực tiếp từ web. Có thể đổi vị trí các ô khi dán.

## Nội dung và ảnh

| Ô | Nội dung |
| --- | --- |
| 01 | Chủ đề “50 năm · Tiếp nối sáng tạo”; logo trường cạnh logo kỷ niệm 50 năm |
| 02 | Tập thể Tổ Tin - Công nghệ mới; ảnh Tổ Tin học và logo Tin học được giữ như hình ảnh lưu niệm |
| 03–05 | An toàn mạng, lập trình với ví dụ Python, dữ liệu với biểu đồ minh họa |
| 06–07 | Hoạt động AI Challenge và trao giải; AI có trách nhiệm trong học tập |
| 08–10 | Robot dò đường, nghiên cứu khoa học kỹ thuật và trại lập trình |
| 11–13 | Kiểm chứng thông tin, thiết kế đồ họa, tập huấn Google Education và chuyên đề AI |
| 14–16 | Hướng nghiệp, sáu miền năng lực số, công nghệ trong giáo dục và lời tri ân nhân dịp 50 năm |

Dùng đủ **12 ảnh**, gồm ảnh mới `To Tin hoc Cong nghe.jpg` và 11 ảnh trước đó. Chú thích theo tên tệp và thông tin người dùng xác nhận. Hai ảnh tên máy ảnh tương ứng trải nghiệm công nghệ kỹ thuật của trường đại học và trại lập trình bồi dưỡng học sinh. Không tự thêm tên người, giải thưởng hoặc mốc lịch sử chưa được cung cấp.

Ảnh giữ nguyên nội dung, không cắt người; bản web được tối ưu tối đa 3200 px, ảnh nguồn đầy đủ vẫn ở thư mục cha. Sáu hình minh họa SVG tự vẽ về bảo mật, lập trình, dữ liệu, AI, robot và giáo dục có thể in sắc nét. Biểu đồ 10 bạn là **số liệu minh họa**, không phải thống kê của trường. Không có lời kêu gọi thiết kế poster hay thông báo cuộc thi mới.

## Tham khảo nội dung

- [CISA: Secure Our World](https://www.cisa.gov/secure-our-world): thói quen bảo vệ tài khoản và nhận diện giả mạo.
- [Báo Điện tử Chính phủ: Khung năng lực số cho người học, Thông tư 02/2025/TT-BGDĐT](https://baochinhphu.vn/bo-giao-duc-va-dao-tao-ban-hanh-khung-nang-luc-so-cho-nguoi-hoc-102250206093701931.htm).
- [Báo Điện tử Chính phủ: Khung năng lực số cho giáo viên, cán bộ quản lí, Thông tư 18/2026/TT-BGDĐT](https://xaydungchinhsach.chinhphu.vn/thong-tu-so-18-2026-tt-bgddt-quy-dinh-khung-nang-luc-so-doi-voi-giao-vien-can-bo-quan-li-11926040316034855.htm).
- [Bộ GDĐT: Chương trình giáo dục phổ thông](https://moet.gov.vn/content/vanban/Lists/VBPQ/Attachments/1483/vbhn-chuong-trinh-tong-the.pdf): hai định hướng của môn Tin học.

Các phần giải thích, ví dụ và gợi ý thực hành do bảng tin biên soạn, không phải tường thuật thêm về sự kiện trong ảnh. Nguồn rút gọn được in ở chân trang; liên kết đầy đủ nằm dưới bản xem trước trên web.

## Chỉnh sửa và xuất bản

- Sửa nội dung trong `index.html`, bố cục và màu sắc trong `styles.css`, thao tác in trong `app.js`.
- Tổng chiều cao các hàng là 856 mm, cộng 6 khoảng 4 mm thành 880 mm; thêm hai lề 10 mm thành 900 mm.
- Ảnh và SVG nằm trong `assets/`. Phông Noto Sans được lưu cục bộ, hỗ trợ tiếng Việt; giấy phép ở `assets/OFL.txt`.
- GitHub Actions tự xuất bản khi đẩy thay đổi lên `main`. PDF là bản xuất sẵn: sửa nội dung web phải xuất lại PDF rồi commit cùng thay đổi.

Mở máy chủ HTTP ở thư mục dự án và chạy `node qa/check.cjs`. Cài Playwright hoặc đặt `PLAYWRIGHT_MODULE` trỏ tới gói có sẵn; máy chạy cần có Microsoft Edge. Script kiểm tra ảnh/phông, 16 ô, logo cạnh nhau, ảnh tập thể mới, 6 minh họa, nội dung tràn/chồng nhau, nút hướng dẫn và giao diện điện thoại; đồng thời xuất PDF.

Sau đó chạy `python qa/check-pdf.py` với môi trường có pypdf để bắt lỗi số trang và khổ giấy. Dựng PDF ra ảnh bằng Poppler để kiểm tra trực quan trước khi xuất bản. Các hàng dùng kích thước cố định và giới hạn hàng lưới để tránh đẩy ô sang trang thứ hai.

Ảnh và logo thuộc đơn vị/cá nhân cung cấp; repo không cấp quyền tái sử dụng ảnh. Mã và minh họa có thể chỉnh sửa phục vụ bảng tin của trường.
