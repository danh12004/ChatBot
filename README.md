## Hướng dẫn cài đặt chi tiết ứng dụng Chat Bot LLM

Ứng dụng Chat Bot LLM sử dụng SDK của Open AI để tích hợp với API (từ Grok hoặc các dịch vụ tương tự như Gemini, Open Router) và giao diện người dùng được xây dựng bằng ReactJS. Hướng dẫn này cung cấp các bước chi tiết để cài đặt và chạy ứng dụng.

## Yêu cầu hệ thống
- **Node.js**: Phiên bản 22.12.0 hoặc cao hơn

- **npm**: Phiên bản 11.1.0 hoặc cao hơn

- **API Key**: Đăng ký API Key của Open AI

- **Trình duyệt**: Chrome, Firefox, hoặc Edge (phiên bản mới nhất)

- **Hệ điều hành**: Windows

## Cài đặt

### Bước 1: Kiểm tra yêu cầu hệ thống

Đảm bảo bạn đã cài đặt **Node.js** (phiên bản 22.12.0 hoặc cao hơn) và **npm** (phiên bản 11.1.0 hoặc cao hơn). Chạy các lệnh sau
 
trong terminal để kiểm tra phiên bản:

```bash
node -v
npm -v
```

### Bước 2: Tải mã nguồn

Clone repository từ GitHub hoặc giải nén tệp mã nguồn:

```bash
git clone https://github.com/danh12004/ChatBot.git
cd ChatBot
```

### Bước 3: Cài đặt dependencies

Dự án bao gồm hai phần: frontend (giao diện ReactJS) và backend (API server). Cài đặt dependencies cho cả hai như sau:

#### Frontend

```bash
cd frontend/frontend-chatbot
npm install
```

#### Backend

```
cd ../../backend
npm install express dotenv cors openai axios cheerio
```

### Bước 4: Cấu hình API Key
Trong thư mục backend, tạo tệp .env:

Thêm API Key vào tệp .env:

```
PORT=3000
OPENAI_API_KEY="Thêm API Key vào đây"
```

Lưu tệp và đảm bảo nó không được đẩy lên GitHub (kiểm tra .gitignore).

### Bước 5: Khởi chạy ứng dụng

Chạy cả backend và frontend song song:

1. Khởi động backend

Trong thư mục backend, chạy:

```
npm start
```

Backend sẽ chạy trên http://localhost:3000.

2. Khởi động frontend

Mở một terminal mới, di chuyển đến thư mục frontend/frontend-chatbot và chạy:

```
npm run dev
```

Frontend sẽ chạy trên http://localhost:5173 (hoặc cổng được hiển thị trong terminal).

### Bước 6: Kiểm tra ứng dụng

Mở trình duyệt và truy cập: http://localhost:5173 (hoặc cổng được hiển thị trong terminal).

Nếu giao diện chat xuất hiện, đã cài đặt thành công!

Nhập câu hỏi và kiểm tra phản hồi từ bot.

## Xử lý lỗi thường gặp

- **Lỗi npm install thất bại:** Xóa thư mục node_modules và tệp package-lock.json, sau đó chạy lại npm install.

- **API Key không hoạt động:** Đảm bảo bạn đã sao chép đúng API Key và không có khoảng trắng thừa trong tệp .env.

- **Cổng bị chiếm dụng:** Nếu cổng 3000 hoặc 5173 đã được sử dụng, thay đổi giá trị PORT trong tệp .env hoặc dừng các tiến trình khác.