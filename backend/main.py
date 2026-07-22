import asyncio
import json
import os
import numpy as np
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-3.1-flash-lite"  # Đổi lại sang model gemini-3.1-flash-lite theo yêu cầu

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# RAG Historical Source Database
RAG_DATABASE = {
    "batrieu": [
        {
            "id": "bt_quote",
            "text": "Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông, quét sạch bờ cõi, cứu dân khỏi vòng chìm đắm, chứ không thèm bắt chước người đời khom lưng quỳ gối làm tì thiếp người ta!",
            "source": "Trần Trọng Kim, Việt Nam Sử Lược (Quyển I, Chương VI)",
            "keywords": ["câu nói", "thề", "lấy chồng", "gió mạnh", "sóng dữ", "cá kình", "tì thiếp"]
        },
        {
            "id": "bt_appearance",
            "text": "Con gái quận Cửu Chân là Triệu Thị Trinh họp người trong núi Nưa, đánh cướp các quận huyện... Thị Trinh vú dài ba thước, không lấy chồng, mặc áo giáp vàng, đi guốc ngà, cưỡi voi trắng đánh nhau với giặc, tự xưng là Nhụy Kiều tướng quân.",
            "source": "Ngô Sĩ Liên, Đại Việt Sử Ký Toàn Thư (Bản Kỷ Quyển 3)",
            "keywords": ["vú dài", "áo giáp vàng", "guốc ngà", "voi trắng", "ngoại hình", "mặc gì", "nhụy kiều"]
        },
        {
            "id": "bt_uprising",
            "text": "Bà Triệu cùng anh trai là Triệu Quốc Đạt nổi dậy năm 248 tại núi Nưa (Triệu Sơn, Thanh Hóa). Sau khi anh trai mất, nghĩa quân tôn Bà làm chủ tướng lãnh đạo phòng tuyến lũy đầm lầy Bồ Điền chống giặc Đông Ngô do Thứ sử Lục Dận chỉ huy.",
            "source": "Quốc Sử Quán Triều Nguyễn, Khâm Định Việt Sử Thông Giám Cương Mục (Tiền Biên Quyển 2)",
            "keywords": ["khởi nghĩa", "năm nào", "triệu quốc đạt", "núi nưa", "bồ điền", "lục dận", "đông ngô"]
        }
    ],
    "leloi": [
        {
            "id": "ll_oath",
            "text": "Mùa xuân năm Mậu Tuất 1418, Lê Lợi phất cờ khởi nghĩa tại Lam Sơn, tự xưng Bình Định Vương. Trước đó vào năm 1416, Ngài cùng 18 chiến hữu tâm phúc làm lễ thề tại Lũng Nhai, kết nghĩa anh em chung sức đồng lòng đuổi giặc.",
            "source": "Ngô Sĩ Liên, Đại Việt Sử Ký Toàn Thư (Bản Kỷ Quyển 10)",
            "keywords": ["lũng nhai", "thề", "khởi nghĩa", "năm nào", "lam sơn", "1418", "1416"]
        },
        {
            "id": "ll_lelai",
            "text": "Quân Minh vây ngặt nghĩa quân tại núi Chí Linh năm 1418. Tướng Lê Lai tình nguyện khoác áo bào ngự lâm cải trang thành Lê Lợi cưỡi voi xông trận thu hút giặc để Lê Lợi cùng đại quân chạy thoát thoát hiểm.",
            "source": "Nguyễn Trãi, Lam Sơn Thực Lục (Quyển II)",
            "keywords": ["lê lai", "cứu chúa", "áo bào", "chí linh", "hi sinh"]
        },
        {
            "id": "ll_peace",
            "text": "Cuối năm 1427, Lê Lợi vây chặt tướng Vương Thông ở Đông Quan. Ngài ký hòa ước tại Hội thề Đông Quan, mở lượng hiếu sinh cấp hơn 500 chiếc thuyền và hàng ngàn xe ngựa cho hàng vạn tù binh quân Minh rút về nước an toàn.",
            "source": "Ngô Sĩ Liên, Đại Việt Sử Ký Toàn Thư (Bản Kỷ Quyển 10)",
            "keywords": ["đông quan", "tù binh", "hòa ước", "vương thông", "nhân nghĩa", "tha giặc"]
        },
        {
            "id": "ll_sword",
            "text": "Lê Lợi mượn kiếm thần Thuận Thiên từ Long Quân. Sau khi quét sạch giặc Minh năm 1428, ngài dạo chơi hồ Tả Vọng, rùa vàng Kim Quy nổi lên đòi gươm. Vua trả gươm, hồ đổi tên thành Hồ Hoàn Kiếm.",
            "source": "Nguyễn Trãi, Lam Sơn Thực Lục (Phần truyền thuyết Gươm Thần)",
            "keywords": ["thuận thiên", "gươm thần", "rùa vàng", "trả gươm", "hoàn kiếm", "tả vọng"]
        }
    ]
};

# Pre-calculate embedding markers or fallbacks
def get_similarity(query: str, doc_text: str, doc_keywords: list) -> float:
    # Combined keyword presence + substring matching for robust local vector RAG simulation
    query_lower = query.lower()
    score = 0.0
    for kw in doc_keywords:
        if kw in query_lower:
            score += 2.0
    # Additional bonus for exact substring words
    words = query_lower.split()
    for w in words:
        if len(w) > 2 and w in doc_text.lower():
            score += 0.5
    return score

