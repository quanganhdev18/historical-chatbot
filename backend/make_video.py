import os
import sys
import subprocess
from PIL import Image, ImageDraw, ImageFont

slides = [
    {
        "title": "Historical Chatbot",
        "subtitle": "Hành trình gặp gỡ Bà Triệu",
        "content": "Nhóm:\n- Đỗ Quang Anh\n- Phạm Văn Quân\n- Phạm Văn Hiệp\n- Nguyễn Đình Tuấn Anh",
        "voice": "Ta là Triệu Thị Trinh. Chào mừng các người đến với buổi trình bày dự án Chatbot Lịch sử. Dự án này được phát triển bởi các hậu bối tài năng là Quang Anh, Văn Quân, Văn Hiệp và Tuấn Anh."
    },
    {
        "title": "1. Vấn Đề & Đối Tượng",
        "subtitle": "Giải quyết sự khô khan trong giáo dục",
        "content": "- Sách vở khô khan làm giảm hứng thú.\n- Học sinh khó hình dung khí thế lịch sử.\n- Hệ thống dành cho học sinh, người yêu lịch sử.",
        "voice": "Ta thấy việc học lịch sử qua sách vở đôi khi khô khan quá. Học trò làm sao mà cảm nhận được khí thế hào hùng của các trận đánh? Vì vậy, hệ thống này ra đời dành riêng cho những người yêu nước, đam mê lịch sử."
    },
    {
        "title": "2. Trải Nghiệm Mục Tiêu",
        "subtitle": "Nhập vai & Không gian chiến thuật",
        "content": "- Nhập vai trò chuyện trực tiếp cùng AI Bà Triệu.\n- Khám phá Bản đồ Cửu Chân chân thực.\n- Tự quyết định hướng đi trong hội thoại đa tuyến.",
        "voice": "Đến với hệ thống, các ngươi sẽ được trực tiếp trò chuyện cùng Ta. Hơn thế nữa, các ngươi còn được tự do khám phá bản đồ chiến thuật tại Ngàn Nưa, Bồ Điền và phải tự mình đưa ra những quyết định sinh tử."
    },
    {
        "title": "3. Công Nghệ Sử Dụng",
        "subtitle": "Tiên tiến & Tốc độ cao",
        "content": "- Giao diện ReactJS Minimalist Vector.\n- Backend FastAPI & giao tiếp WebSocket.\n- Trí tuệ nhân tạo Ollama Qwen 2 chấm 5.\n- Piper TTS tạo giọng nói tự nhiên.",
        "voice": "Dù ta sống ở thế kỷ thứ ba, nhưng các hậu bối đã dùng những công nghệ tiên tiến nhất thời nay để tái tạo hình ảnh của ta. Tiêu biểu như ứng dụng React, kết nối theo thời gian thực WebSocket, Mô hình Trí tuệ nhân tạo ô la ma và cả công nghệ giọng nói Piper."
    },
    {
        "title": "4. Giá Trị Nổi Bật",
        "subtitle": "Chân thực & Miễn phí",
        "content": "- Dùng mã nguồn mở, không tốn phí thuê API.\n- Tái hiện lịch sử qua giọng điệu đầy cảm xúc.\n- Dễ dàng nhân bản cho nhiều nhân vật khác.",
        "voice": "Điểm đáng tự hào nhất là dự án này hoàn toàn sử dụng mã nguồn mở và miễn phí, ai cũng có thể sử dụng. Lịch sử không chỉ là những trang giấy, nó là cảm xúc, là dòng máu anh hùng. Ta tin dự án này sẽ đánh thức lòng tự hào dân tộc của tất cả các ngươi."
    }
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Get python executable dir, piper.exe is next to it in venv/Scripts
# Wait, actually PIPER_EXE was defined as os.path.join(os.path.dirname(sys.executable), "piper.exe") in main.py
PIPER_EXE = os.path.join(os.path.dirname(sys.executable), "piper.exe")
PIPER_MODEL = os.path.join(BASE_DIR, "models", "vi_VN-vais1000-medium.onnx")

def create_image(slide, index):
    img = Image.new('RGB', (1920, 1080), color=(44, 62, 80))
    d = ImageDraw.Draw(img)
    try:
        font_title = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 90)
        font_sub = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 55)
        font_content = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 60)
    except IOError:
        font_title = font_sub = font_content = ImageFont.load_default()
    
    # Title
    d.text((960, 200), slide['title'], fill=(236, 240, 241), font=font_title, anchor="mm")
    
    # Subtitle
    d.text((960, 320), slide['subtitle'], fill=(52, 152, 219), font=font_sub, anchor="mm")
    
    # Content (Multiline)
    y_text = 450
    for line in slide['content'].split('\n'):
        d.text((350, y_text), line, fill=(236, 240, 241), font=font_content)
        y_text += 80
        
    img_path = os.path.join(BASE_DIR, f"slide_{index}.png")
    img.save(img_path)
    return img_path

def create_audio(text, index):
    wav_path = os.path.join(BASE_DIR, f"voice_{index}.wav")
    txt_path = os.path.join(BASE_DIR, f"voice_{index}.txt")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    
    subprocess.run([PIPER_EXE, "--model", PIPER_MODEL, "--input_file", txt_path, "--output_file", wav_path], check=True)
    os.remove(txt_path)
    return wav_path

def main():
    print("Generating assets...")
    clips = []
    
    from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips
    
    for i, slide in enumerate(slides):
        print(f"Processing slide {i+1}...")
        img_path = create_image(slide, i)
        wav_path = create_audio(slide['voice'], i)
        
        audio_clip = AudioFileClip(wav_path)
        img_clip = ImageClip(img_path).set_duration(audio_clip.duration + 0.5)
        img_clip = img_clip.set_audio(audio_clip)
        
        clips.append(img_clip)
        
    print("Concatenating video...")
    final_video = concatenate_videoclips(clips, method="compose")
    out_path = os.path.join(os.path.dirname(BASE_DIR), "Pitching_Video.mp4")
    
    final_video.write_videofile(out_path, fps=24, codec="libx264", audio_codec="aac")
    print(f"Video saved to {out_path}")
    
    for i in range(len(slides)):
        try:
            os.remove(os.path.join(BASE_DIR, f"slide_{i}.png"))
            os.remove(os.path.join(BASE_DIR, f"voice_{i}.wav"))
        except:
            pass

if __name__ == "__main__":
    main()
