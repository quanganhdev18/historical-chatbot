import React, { useState, useRef, useEffect } from 'react';
import { Send, History } from 'lucide-react';
import { useWebSocket } from './hooks/useWebSocket';
import { useAudioStream } from './hooks/useAudioStream';

const WS_URL = 'ws://localhost:8000/ws/chat';

function App() {
  const [inputText, setInputText] = useState("");
  
  const { playAudioChunk, initAudio, volume } = useAudioStream();
  const { isConnected, messages, sendMessage, isReceiving } = useWebSocket(WS_URL, playAudioChunk);
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const BAD_WORDS = ['địt', 'đụ', 'cặc', 'lồn', 'buồi', 'đm', 'vcl', 'vãi lồn', 'chó', 'ngu', 'đéo', 'đĩ', 'phò', 'dcm'];

  const handleSendText = () => {
    const text = inputText.trim();
    if (text && !isReceiving) {
      const lowerText = text.toLowerCase();
      const isProfane = BAD_WORDS.some(word => lowerText.includes(word));
      if (isProfane) {
        alert("Ngôn từ của bạn không phù hợp để giao tiếp với các vị tiền nhân lịch sử. Vui lòng hỏi đàng hoàng!");
        return;
      }
      initAudio();
      sendMessage(text);
      setInputText("");
    }
  };

  return (
    <div className="app-container">
      {/* Main Chat Area */}
      <main className="chat-section">
        <header className="chat-header">
          <div className="chat-title">Bà Triệu (Triệu Thị Trinh)</div>
          <div className="status">
            <span className={`status-dot ${isConnected ? 'connected' : ''}`}></span>
            {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
          </div>
        </header>

        <div className="chat-history">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 'auto', marginBottom: 'auto' }}>
              <p>Hãy nhập câu hỏi vào khung chat bên dưới để trò chuyện.</p>
            </div>
          )}
          {messages.map((msg, idx) => {
            const isLatestBotMsg = msg.sender === 'bot' && 
              (idx === messages.length - 1 || (idx === messages.length - 2 && messages[messages.length-1].sender === 'user'));
            
            return (
              <div key={msg.id} className={`message-container ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div 
                    className="avatar-visualizer" 
                    style={{
                      transform: isLatestBotMsg ? `scale(${1 + (volume / 200)})` : 'scale(1)',
                      boxShadow: isLatestBotMsg ? `0 0 ${volume / 2}px var(--accent-primary)` : 'none',
                      opacity: (isLatestBotMsg && volume > 0) ? 1 : 0.6
                    }}
                  >
                    <div className="avatar-inner"></div>
                  </div>
                )}
                <div className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        <div className="input-area" style={{ flexDirection: 'column', gap: '15px' }}>
          {/* Text Input Fallback / Display */}
          <div style={{ display: 'flex', width: '100%', maxWidth: '600px', gap: '10px' }}>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu hỏi tại đây..."
              style={{
                flex: 1, padding: '12px 20px', borderRadius: 'var(--radius-full)', 
                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)',
                color: 'white', outline: 'none'
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            />
            <button 
              onClick={handleSendText}
              disabled={isReceiving || !inputText.trim()}
              style={{
                padding: '0 20px', borderRadius: 'var(--radius-full)',
                backgroundColor: (isReceiving || !inputText.trim()) ? 'var(--border-color)' : 'var(--accent-primary)',
                color: 'white', border: 'none', cursor: (isReceiving || !inputText.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Objective History Fact Panel */}
      <aside className="side-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <History size={24} color="var(--accent-primary)" />
          <h2 className="panel-title">Sự kiện lịch sử</h2>
        </div>
        
        <div className="fact-card">
          <h3>Khởi nghĩa Bà Triệu (248)</h3>
          <p>Bà Triệu cùng anh trai Triệu Quốc Đạt lãnh đạo nhân dân dấy binh khởi nghĩa chống lại ách đô hộ của nhà Ngô, với căn cứ chính ở vùng Cửu Chân (Thanh Hóa ngày nay).</p>
        </div>

        <div className="fact-card">
          <h3>Lời thề bất hủ</h3>
          <p>"Tôi chỉ muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông, lấy lại giang sơn, dựng nền độc lập, cởi ách nô lệ, chứ không chịu khom lưng làm tì thiếp cho người."</p>
        </div>
      </aside>
    </div>
  );
}

export default App;