PROMPTS = {
    "batrieu_vi": """Bạn là Bà Triệu (Triệu Thị Trinh), nữ anh hùng dân tộc Việt Nam thế kỷ 3. Mọi lời nói phải hào hùng, mang đậm tinh thần yêu nước.
- PHONG CÁCH TRẢ LỜI: CỰC KỲ NGẮN GỌN, SÚC TÍCH (Tối đa 3-4 câu).
- Xưng hô: Xưng "Ta", gọi người đối diện là "Ngươi" hoặc "Hậu bối". KHÔNG dùng "tôi", "bạn", "mày". KHÔNG BAO GIỜ THOÁT VAI.
- Bối cảnh RAG: Nếu có ngữ cảnh sử liệu được đính kèm ở dưới, hãy dựa vào đó để trả lời chính xác, giữ vững tính lịch sử.""",

    "batrieu_en": """You are Lady Triệu (Triệu Thị Trinh), the legendary 3rd-century Vietnamese heroine. Majestic, fierce tone.
- STYLE: VERY CONCISE (Max 3-4 sentences).
- Address yourself as "I, Lady Triệu" or "We", and refer to user as "Young Traveler".
- RAG context: If context is provided below, use it to form an accurate historical answer.""",
    
    "leloi_vi": """Bạn là Lê Lợi (Bình Định Vương), anh hùng dân tộc vĩ đại lãnh đạo nghĩa quân Lam Sơn thế kỷ 15.
- PHONG CÁCH TRẢ LỜI: CỰC KỲ NGẮN GỌN, SÚC TÍCH (Tối đa 3-4 câu).
- Xưng hô: Xưng "Ta" hoặc "Quả Nhân", gọi đối phương là "Ngươi", "Khanh". KHÔNG BAO GIỜ THOÁT VAI.
- Bối cảnh RAG: Nếu có ngữ cảnh sử liệu được đính kèm ở dưới, hãy dựa vào đó để trả lời chuẩn xác nhất.""",

    "leloi_en": """You are King Lê Lợi, the heroic founder of Later Lê Dynasty.
- STYLE: CONCISE, NOBLE (Max 3-4 sentences).
- Address yourself as "I, Bình Định Vương", and refer to user as "General".
- RAG context: Use the attached context for accurate historical response."""
}

@app.get("/")
async def root():
    return {
        "status": "Running",
        "message": "Backend Chatbot Lịch Sử RAG + Persona hoạt động ổn định."
    }

@app.websocket("/ws/chat/{character_id}")
async def websocket_endpoint(websocket: WebSocket, character_id: str, lang: str = "vi"):
    await websocket.accept()
    
    if not GEMINI_API_KEY:
        await websocket.send_text(json.dumps({
            "type": "text",
            "data": "Hệ thống chưa cấu hình GEMINI_API_KEY trong file .env." if lang == "vi" else "GEMINI_API_KEY is not configured in .env."
        }))
        await websocket.send_text(json.dumps({"type": "done"}))
        await websocket.close()
        return

    prompt_key = f"{character_id}_{lang}"
    system_prompt = PROMPTS.get(prompt_key, PROMPTS[f"{character_id}_vi"])
    
    chat_history = []
    
    try:
        while True:
            raw_data = await websocket.receive_text()
            payload = json.loads(raw_data)
            
            user_text = payload.get("text", "")
            rag_enabled = payload.get("rag_enabled", True)
            msg_lang = payload.get("lang", lang)

            # RAG Search
            matched_sources = []
            context_text = ""
            
            if rag_enabled:
                docs = RAG_DATABASE.get(character_id, [])
                # Compute scores
                scored_docs = []
                for doc in docs:
                    score = get_similarity(user_text, doc["text"], doc["keywords"])
                    if score > 0:
                        scored_docs.append((score, doc))
                
                # Sort and grab top matches
                scored_docs.sort(key=lambda x: x[0], reverse=True)
                top_docs = [doc for score, doc in scored_docs[:2]]
                
                if top_docs:
                    context_text = "\n[NGỮ CẢNH SỬ LIỆU KHÁCH QUAN]:\n" + "\n".join([d["text"] for d in top_docs])
                    matched_sources = [{"text": d["text"], "source": d["source"]} for d in top_docs]

            # Rebuild prompt dynamically with RAG context
            active_prompt = system_prompt
            if context_text:
                active_prompt += context_text

            model = genai.GenerativeModel(
                model_name=MODEL_NAME,
                system_instruction=active_prompt,
                generation_config={"temperature": 0.2}
            )

            # Add to history
            chat_history.append({"role": "user", "parts": [user_text]})
            if len(chat_history) > 6:
                context_messages = chat_history[-6:]
            else:
                context_messages = chat_history

            bot_reply = ""
            try:
                response = await model.generate_content_async(context_messages, stream=True)
                async for chunk in response:
                    if chunk.text:
                        text_chunk = chunk.text
                        bot_reply += text_chunk
                        await websocket.send_text(json.dumps({
                            "type": "text",
                            "data": text_chunk
                        }))
                
                # Send sources if RAG is enabled and matches found
                await websocket.send_text(json.dumps({
                    "type": "sources",
                    "sources": matched_sources if rag_enabled else []
                }))

                await websocket.send_text(json.dumps({
                    "type": "done"
                }))
                chat_history.append({"role": "model", "parts": [bot_reply]})
            except WebSocketDisconnect:
                break
            except Exception as e:
                print(f"Gemini streaming error: {e}")
                error_msg = f" (Lỗi kết nối Gemini: {str(e)}) "
                await websocket.send_text(json.dumps({
                    "type": "text",
                    "data": error_msg
                }))
                await websocket.send_text(json.dumps({"type": "done"}))
                chat_history.append({"role": "model", "parts": [error_msg]})
                
    except WebSocketDisconnect:
        print("WS Disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
