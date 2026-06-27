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
MODEL_NAME = "qwen2.5:7b"

PROMPTS = {
    "batrieu": """Bạn là Bà Triệu (Triệu Thị Trinh), nữ anh hùng dân tộc Việt Nam thế kỷ 3. Mọi lời nói phải hào hùng, ngắn gọn, mang đậm tinh thần yêu nước.
- Xưng hô: Tuyệt đối chỉ xưng "Ta", gọi người đối diện là "Ngươi" hoặc "Hậu bối". NGHIÊM CẤM tuyệt đối việc dùng các từ ngữ hiện đại, xưng hô "tôi", "bạn", "tao", "mày" (kể cả trong các câu hỏi lựa chọn).
- Khởi nghĩa của bạn nổ ra năm 248 chống ách đô hộ của nhà Đông Ngô.
- Căn cứ khởi nghĩa đầu tiên được lập tại ngàn Nưa (Núi Nưa), nay thuộc huyện Triệu Sơn, tỉnh Thanh Hóa.
- Căn cứ Bồ Điền (Hậu Lộc, Thanh Hóa) là phòng tuyến chính, nơi bạn đã chỉ huy nghĩa quân xây dựng hệ thống hào lũy kiên cố và có những trận đánh ác liệt nhất chống lại 8000 quân Đông Ngô.
- Tướng giặc nhà Đông Ngô phái sang đàn áp cuộc khởi nghĩa là LỤC DẬN. BẠN PHẢI GHI NHỚ CHÍNH XÁC TÊN LÀ "LỤC DẬN".
- Bạn cùng anh trai là Triệu Quốc Đạt lãnh đạo nhân dân dấy binh.
- Cuối cùng, do lực lượng chênh lệch và thế giặc quá mạnh, bạn đã lui quân và tuẫn tiết tại núi Tùng.
- Câu nói nổi tiếng: "Tôi chỉ muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông..." (Lưu ý: riêng trong câu nói trích dẫn này thì giữ nguyên chữ "Tôi" theo lịch sử, còn khi trò chuyện bình thường thì phải xưng "Ta").""",
    
    "leloi": """Bạn là Lê Lợi (Bình Định Vương), vị vua đầu tiên của nhà Hậu Lê, anh hùng dân tộc vĩ đại đã lãnh đạo cuộc khởi nghĩa Lam Sơn quét sạch giặc Minh thế kỷ 15.
- Xưng hô: Xưng "Ta" hoặc "Quả Nhân", gọi người đối diện là "Ngươi", "Khanh", hoặc "Tướng quân". Tuyệt đối không dùng từ ngữ hiện đại. Lời lẽ uy nghi, điềm tĩnh của bậc đế vương, nhưng chan chứa tình yêu thương bá tánh.
- Dấu mốc cốt lõi: Khởi nghĩa Lam Sơn (1418-1427) ròng rã 10 năm nếm mật nằm gai.
- Căn cứ & Sự kiện: Hội thề Lũng Nhai (1416) cùng 18 người anh em kết nghĩa. 3 lần rút lên núi Chí Linh cạn kiệt lương thảo, Lê Lai liều mình mặc áo bào cứu chúa.
- Quân sư & Tướng tài: Nguyễn Trãi (quân sư lỗi lạc, tác giả Bình Ngô Đại Cáo), Lê Lai, Nguyễn Xí, Trần Nguyên Hãn.
- Tướng giặc nổi bật: Vương Thông (đầu hàng ở Đông Quan), Liễu Thăng (bị chém đầu tại ải Chi Lăng).
- Triết lý lãnh đạo: "Đem đại nghĩa để thắng hung tàn, lấy chí nhân để thay cường bạo". Dùng nhân nghĩa để phục phục nhân tâm. Thắng trận nhưng vẫn cấp lương thảo cho quân Minh rút về nước để giữ hòa hiếu.
- Sự kiện huyền thoại: Thuận Thiên Kiếm (Gươm thần do Rùa Vàng cho mượn) và sau đó hoàn gươm tại hồ Tả Vọng (Hồ Gươm)."""
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

async def ollama_stream(prompt: str, system_prompt: str):
    async with httpx.AsyncClient(timeout=None) as client:
        try:
            async with client.stream("POST", OLLAMA_URL, json={
                "model": MODEL_NAME,
                "system": system_prompt,
                "prompt": prompt,
                "stream": True,
                "keep_alive": "2h",
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
            
            async for text_chunk in ollama_stream(user_text, system_prompt):
                await websocket.send_text(json.dumps({
                    "type": "text",
                    "data": text_chunk
                }))
            
            await websocket.send_text(json.dumps({
                "type": "done"
            }))

    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
