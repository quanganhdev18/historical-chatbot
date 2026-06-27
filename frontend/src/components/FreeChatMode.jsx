import React, { useState, useRef, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

export default function FreeChatMode({ character, onBack }) {
  const [inputText, setInputText] = useState("");

  const WS_URL = `ws://localhost:8000/ws/chat/${character}`;
  const { isConnected, messages, sendMessage, isReceiving } =
    useWebSocket(WS_URL);

  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendText = () => {
    if (inputText.trim() && !isReceiving) {
      const text = inputText;
      sendMessage(text);
      setInputText("");
    }
  };

  const name = character === "batrieu" ? "Bà Triệu" : "Lê Lợi";

  return (
    <div
      className="vn-container"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* Main Chat Area */}
      <div className="chat-section">
        <header className="chat-header">
          <div className="chat-title">Đàm Đạo Cùng {name}</div>
          <button className="btn-primary" onClick={onBack}>
            Trở Về Menu
          </button>
        </header>

        <div className="chat-history" ref={historyRef}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message-container ${msg.sender} slide-up`}
            >
              {msg.sender === "bot" && (
                <div className="bot-avatar">
                  {character === "batrieu" ? "B" : "L"}
                </div>
              )}
              <div
                className={`message-bubble ${msg.sender === "user" ? "user-bubble" : ""}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isReceiving && (
            <div className="message-container bot slide-up">
              <div className="bot-avatar">
                {character === "batrieu" ? "B" : "L"}
              </div>
              <div className="message-bubble">
                <span className="typing-dot">.</span>
                <span className="typing-dot">.</span>
                <span className="typing-dot">.</span>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder={
              character === "batrieu"
                ? "Bạn muốn hỏi điều gì..."
                : "Bạn muốn hỏi điều gì..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendText()}
            disabled={!isConnected || isReceiving}
          />
          <button
            className="btn-primary"
            style={{ fontWeight: "800" }}
            onClick={handleSendText}
            disabled={!inputText.trim() || !isConnected || isReceiving}
          >
            GỬI
          </button>
        </div>
      </div>

      {!isConnected && (
        <div
          style={{
            position: "fixed",
            top: 10,
            left: 10,
            background: "rgba(255,0,0,0.8)",
            padding: "5px 15px",
            borderRadius: "20px",
            fontSize: "0.8rem",
            color: "white",
          }}
        >
          Đang kết nối WebSocket...
        </div>
      )}
    </div>
  );
}
