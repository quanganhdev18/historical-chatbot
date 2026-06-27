import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

# Define slides content
slides = [
    {
        "title": "Bản Mô Tả Ý Tưởng",
        "subtitle": "Tên dự án: Historical Chatbot - Hành trình gặp gỡ Bà Triệu",
        "content": [
            "Thành viên đội thi:",
            "- Đỗ Quang Anh",
            "- Phạm Văn Quân",
            "- Phạm Văn Hiệp",
            "- Nguyễn Đình Tuấn Anh"
        ]
    },
    {
        "title": "Vấn đề muốn giải quyết",
        "content": [
            "Việc học lịch sử hiện nay thường thông qua sách vở khô khan.",
            "Học sinh khó hình dung và cảm nhận được khí thế hào hùng của",
            "các sự kiện, dẫn đến sự thiếu hứng thú và tương tác thụ động."
        ]
    },
    {
        "title": "Đối tượng sử dụng & Trải nghiệm",
        "content": [
            "Đối tượng sử dụng:",
            "- Học sinh, sinh viên, người đam mê lịch sử Việt Nam.",
            "- Các bảo tàng, khu di tích muốn số hóa trải nghiệm tham quan.",
            "",
            "Trải nghiệm muốn tạo ra:",
            "- Tương tác nhập vai (Role-play) trực tiếp với AI Bà Triệu.",
            "- Không gian chiến thuật qua bản đồ tĩnh (Ngàn Nưa, Bồ Điền).",
            "- Hội thoại đa tuyến (Visual Novel) giúp người dùng nhập tâm."
        ]
    },
    {
        "title": "Công nghệ dự kiến sử dụng",
        "content": [
            "- Frontend: ReactJS, SVG Vector Map (giao diện minimalist).",
            "- Backend: FastAPI (Python), WebSocket truyền tải thời gian thực.",
            "- AI (LLM): Ollama (Qwen 2.5 7B) với System Prompt tùy chỉnh.",
            "- Text-to-Speech (TTS): Piper TTS model giọng tiếng Việt cục bộ."
        ]
    },
    {
        "title": "Giá trị nổi bật của sản phẩm",
        "content": [
            "- Zero-Budget & Open-Source: 100% tài nguyên mã nguồn mở, chạy",
            "  cục bộ không tốn chi phí thuê API.",
            "- Chân thực & Cảm xúc: Tái hiện lịch sử qua giọng nói và hình ảnh.",
            "- Tính mở rộng cực cao: Dễ dàng nhân bản cấu trúc để tạo ra các",
            "  vị anh hùng khác (Trần Hưng Đạo, Quang Trung...)."
        ]
    }
]

pdf_path = "D:\\Project\\historical-chatbot\\Ban_Mo_Ta_Y_Tuong.pdf"
c = canvas.Canvas(pdf_path, pagesize=landscape(A4))
width, height = landscape(A4)

# Try to register a font that supports Vietnamese. Windows has Arial.
try:
    pdfmetrics.registerFont(TTFont('Arial', 'C:\\Windows\\Fonts\\arial.ttf'))
    font_name = 'Arial'
except Exception:
    font_name = 'Helvetica'

for idx, slide in enumerate(slides):
    c.setFont(font_name, 36)
    c.drawCentredString(width/2.0, height - 2*inch, slide["title"])
    
    start_y = height - 3*inch
    if "subtitle" in slide:
        c.setFont(font_name, 22)
        c.drawCentredString(width/2.0, start_y, slide["subtitle"])
        start_y -= 1*inch
    
    c.setFont(font_name, 20)
    y = start_y
    for line in slide.get("content", []):
        c.drawString(1.5*inch, y, line)
        y -= 0.5*inch
        
    c.setFont(font_name, 12)
    c.drawCentredString(width/2.0, 0.5*inch, f"Trang {idx + 1} / {len(slides)}")
    c.showPage()
    
c.save()
print(f"PDF saved to {pdf_path}")
