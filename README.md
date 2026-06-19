# Chatbot Lịch Sử - Bà Triệu

Dự án này là một Chatbot AI nhập vai nhân vật lịch sử Bà Triệu (Triệu Thị Trinh), được xây dựng bằng **FastAPI** (Backend) và **React/Vite** (Frontend). Chatbot sử dụng **Ollama** (model Qwen 2.5 7B) để xử lý ngôn ngữ và **Piper TTS** để tổng hợp giọng nói tiếng Việt.

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

1. Tạo môi trường ảo (Virtual Environment):
   ```bash
   python -m venv venv
   ```

2. Kích hoạt môi trường ảo:
   - Trên Windows: `.\venv\Scripts\activate`
   - Trên Mac/Linux: `source venv/bin/activate`

3. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```

4. Tải mô hình giọng nói Piper (Tiếng Việt):
   Tạo thư mục `models` bên trong `backend` và tải 2 tệp sau bỏ vào đó:
   - File ONNX: [vi_VN-vais1000-medium.onnx](https://huggingface.co/rhasspy/piper-voices/resolve/main/vi/vi_VN/vais1000/medium/vi_VN-vais1000-medium.onnx)
   - File JSON: [vi_VN-vais1000-medium.onnx.json](https://huggingface.co/rhasspy/piper-voices/resolve/main/vi/vi_VN/vais1000/medium/vi_VN-vais1000-medium.onnx.json)

5. Chạy server Backend:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

## Bước 3: Cài đặt Frontend
Mở một Terminal khác và trỏ vào thư mục `frontend`:
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

3. Mở trình duyệt theo đường dẫn hiển thị trên terminal (thường là `http://localhost:5173`) và bắt đầu trò chuyện!
