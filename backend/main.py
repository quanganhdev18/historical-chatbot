import asyncio
import json
import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
OLLAMA_CHAT_URL = "http://127.0.0.1:11434/api/chat"
MODEL_NAME = "qwen2.5:7b"

PROMPTS = {
    "batrieu": """Bạn là Bà Triệu (Triệu Thị Trinh), nữ anh hùng dân tộc Việt Nam thế kỷ 3. Mọi lời nói phải hào hùng, ngắn gọn, mang đậm tinh thần yêu nước.
- Xưng hô: Tuyệt đối chỉ xưng "Ta", gọi người đối diện là "Ngươi" hoặc "Hậu bối". NGHIÊM CẤM dùng các từ ngữ hiện đại ("tôi", "bạn", "tao", "mày", "ok", "hello"). BẠN KHÔNG BAO GIỜ ĐƯỢC THOÁT VAI (BREAK CHARACTER).
- Khởi nghĩa nổ ra năm 248 chống nhà Đông Ngô. Căn cứ đầu tiên tại ngàn Nưa (Núi Nưa, Thanh Hóa). Phòng tuyến chính là Bồ Điền.
- Tướng giặc là LỤC DẬN. Bạn cùng anh trai Triệu Quốc Đạt lãnh đạo nhân dân dấy binh. Bạn lui quân và tuẫn tiết tại núi Tùng do thế giặc mạnh.
- Câu nói nổi tiếng: "Tôi chỉ muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông..." (chỉ được dùng "Tôi" trong câu trích dẫn này).""",
    
    "leloi": """Bạn là Lê Lợi (Bình Định Vương), anh hùng dân tộc vĩ đại đã lãnh đạo khởi nghĩa Lam Sơn quét sạch giặc Minh thế kỷ 15.
- Xưng hô: Xưng "Ta" hoặc "Quả Nhân", gọi người đối diện là "Ngươi", "Khanh", hoặc "Tướng quân". Tuyệt đối không dùng từ ngữ hiện đại. BẠN KHÔNG BAO GIỜ ĐƯỢC THOÁT VAI (BREAK CHARACTER).
- Dấu mốc cốt lõi: Khởi nghĩa Lam Sơn (1418-1427). Hội thề Lũng Nhai (1416). 3 lần rút lên núi Chí Linh, Lê Lai mặc áo bào cứu chúa.
- Quân sư & Tướng tài: Nguyễn Trãi, Lê Lai, Nguyễn Xí, Trần Nguyên Hãn.
- Tướng giặc nổi bật: Vương Thông (đầu hàng), Liễu Thăng (bị chém đầu tại Chi Lăng).
- Triết lý: "Đem đại nghĩa để thắng hung tàn, lấy chí nhân để thay cường bạo". Dùng nhân nghĩa để phục nhân tâm.
- Huyền thoại: Thuận Thiên Kiếm (Gươm thần do Rùa Vàng cho mượn) và hoàn gươm tại hồ Tả Vọng."""
}

@app.on_event("startup")
async def startup_event():
    print(f"Đang tải trước mô hình {MODEL_NAME} vào RAM/VRAM để giảm độ trễ...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            await client.post(OLLAMA_URL, json={
                "model": MODEL_NAME,
                "prompt": "Chào",
                "stream": False,
                "keep_alive": "2h"
            })
        print(f"Đã tải xong mô hình {MODEL_NAME}. Sẵn sàng phản hồi tức thì!")
    except Exception as e:
        print(f"Lỗi khi warm-up Ollama: {e}")

async def ollama_stream(messages: list):
    async with httpx.AsyncClient(timeout=None) as client:
        try:
            async with client.stream("POST", OLLAMA_CHAT_URL, json={
                "model": MODEL_NAME,
                "messages": messages,
                "stream": True,
                "keep_alive": "2h",
                "options": {
                    "temperature": 0.2
                }
            }) as response:
                async for line in response.aiter_lines():
                    if line:
                        try:
                            data = json.loads(line)
                            if "message" in data and "content" in data["message"]:
                                yield data["message"]["content"]
                            if data.get("done"):
                                break
                        except json.JSONDecodeError:
                            continue # Ignore bad JSON lines
        except httpx.ReadTimeout:
            yield " (Lỗi phản hồi: Ollama đang quá tải hoặc mất kết nối) "
        except Exception as e:
            print(f"Ollama error: {e}")
            yield " (Lỗi hệ thống: Không thể kết nối với trí tuệ nhân tạo) "

@app.get("/")
async def root():
    return {
        "status": "Running",
        "message": "Backend Chatbot Lịch Sử đang hoạt động."
    }

@app.websocket("/ws/chat/{character_id}")
async def websocket_endpoint(websocket: WebSocket, character_id: str):
    await websocket.accept()
    
    system_prompt = PROMPTS.get(character_id, PROMPTS["batrieu"])
    
    chat_history = [
        {"role": "system", "content": system_prompt}
    ]
    
    try:
        while True:
            raw_data = await websocket.receive_text()
            
            # Since TTS is removed, we only care about the text.
            # We'll still parse JSON just in case frontend sends it, or fallback to raw string
            try:
                payload = json.loads(raw_data)
                user_text = payload.get("text", raw_data)
            except json.JSONDecodeError:
                user_text = raw_data
                
            chat_history.append({"role": "user", "content": user_text})
            
            # Cắt bớt lịch sử: giữ lại system prompt (index 0) và 6 tin nhắn gần nhất
            if len(chat_history) > 7:
                context_messages = [chat_history[0]] + chat_history[-6:]
            else:
                context_messages = chat_history
            
            bot_reply = ""
            try:
                async for text_chunk in ollama_stream(context_messages):
                    bot_reply += text_chunk
                    await websocket.send_text(json.dumps({
                        "type": "text",
                        "data": text_chunk
                    }))
                
                await websocket.send_text(json.dumps({
                    "type": "done"
                }))
                chat_history.append({"role": "assistant", "content": bot_reply})
            except WebSocketDisconnect:
                print("Client disconnected during stream")
                break
            except Exception as e:
                print(f"Error during stream: {e}")
                break

    except WebSocketDisconnect:
        print("Client disconnected normally")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
