import React, { useState, useRef, useEffect } from 'react';
import { Send, History, Map as MapIcon } from 'lucide-react';
import { useWebSocket } from './hooks/useWebSocket';
import { useAudioStream } from './hooks/useAudioStream';
import MapPanel from './components/MapPanel';

const WS_URL = 'ws://localhost:8000/ws/chat';

const HARDCODED_QUESTIONS = [
  "Xin Bà cho biết tại sao lại chọn Núi Nưa làm căn cứ khởi nghĩa đầu tiên?",
  "Trong trận chiến ở Bồ Điền, quân Đông Ngô đông gấp bội, Bà đã dùng chiến thuật gì?",
  "Lục Dận là tên tướng gian xảo, hắn đã dùng thủ đoạn gì để chống lại nghĩa quân?",
  "Cảm xúc của Bà ra sao khi buộc phải lui quân về Núi Tùng?",
  "Câu nói 'Tôi chỉ muốn cưỡi cơn gió mạnh...' được Bà thốt lên trong hoàn cảnh nào?"
];

function App() {
  const [inputText, setInputText] = useState("");
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState([]);
  
  const { playAudioChunk, initAudio, volume } = useAudioStream();
  const { isConnected, messages, sendMessage, isReceiving } = useWebSocket(WS_URL, playAudioChunk);
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const BAD_WORDS = ['địt', 'đụ', 'cặc', 'lồn', 'buồi', 'đm', 'vcl', 'vãi lồn', 'chó', 'ngu', 'đéo', 'đĩ', 'phò', 'dcm'];

  const rollRandomQuestions = React.useCallback(() => {
    const shuffled = [...HARDCODED_QUESTIONS].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, 2));
  }, []);

  // Initial roll
  useEffect(() => {
    rollRandomQuestions();
  }, [rollRandomQuestions]);

  const handleNewUserMessage = () => {
    setUserMsgCount(prev => {
      const newCount = prev + 1;
      if (newCount % 5 === 0) {
        rollRandomQuestions();
      } else {
        setActiveQuestions([]); // hide questions after user asks something else
      }
      return newCount;
    });
  };

  const handleQuickReply = (reply) => {
    if (isReceiving) return;
    initAudio();
    sendMessage(reply);
    setActiveQuestions([]);
    handleNewUserMessage();
  };

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
      handleNewUserMessage();
    }
  };

  const handleLocationClick = (loc) => {
    if (isReceiving || visitedLocations.includes(loc.id)) return;
    initAudio();
    setVisitedLocations(prev => [...prev, loc.id]);
    const promptText = `[HỆ THỐNG]: Người chơi vừa đặt chân đến ${loc.name}. Bà hãy kể một kỷ niệm hoặc một sự kiện lịch sử ngắn gọn gắn liền với địa danh này.`;
    sendMessage(promptText);
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
            if (msg.sender === 'user' && msg.text.startsWith('[HỆ THỐNG]')) {
              return null;
            }

            const isLatestBotMsg = msg.sender === 'bot' && 
              (idx === messages.length - 1 || (idx === messages.length - 2 && messages[messages.length-1].sender === 'user' && messages[messages.length-1].text.startsWith('[HỆ THỐNG]')));

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
                <div className="message-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '100%' }}>
                  <div className={`message ${msg.sender}`}>
                    {msg.text}
                  </div>
                  {isLatestBotMsg && activeQuestions.length > 0 && (
                    <div className="quick-replies" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {activeQuestions.map((q, i) => (
                        <button 
                          key={i} 
                          className="quick-reply-btn"
                          disabled={isReceiving}
                          style={{ opacity: isReceiving ? 0.5 : 1, cursor: isReceiving ? 'not-allowed' : 'pointer' }}
                          onClick={() => handleQuickReply(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
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
      <aside className="side-panel" style={{ padding: '20px', width: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <MapIcon size={24} color="var(--accent-primary)" />
          <h2 className="panel-title" style={{ marginBottom: 0 }}>Bản Đồ Cửu Chân</h2>
        </div>
        <MapPanel onLocationClick={handleLocationClick} isReceiving={isReceiving} visitedLocations={visitedLocations} />
      </aside>
    </div>
  );
}

export default App;
