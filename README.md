# Chatbot Lịch Sử - Bà Triệu & Lê Lợi

Dự án này là một Chatbot AI nhập vai nhân vật lịch sử (Bà Triệu, Lê Lợi), được xây dựng bằng **FastAPI** (Backend) và **React/Vite** (Frontend). Chatbot sử dụng **Ollama** (model Qwen 2.5 7B) để xử lý ngôn ngữ.

Hệ thống có 2 chế độ chính:
- **Đàm Đạo Tự Do**: Trò chuyện tự do với AI.
- **Visual Novel (Dấu Ấn Cửu Chân)**: Game nhập vai cốt truyện rẽ nhánh đa kết thúc.

## Các Tính Năng Mới (Đã Cập Nhật)
- **Tối Ưu Giao Diện (Aesthetics)**: Hiệu ứng Micro-animations, Typography với Google Fonts (Cinzel, Playfair Display), và thiết kế bóng đổ "Premium".
- **Hệ Thống Thu Thập Hiện Vật (Collectibles)**: Tương tác với AI qua các từ khóa ẩn để mở khóa "Bạch Tượng", "Gươm Thuận Thiên"... và lưu trữ trong Hành Trang.
- **Dòng Thời Gian Tương Tác (Mini Timeline)**: Dễ dàng xem các mốc sự kiện quan trọng và nhấn vào để tự động hỏi AI.
- **Bộ Nhớ Ngữ Cảnh Nâng Cao**: Sử dụng `/api/chat` giúp Ollama ghi nhớ mượt mà ngữ cảnh lịch sử.

## Yêu cầu hệ thống
1. [Node.js](https://nodejs.org/) (để chạy Frontend)
2. [Python 3.10+](https://www.python.org/) (để chạy Backend)
3. [Ollama](https://ollama.com/) (để chạy AI Model)

---

## Bước 1: Cài đặt và thiết lập AI (Ollama)
1. Tải và cài đặt Ollama từ trang chủ: https://ollama.com/
2. Mở Terminal / Command Prompt và tải model Qwen:
   ```bash
   ollama run qwen2.5:7b
   ```
   *(Hãy đảm bảo Ollama luôn chạy ngầm ở cổng mặc định 11434 khi sử dụng dự án này)*

## Bước 2: Cài đặt Backend
Mở một Terminal mới và trỏ vào thư mục `backend`:
```bash
cd backend
```

1. Tạo và kích hoạt môi trường ảo (Virtual Environment):
   ```bash
   python -m venv venv
   ```
   - **Trên Windows (Command Prompt):** `venv\Scripts\activate`
   - **Trên Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
     > **LỖI THƯỜNG GẶP:** Nếu PowerShell báo lỗi chữ đỏ "running scripts is disabled on this system", hãy chạy lệnh này trước để cấp quyền: 
     > `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
   - **Trên Mac/Linux:** `source venv/bin/activate`

2. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```

3. Chạy server Backend:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

## Bước 3: Cài đặt Frontend
Mở một Terminal khác và trỏ vào thư mục `frontend`. 
> **LỖI THƯỜNG GẶP:** Nếu bạn dùng PowerShell mà gõ lệnh `npm` bị báo lỗi đỏ (Script Execution Policy), hãy tắt PowerShell và dùng **Command Prompt (cmd.exe)** thay thế!

```bash
cd frontend
```

1. Cài đặt các thư viện Node:
   ```bash
   npm install
   ```

2. Chạy server Frontend:
   ```bash
   npm run dev
   ```

3. Mở trình duyệt theo đường dẫn hiển thị trên terminal (thường là `http://localhost:5173`) và bắt đầu trải nghiệm!
