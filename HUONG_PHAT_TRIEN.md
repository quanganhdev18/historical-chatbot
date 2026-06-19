# Hướng Phát Triển Dự Án: Historical Chatbot (Zero-Budget cho Sinh viên CNTT)

Dựa trên nền tảng FastAPI + React và AI (Ollama + Piper) mà chúng ta đã xây dựng, dưới đây là lộ trình phát triển dự án theo các xu hướng công nghệ mới. Các đề xuất này được tối ưu hóa cho **sinh viên CNTT**: sử dụng 100% công cụ mã nguồn mở, tài nguyên miễn phí (Free Tier) và chi phí triển khai gần như bằng không (Zero-budget).

---

## 1. Trải nghiệm tương tác (Interactive Experience)
Thay vì một khung chat đơn điệu, hãy biến dự án thành một hành trình khám phá.

- **Bản đồ lịch sử tương tác (Interactive Map)**: 
  - **Ý tưởng**: Giao diện chính là một bản đồ cổ vùng Cửu Chân (Thanh Hóa). Người dùng click vào các địa danh như *Núi Nưa*, *Sông Mã*, *Núi Tùng*. Tại mỗi điểm, avatar Bà Triệu sẽ xuất hiện và kể câu chuyện lịch sử gắn với địa danh đó.
  - **Công nghệ (Miễn phí)**: Sử dụng **Leaflet.js** (thư viện bản đồ open-source) hoặc vẽ bản đồ cổ bằng hình ảnh **SVG** tương tác kết hợp với Framer Motion (React) để làm hiệu ứng click.

- **Hội thoại đa tuyến (Branching Dialogues)**:
  - **Ý tưởng**: AI không chỉ trả lời mà sẽ thỉnh thoảng hỏi ngược lại người dùng các câu hỏi tình huống: *"Nếu là ngươi, đối mặt với 8000 quân Đông Ngô, ngươi sẽ đánh hay lùi?"*. Giao diện sẽ hiện ra các nút lựa chọn (Choices) kiểu Visual Novel để người dùng tương tác nhanh.

---

## 2. Game hóa (Gamification)
Tạo động lực để người dùng học lịch sử thông qua cơ chế trò chơi.

- **Thu thập hiện vật lịch sử (Collectibles)**:
  - **Ý tưởng**: Khi người dùng hỏi những câu hỏi hay hoặc trả lời đúng câu hỏi của Bà Triệu, họ sẽ nhận được các "Mảnh ghép hiện vật" (Ví dụ: Mảnh trống đồng, Ngà voi, Kiếm cổ). Thu thập đủ mảnh ghép sẽ mở khóa các câu chuyện ẩn (Easter Eggs).
- **Hệ thống Danh hiệu & Bảng xếp hạng (Leaderboard)**:
  - **Ý tưởng**: Đánh giá kiến thức người dùng qua các câu đố lịch sử minigame. Cấp danh hiệu: *Dân thường -> Quân lính -> Tướng lĩnh*.
  - **Công nghệ (Miễn phí)**: 
    - Database: Dùng **Supabase** (Open-source Firebase alternative) hoặc **MongoDB Atlas** (gói Free Cluster 512MB) để lưu trữ điểm số.
    - Không tốn server: Các thao tác lưu trữ có thể gọi thẳng từ Frontend thông qua API key miễn phí.

---

## 3. Thực tế tăng cường & Thực tế ảo (AR/VR)
Không cần kính VR đắt tiền, sinh viên hoàn toàn có thể làm WebAR chạy thẳng trên trình duyệt điện thoại.

- **WebAR: Triển lãm vũ khí cổ trên mặt bàn**:
  - **Ý tưởng**: Tích hợp một nút "Xem mô hình AR". Người dùng dùng camera điện thoại quét mặt bàn, trang web sẽ hiển thị mô hình 3D của vũ khí thời Bà Triệu (giáo, mác, nỏ) nổi lên trên không gian thực.
  - **Công nghệ (Miễn phí)**: Dùng **AR.js** hoặc **MindAR** (100% open source, chạy thẳng trên web browser, không cần cài app). Kết hợp với **React Three Fiber**.
  - **Nguồn tài nguyên 3D**: Tìm các mô hình miễn phí (Creative Commons) trên **Sketchfab**, hoặc tự học **Blender** (phần mềm 3D miễn phí) để nặn một số vũ khí đơn giản với phong cách Low-poly.

---

## 4. Phân tích và Trực quan hóa dữ liệu (Data Visualization)
Rất tốt để ghi điểm trong các đồ án môn học hoặc nghiên cứu khoa học.

- **Dòng thời gian trực quan (Interactive Timeline)**:
  - **Ý tưởng**: Xây dựng một thanh Timeline ngang hiển thị các mốc thời gian (Năm 226: Sinh ra -> Năm 248: Khởi nghĩa nổ ra -> Tuẫn tiết). Thanh cuộn đến đâu, khung cảnh và lời thoại của Chatbot sẽ đổi màu/bối cảnh theo.
  - **Công nghệ**: Dùng **D3.js** hoặc **Recharts** để vẽ timeline sinh động.

- **Dashboard phân tích (Dành cho Admin)**:
  - **Ý tưởng**: Làm một trang Admin (cho ban giám khảo/thầy cô xem). Thu thập lịch sử chat (ẩn danh), vẽ biểu đồ Word Cloud (Đám mây từ vựng) để xem sinh viên quan tâm nhất đến từ khóa nào (*Voi 1 ngà, Lục Dận, Đông Ngô...*).
  - Phân tích cảm xúc (Sentiment Analysis): Theo dõi xem thái độ của người dùng khi nói chuyện với AI đang là tích cực, hào hứng hay tiêu cực.
  - **Công nghệ (Miễn phí)**: Dùng chính **Pandas** + **Matplotlib/Plotly** trên Backend (Python) để xử lý data, trả về cục JSON cho React vẽ biểu đồ bằng **Chart.js**.

---

## 5. Mẹo triển khai (Deployment & Hosting) với kinh phí 0 đồng

Để đưa cho bạn bè chơi qua mạng mà không mất tiền mua server:

1. **Frontend Hosting**: Đẩy mã nguồn React lên Github và deploy hoàn toàn miễn phí qua **Vercel** hoặc **Netlify**. Chỉ mất 1 phút để trang web online.
2. **Backend & AI Model**: 
   - Vì chạy Ollama và Piper cần GPU/CPU mạnh, server miễn phí trên mạng không kham nổi.
   - **Cách lách luật**: Bạn cứ chạy Backend trên máy tính cá nhân của bạn. Sau đó dùng **Ngrok** hoặc **Cloudflare Tunnels** (miễn phí) để "bắn" port 8000 của máy bạn ra Internet thành một đường link public (VD: `https://my-backend.ngrok-free.app`). 
   - Thay đổi biến `WS_URL` ở Frontend trỏ về đường link ngrok này. Khi bạn bè dùng web trên điện thoại của họ, web sẽ kết nối ngầm về máy tính của bạn để xử lý AI.
3. **Chuyển đổi AI Model (Tùy chọn)**: Nếu máy tính cá nhân của bạn không tiện cắm 24/7, hãy tạm thời vô hiệu hóa Ollama cục bộ và dùng API của **Groq** (miễn phí, xử lý cực nhanh) hoặc **Google Gemini API** (có gói Free cực rộng rãi) để thay thế cho phần Chat. Giữ nguyên Piper TTS cục bộ hoặc đổi sang Google Cloud TTS API (free tier).
