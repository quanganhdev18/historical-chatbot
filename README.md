# Chatbot Lịch Sử - Bà Triệu & Lê Lợi (AI Gesture Control)

Dự án này là một nền tảng trải nghiệm lịch sử tương tác nhập vai (Bà Triệu, Lê Lợi), được xây dựng bằng **FastAPI** (Backend) và **React/Vite** (Frontend).
Đặc biệt, hệ thống sử dụng **Google Gemini API** (`gemini-3.1-flash-lite`) để xử lý ngôn ngữ tự nhiên và **Google MediaPipe** để điều khiển hoàn toàn bằng cử chỉ tay (Hand Tracking) qua Camera.

Hệ thống có 2 chế độ chính:
- **Đàm Đạo Tự Do**: Trò chuyện tự do với AI trong vai các nhân vật lịch sử (nhập vai nghiêm ngặt, không phá vỡ hình tượng).
- **Cốt Truyện (Visual Novel)**: Game nhập vai cốt truyện rẽ nhánh đa kết thúc có đếm ngược thời gian, âm thanh nền sống động và hiệu ứng gõ chữ (Typewriter effect).

## 🌟 Các Tính Năng Nổi Bật Mới Nhất
- **Điều Khiển Bằng Cử Chỉ Tay (AI Hand Tracking)**: 
  - Không cần chạm chuột! Sử dụng camera để nhận diện tay.
  - **Đưa tay trái / Đưa tay phải**: Dùng để chọn nhân vật hoặc đưa ra các quyết định trong chế độ Cốt Truyện.
  - **Chụm nhả ngón tay (Pinch & Release)**: Dùng để quay lại hoặc bỏ qua hiệu ứng chữ. Nhận diện cực nhạy nhờ thuật toán chống nhiễu (Hysteresis) và căn chỉnh theo tỷ lệ bàn tay (Scale-independent).
- **Giao Tiếp Bằng Giọng Nói (Speech-to-Text)**:
  - Tích hợp **Web Speech API** nhận diện tiếng Việt cực kỳ chính xác.
  - **Rảnh tay hoàn toàn**: Tự động gửi tin nhắn khi bạn ngưng nói (Auto-send).
  - **Chống nhiễu thông minh**: Chế độ Toggle vững chắc và cơ chế chống dội (Anti-bounce) giúp Micro hoạt động kiên cường kể cả trong môi trường ồn ào.
- **Thiết Kế Đậm Chất Điện Ảnh (Cinematic UI)**: 
  - Giao diện Premium với hiệu ứng chuyển cảnh hố đen thời gian (Time Vortex).
  - Phân chia màn hình (Split Screen) độc đáo khi chọn nhân vật.
  - Bộ thẻ Typography Google Fonts cao cấp (Cinzel, Playfair Display) theo từng chủ đề nhân vật (Jungle Bronze cho Bà Triệu, Imperial Gold cho Lê Lợi).
- **Backend Gemini Siêu Tốc**: Thay thế Ollama nội bộ bằng Gemini API qua WebSocket, stream chữ theo thời gian thực với độ trễ cực thấp.

## Yêu cầu hệ thống
1. [Node.js](https://nodejs.org/) (để chạy Frontend)
2. [Python 3.10+](https://www.python.org/) (để chạy Backend)
3. Webcam/Camera (để sử dụng tính năng Hand Tracking)
4. Microphone (để sử dụng tính năng Nhận diện Giọng nói)
5. Trình duyệt **Google Chrome** hoặc **Microsoft Edge** (Bắt buộc để sử dụng Speech-to-Text bản quyền Google)

---

## Bước 1: Cài đặt Backend (FastAPI + Gemini)
Mở một Terminal và trỏ vào thư mục `backend`:
```bash
cd backend
```

1. Tạo file `.env` trong thư mục `backend` và điền API Key của Google Gemini:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

2. Tạo và kích hoạt môi trường ảo (Virtual Environment):
   ```bash
   python -m venv venv
   ```
   - **Trên Windows (Command Prompt):** `venv\Scripts\activate`
   - **Trên Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
   - **Trên Mac/Linux:** `source venv/bin/activate`

3. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```
   *(Đảm bảo đã có `google-generativeai`, `fastapi`, `uvicorn`, `python-dotenv`)*

4. Chạy server Backend:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

## Bước 2: Cài đặt Frontend (React + Vite + MediaPipe)
Mở một Terminal khác và trỏ vào thư mục `frontend`:
```bash
cd frontend
```

1. Cài đặt các thư viện Node:
   ```bash
   npm install
   ```
   *(Sẽ cài đặt react, vite, và bộ thư viện @mediapipe/tasks-vision)*

2. Chạy server Frontend:
   ```bash
   npm run dev
   ```

3. Mở trình duyệt theo đường dẫn hiển thị trên terminal (thường là `http://localhost:5173`).
4. **Cấp quyền Camera** cho trình duyệt khi được hỏi để AI có thể nhận diện cử chỉ tay của bạn!
