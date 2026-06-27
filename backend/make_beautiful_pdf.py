import os
import textwrap
from PIL import Image, ImageDraw, ImageFont

# Image paths
brain_dir = r"C:\Users\quang\.gemini\antigravity\brain\e70ae9a0-3763-4ee5-b813-f307978819b1"
title_img_path = os.path.join(brain_dir, "title_bg_1782533558961.png")
map_img_path = os.path.join(brain_dir, "map_bg_1782533569174.png")
pattern_img_path = os.path.join(brain_dir, "pattern_bg_1782533581728.png")

slides_data = [
    {
        "bg": title_img_path,
        "title": "Bản Mô Tả Ý Tưởng",
        "subtitle": "Historical Chatbot - Hành trình gặp gỡ Bà Triệu",
        "content": "Thành viên đội thi:\n- Đỗ Quang Anh\n- Phạm Văn Quân\n- Phạm Văn Hiệp\n- Nguyễn Đình Tuấn Anh",
        "overlay": (0, 0, 0, 180)
    },
    {
        "bg": pattern_img_path,
        "title": "1. Vấn đề & Đối tượng",
        "content": "VẤN ĐỀ:\n- Việc học lịch sử qua sách vở thường khô khan, thiếu tính tương tác.\n- Học sinh khó cảm nhận được khí thế hào hùng của các sự kiện.\n\nĐỐI TƯỢNG:\n- Học sinh, sinh viên, người đam mê lịch sử nước nhà.\n- Các bảo tàng, khu di tích muốn số hóa trải nghiệm tham quan.",
        "overlay": (0, 0, 0, 200)
    },
    {
        "bg": map_img_path,
        "title": "2. Triển khai Ý Tưởng",
        "content": "- Kiến trúc Dual-Mode: Tách ứng dụng thành 2 chế độ chơi riêng biệt.\n- Đàm Đạo Tự Do: Hỏi đáp kiến thức trực tiếp với AI.\n- Dấu Ấn Cửu Chân: Game nhập vai cốt truyện Visual Novel.\n- Kịch bản rẽ nhánh: Người chơi quyết định chiến thuật (Đánh/Thủ).\n- Đa Kết Thúc (Multi-Endings): Lồng ghép hiệu ứng Full-Screen và Nhạc.",
        "overlay": (0, 0, 0, 210)
    },
    {
        "bg": pattern_img_path,
        "title": "3. Công nghệ dự kiến",
        "content": "- Frontend: ReactJS, CSS Animations, SVG Vector Map.\n- Backend: FastAPI (Python), WebSocket truyền tải thời gian thực.\n- AI (LLM): Ollama (Qwen 2.5 7B) với System Prompt tùy chỉnh.\n- Text-to-Speech (TTS): Piper TTS model cục bộ.\n- Môi trường: Tự động hóa hoàn toàn Offline, tối ưu tài nguyên.",
        "overlay": (0, 0, 0, 200)
    },
    {
        "bg": title_img_path,
        "title": "4. Giá trị nổi bật",
        "content": "- Zero-Budget & Open-Source: Chạy cục bộ không tốn chi phí thuê API.\n- Chân thực & Cảm xúc: Tái hiện lịch sử qua AI lồng tiếng.\n- Khả năng nhân bản: Dễ dàng áp dụng cho Quang Trung, Trần Hưng Đạo.\n- Giáo dục sâu sắc: Biến lịch sử thành một trải nghiệm sống động.",
        "overlay": (0, 0, 0, 220)
    }
]

def prepare_background(image_path, overlay_color):
    img = Image.open(image_path).convert("RGBA")
    target_width, target_height = 1920, 1080
    img_ratio = img.width / img.height
    target_ratio = target_width / target_height
    
    if img_ratio > target_ratio:
        new_width = int(target_ratio * img.height)
        offset = (img.width - new_width) // 2
        img = img.crop((offset, 0, offset + new_width, img.height))
    else:
        new_height = int(img.width / target_ratio)
        offset = (img.height - new_height) // 2
        img = img.crop((0, offset, img.width, offset + new_height))
        
    img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    overlay = Image.new('RGBA', img.size, overlay_color)
    img = Image.alpha_composite(img, overlay).convert('RGB')
    return img

def draw_text(img, slide, index, total):
    d = ImageDraw.Draw(img)
    try:
        font_title = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 90)
        font_sub = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 55)
        font_content = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 50)
        font_footer = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 30)
    except IOError:
        font_title = font_sub = font_content = font_footer = ImageFont.load_default()
    
    title_y = 150 if "subtitle" in slide else 200
    d.text((960, title_y), slide["title"], fill=(255, 215, 0), font=font_title, anchor="mm")
    
    if "subtitle" in slide:
        d.text((960, title_y + 120), slide["subtitle"], fill=(255, 255, 255), font=font_sub, anchor="mm")
    
    content_y = 450 if "subtitle" in slide else 350
    for block in slide["content"].split('\n'):
        if block.isupper() and len(block) < 20: 
            d.text((250, content_y), block, fill=(255, 215, 0), font=font_sub)
            content_y += 70
        else:
            # Wrap text to fit within ~1500px width (approx 65 chars at size 50)
            wrapped_lines = textwrap.wrap(block, width=65)
            for line in wrapped_lines:
                # If the block started with '-', align subsequent wrapped lines by adding spaces
                if block.startswith('- ') and line != wrapped_lines[0]:
                    d.text((250, content_y), "  " + line, fill=(240, 240, 240), font=font_content)
                else:
                    d.text((250, content_y), line, fill=(240, 240, 240), font=font_content)
                content_y += 70
            content_y += 15 # Add a small paragraph gap
            
    d.text((960, 1000), f"Trang {index} / {total}", fill=(200, 200, 200), font=font_footer, anchor="mm")
    d.rectangle([(50, 50), (1870, 1030)], outline=(255, 215, 0), width=4)
    
    return img

pdf_pages = []
for i, slide in enumerate(slides_data):
    bg_img = prepare_background(slide["bg"], slide["overlay"])
    final_img = draw_text(bg_img, slide, i + 1, len(slides_data))
    pdf_pages.append(final_img)

out_pdf = r"D:\Project\historical-chatbot\Ban_Mo_Ta_Y_Tuong_Premium.pdf"
pdf_pages[0].save(out_pdf, "PDF", resolution=100.0, save_all=True, append_images=pdf_pages[1:])
print(f"Beautiful PDF successfully saved at {out_pdf}")
