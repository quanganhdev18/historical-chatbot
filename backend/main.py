import asyncio
import json
import base64
import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import re
import uuid
import subprocess

import sys
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
MODEL_NAME = "qwen2.5:7b"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PIPER_MODEL_PATH = os.path.join(BASE_DIR, "models", "vi_VN-vais1000-medium.onnx")
PIPER_EXE = os.path.join(os.path.dirname(sys.executable), "piper.exe")

SYSTEM_PROMPT = """Bạn là Bà Triệu (Triệu Thị Trinh), nữ anh hùng dân tộc Việt Nam. Bạn đang trò chuyện với người thời nay. Hãy nói chuyện ngắn gọn, hào hùng, mang đậm tinh thần yêu nước. 
TUYỆT ĐỐI TUÂN THỦ CÁC QUY TẮC SAU: 
1. Chỉ trả lời các câu hỏi nằm trong phạm vi kiến thức lịch sử liên quan đến cuộc đời, khởi nghĩa của bạn và bối cảnh lịch sử Việt Nam (năm 248). Nếu người dùng hỏi về công nghệ, tương lai, hoặc các chủ đề không liên quan, hãy từ chối khéo léo.
2. CHỈ ĐƯỢC PHÉP SỬ DỤNG TIẾNG VIỆT 100%. Tuyệt đối không sử dụng, không chèn thêm bất kỳ ký tự tiếng Trung (Hán tự), tiếng Anh hay ngôn ngữ nào khác ngoài tiếng Việt trong bất kỳ tình huống nào.

QUY TẮC XƯNG HÔ BẮT BUỘC:
- Luôn xưng bản thân là "Ta".
- Gọi người đối diện là "Ngươi" hoặc "Hậu bối" để thể hiện sự uy nghi, bề trên và cổ kính. Tuyệt đối không dùng "Tôi", "Bạn", "Mình".

THÔNG TIN LỊCH SỬ BẮT BUỘC PHẢI NHỚ CHÍNH XÁC:
- Khởi nghĩa của bạn nổ ra năm 248 chống ách đô hộ của nhà Đông Ngô.
- Căn cứ khởi nghĩa đầu tiên được lập tại ngàn Nưa (Núi Nưa), nay thuộc huyện Triệu Sơn, tỉnh Thanh Hóa. Núi Nưa là nơi rèn luyện nghĩa quân và chứa đựng nhiều dấu ấn lịch sử của cuộc khởi nghĩa.
- Bạn cùng anh trai là Triệu Quốc Đạt lãnh đạo nhân dân dấy binh.
- Tướng giặc được nhà Đông Ngô phái sang đàn áp cuộc khởi nghĩa là LỤC DẬN (cháu của Lục Tốn), mang theo 8000 quân. Tuyệt đối ghi nhớ đúng tên Lục Dận, không được nhầm lẫn với bất kỳ tên nào khác.
- Cuối cùng, do lực lượng chênh lệch và thế giặc quá mạnh, bạn đã tuẫn tiết tại núi Tùng (Hậu Lộc, Thanh Hóa) để giữ trọn khí tiết.
- Câu nói nổi tiếng: "Tôi chỉ muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông..." (Lưu ý: riêng trong câu nói trích dẫn này thì giữ nguyên chữ "Tôi" theo lịch sử, còn khi trò chuyện bình thường thì phải xưng "Ta").
"""

async def ollama_stream(prompt: str):
    """Yields generated text chunks from Ollama."""
    async with httpx.AsyncClient(timeout=None) as client:
        try:
            async with client.stream("POST", OLLAMA_URL, json={
                "model": MODEL_NAME,
                "system": SYSTEM_PROMPT,
                "prompt": prompt,
                "stream": True,
                "options": {
                    "temperature": 0.2
                }
            }) as response:
                async for line in response.aiter_lines():
                    if line:
                        data = json.loads(line)
                        if "response" in data:
                            yield data["response"]
                        if data.get("done"):
                            break
        except Exception as e:
            print(f"Ollama error: {e}")
            yield " (Lỗi kết nối Ollama) "

async def generate_tts_audio(text: str):
    """Calls piper via subprocess to generate WAV audio bytes."""
    temp_id = uuid.uuid4().hex
    temp_filename = os.path.join(BASE_DIR, f"temp_{temp_id}.wav")
    temp_txt_filename = os.path.join(BASE_DIR, f"temp_{temp_id}.txt")
    try:
        # Ghi văn bản ra file tạm với chuẩn UTF-8 để tránh lỗi encoding cp1252 của Windows stdin
        with open(temp_txt_filename, "w", encoding="utf-8") as f:
            f.write(text)
            
        def run_piper():
            return subprocess.run(
                [PIPER_EXE, "--model", PIPER_MODEL_PATH, "--input_file", temp_txt_filename, "--output_file", temp_filename],
                capture_output=True,
                check=False
            )
            
        result = await asyncio.to_thread(run_piper)
        
        if result.returncode == 0:
            with open(temp_filename, "rb") as f:
                wav_data = f.read()
            os.remove(temp_filename)
            os.remove(temp_txt_filename)
            return base64.b64encode(wav_data).decode('utf-8')
        else:
            print(f"Piper error: {result.stderr.decode('utf-8', errors='ignore')}")
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
            if os.path.exists(temp_txt_filename):
                os.remove(temp_txt_filename)
            return None
    except Exception as e:
        print(f"Piper exception: {repr(e)}")
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if os.path.exists(temp_txt_filename):
            os.remove(temp_txt_filename)
        return None

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Removed print statement to prevent UnicodeEncodeError on Windows consoles
            
            sentence_buffer = ""
            async for text_chunk in ollama_stream(data):
                await websocket.send_text(json.dumps({
                    "type": "text",
                    "data": text_chunk
                }))
                
                sentence_buffer += text_chunk
                
                # Check for sentence boundary to chunk TTS
                if any(char in sentence_buffer for char in ['.', '!', '?', '\n']):
                    parts = re.split(r'([.!?\n]+)', sentence_buffer)
                    buffer_to_process = ""
                    new_buffer = ""
                    
                    for i in range(0, len(parts)-1, 2):
                        sentence = parts[i] + parts[i+1]
                        buffer_to_process += sentence
                    
                    if len(parts) % 2 != 0:
                        new_buffer = parts[-1]
                        
                    sentence_buffer = new_buffer
                    
                    if buffer_to_process.strip():
                        audio_b64 = await generate_tts_audio(buffer_to_process.strip())
                        if audio_b64:
                            await websocket.send_text(json.dumps({
                                "type": "audio",
                                "data": audio_b64
                            }))

            # Process remaining buffer
            if sentence_buffer.strip():
                audio_b64 = await generate_tts_audio(sentence_buffer.strip())
                if audio_b64:
                    await websocket.send_text(json.dumps({
                        "type": "audio",
                        "data": audio_b64
                    }))
            
            await websocket.send_text(json.dumps({
                "type": "done"
            }))

    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
