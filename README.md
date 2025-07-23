# Dự Án Truyện Tranh Online

## Giới Thiệu

Đây là dự án website truyện tranh online với kiến trúc microservice, bao gồm phần backend được xây dựng bằng Spring Boot và frontend sử dụng Next.js. Hệ thống hỗ trợ đọc truyện tranh, quản lý người dùng, hệ thống VIP, thanh toán và các tính năng OCR/TTS.

## Cấu Trúc Dự Án

Dự án được chia thành ba phần chính:

- **backend-comic**: API và xử lý dữ liệu sử dụng Spring Boot, Spring Security, và Spring Data JPA
- **frontend-comic**: Giao diện người dùng sử dụng Next.js, React và Tailwind CSS
- **ocr-and-tts-module**: API OCR (Optical Character Recognition) và TTS (Text-to-Speech) sử dụng Python

## Tính Năng Chính

- 📚 Đọc truyện tranh online
- 👤 Quản lý người dùng và phân quyền
- 💳 Hệ thống thanh toán và gói VIP
- 📱 Giao diện responsive, thân thiện với mobile
- 🔍 Tìm kiếm và phân loại truyện
- 💬 Hệ thống bình luận
- 🎯 Dashboard quản trị
- 📊 Thống kê và báo cáo
- 🔊 Tính năng OCR và TTS

## Công Nghệ Sử Dụng

### Backend

- Java 17+
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- MySQL/PostgreSQL
- Docker

### Frontend

- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Shadcn/UI

### OCR/TTS Module

- Python 3.8+
- FastAPI
- Các thư viện AI/ML cho OCR và TTS

## Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống

- Java 17 hoặc cao hơn
- Node.js 18 hoặc cao hơn
- Python 3.8 hoặc cao hơn
- Docker và Docker Compose
- MySQL hoặc PostgreSQL

### Sử Dụng Docker (Khuyến nghị)

```bash
# Clone dự án
git clone <repository-url>
cd do-an

# Chạy toàn bộ hệ thống với Docker Compose
docker-compose up -d
```

### Chạy Thủ Công

#### Backend

```bash
cd backend-comic
./mvnw spring-boot:run
```

#### Frontend

```bash
cd frontend-comic
npm install
npm run dev
```

#### OCR/TTS Module

```bash
cd ocr-and-tts-module
pip install -r requirements.txt
python main.py
```

## Cấu Hình

- Backend: Cấu hình trong `backend-comic/src/main/resources/application.yaml`
- Frontend: Cấu hình trong `frontend-comic/next.config.ts`
- OCR/TTS: Cấu hình trong `ocr-and-tts-module/src/config.py`

## Đóng Góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'feat: thêm tính năng tuyệt vời'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Dự án này được phân phối dưới MIT License. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Tác Giả

- **thjvjpxz** - _Phát triển và bảo trì_

## Liên Hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng tạo issue hoặc liên hệ trực tiếp.
