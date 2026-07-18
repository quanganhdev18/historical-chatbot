import React, { useState, useRef, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import ParticleAvatar from "./ParticleAvatar";

export default function FreeChatMode({ character, onBack }) {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const startTextRef = useRef("");
  const textRef = useRef(""); // Track text for auto-restart
  const intendedActiveRef = useRef(false); // Track user's toggle state
  const silenceTimeoutRef = useRef(null); // Track silence to auto send

  useEffect(() => {
    textRef.current = inputText;
  }, [inputText]);

  const WS_URL = `ws://localhost:8000/ws/chat/${character}`;
  const { isConnected, messages, sendMessage, isReceiving } =
    useWebSocket(WS_URL);

  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Khởi tạo Speech Recognition ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = true; // Bật chế độ liên tục, không tự động ngắt khi có khoảng lặng
      recognition.interimResults = true; // Trả về kết quả tạm thời để hiển thị realtime

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        // Chống dội (bounce) sự kiện sau khi đã bấm Gửi hoặc đã chủ động tắt Mic
        if (!intendedActiveRef.current) return;

        let currentTranscript = '';
        // Duyệt toàn bộ các kết quả từ 0 để lấy câu hoàn chỉnh nhất trong phiên thu âm này
        for (let i = 0; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        // Nối chuỗi nhận diện được vào text đã có trước đó
        const newText = startTextRef.current + (startTextRef.current && currentTranscript ? " " : "") + currentTranscript;
        setInputText(newText);

        // Reset timer đếm khoảng lặng
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        
        // Cài đặt đếm ngược 2.5 giây. Nếu không có kết quả mới (ngưng nói), sẽ tự động gửi.
        silenceTimeoutRef.current = setTimeout(() => {
          if (textRef.current && textRef.current.trim() !== '') {
            // Tắt mic
            intendedActiveRef.current = false;
            setIsListening(false);
            if (recognitionRef.current) recognitionRef.current.stop();
            
            // Gửi tin nhắn
            if (!isReceiving) {
              sendMessage(textRef.current);
              startTextRef.current = ""; // Reset buffer an toàn
              setInputText('');
            }
          }
        }, 2500);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'network') {
          alert("Lỗi Mạng (Network): Trình duyệt của bạn không kết nối được với máy chủ nhận diện giọng nói. Điều này thường xảy ra nếu bạn bị mất mạng, hoặc trình duyệt bạn đang dùng (như Brave, Firefox, Opera) không có quyền truy cập vào Google Speech API. Vui lòng mở trang web này bằng Google Chrome hoặc Microsoft Edge!");
          intendedActiveRef.current = false;
          setIsListening(false);
        } else if (event.error === 'not-allowed' || event.error === 'audio-capture') {
          intendedActiveRef.current = false;
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // Nếu user chưa chủ động tắt, hệ thống sẽ tự động bật lại mic
        if (intendedActiveRef.current) {
          startTextRef.current = textRef.current; // Cập nhật text mới nhất để nối tiếp
          setTimeout(() => {
            if (intendedActiveRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {}
            }
          }, 100); // Thêm delay 100ms để tránh vòng lặp vô tận gây lag nếu mic bị lỗi
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Trình duyệt không hỗ trợ Web Speech API.");
    }
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Google Chrome.");
      return;
    }

    if (intendedActiveRef.current) {
      intendedActiveRef.current = false;
      setIsListening(false);
      recognitionRef.current.stop();
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    } else {
      intendedActiveRef.current = true;
      startTextRef.current = inputText; // Lưu lại text đang gõ dở
      
      // Ép trình duyệt cấp quyền Microphone một cách tường minh trước khi bật WebSpeechAPI
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          // Tắt stream này đi vì WebSpeechAPI sẽ tự mở stream riêng
          stream.getTracks().forEach(track => track.stop());
          
          if (intendedActiveRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error("Không thể bắt đầu thu âm:", e);
            }
          }
        })
        .catch(err => {
          alert("Lỗi Micro: Vui lòng cho phép trình duyệt sử dụng Micro của bạn. Chi tiết: " + err.message);
          intendedActiveRef.current = false;
          setIsListening(false);
        });
    }
  };

  const handleSendText = () => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    
    if (inputText.trim() && !isReceiving) {
      const text = inputText;
      
      // Chủ động tắt mic nếu đang bật
      if (intendedActiveRef.current) {
        intendedActiveRef.current = false;
        setIsListening(false);
        if (recognitionRef.current) recognitionRef.current.stop();
      }

      sendMessage(text);
      startTextRef.current = ""; // Reset buffer an toàn
      setInputText("");
    }
  };

  const name = character === "batrieu" ? "Bà Triệu" : "Lê Lợi";

  const [inventory, setInventory] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  const [unlockedItem, setUnlockedItem] = useState(null);

  const ITEMS = {
    batrieu: [
      { id: 'bt_voi', name: 'Bạch Tượng', desc: 'Voi trắng một ngà huyền thoại.', keywords: ['voi', 'bạch tượng'] },
      { id: 'bt_bodien', name: 'Sa Bàn Bồ Điền', desc: 'Bản đồ phòng tuyến Bồ Điền.', keywords: ['bồ điền', 'hào lũy'] },
      { id: 'bt_lucdan', name: 'Tàn Thư Lục Dận', desc: 'Thư dụ hàng của tướng Đông Ngô.', keywords: ['lục dận'] },
    ],
    leloi: [
      { id: 'll_guom', name: 'Gươm Thuận Thiên', desc: 'Gươm thần do Rùa Vàng cho mượn.', keywords: ['thuận thiên', 'gươm', 'rùa'] },
      { id: 'll_aobao', name: 'Áo Bào Lê Lai', desc: 'Áo bào Lê Lai mặc để cứu chúa.', keywords: ['lê lai', 'áo bào'] },
      { id: 'll_lungnhai', name: 'Lời Thề Lũng Nhai', desc: 'Huyết thư kết nghĩa 19 anh em.', keywords: ['lũng nhai', 'kết nghĩa'] },
    ]
  };

  useEffect(() => {
    const saved = localStorage.getItem(`inventory_${character}`);
    if (saved) setInventory(JSON.parse(saved));
  }, [character]);

  useEffect(() => {
    if (messages.length > 0 && !isReceiving) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'bot') {
        const textToSearch = lastMsg.text.toLowerCase() + " " + (messages[messages.length - 2]?.text.toLowerCase() || "");
        const availableItems = ITEMS[character];
        let newlyUnlocked = null;
        let newInv = [...inventory];
        
        availableItems.forEach(item => {
          if (!newInv.includes(item.id)) {
            const hasKeyword = item.keywords.some(kw => textToSearch.includes(kw));
            if (hasKeyword) {
              newInv.push(item.id);
              newlyUnlocked = item;
            }
          }
        });
        
        if (newlyUnlocked) {
          setInventory(newInv);
          localStorage.setItem(`inventory_${character}`, JSON.stringify(newInv));
          setUnlockedItem(newlyUnlocked);
          setTimeout(() => setUnlockedItem(null), 5000);
        }
      }
    }
  }, [messages, isReceiving, character, inventory]);

  return (
    <div
      className="vn-container"
      style={{ display: "flex", flexDirection: "column", position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      {/* Toast Notification */}
      {unlockedItem && (
        <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, #d97706, #92400e)', color: 'white', padding: '15px 30px', borderRadius: '30px', zIndex: 1000, boxShadow: '0 10px 20px rgba(0,0,0,0.5)', animation: 'slideUpFade 0.5s ease', border: '2px solid #fde68a' }}>
          <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif" }}>✨ Đã thu thập: {unlockedItem.name}</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{unlockedItem.desc}</p>
        </div>
      )}

      {/* Inventory Modal */}
      {showInventory && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'rgba(30,0,0,0.9)', border: '2px solid #facc15', borderRadius: '20px', padding: '40px', width: '80%', maxWidth: '800px', color: 'white', position: 'relative' }}>
            <button onClick={() => setShowInventory(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", textAlign: 'center', marginBottom: '30px', color: '#fef08a' }}>Hành Trang Hiện Vật</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {ITEMS[character].map(item => {
                const isUnlocked = inventory.includes(item.id);
                return (
                  <div key={item.id} style={{ background: isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)', border: `1px solid ${isUnlocked ? '#facc15' : '#333'}`, padding: '20px', borderRadius: '10px', textAlign: 'center', filter: isUnlocked ? 'none' : 'grayscale(100%)', opacity: isUnlocked ? 1 : 0.5 }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{isUnlocked ? '🏺' : '❓'}</div>
                    <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", color: isUnlocked ? '#fef08a' : '#777' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.85rem', marginTop: '10px' }}>{isUnlocked ? item.desc : 'Chưa thu thập'}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="chat-section">
        <header className="chat-header">
          <div className="chat-title">Đàm Đạo Cùng {name}</div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button className="btn-primary" onClick={() => setShowInventory(true)}>
              🎒 Hành Trang ({inventory.length}/{ITEMS[character].length})
            </button>
            <span className="wave-hint" style={{ animation: 'none', opacity: 0.8, color: '#facc15', margin: 0 }}>🤏 Chụm nhả ngón tay</span>
            <button className="btn-primary" onClick={onBack}>
              Trở Về
            </button>
          </div>
        </header>

        {/* Mini Timeline */}
        <div style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', display: 'flex', gap: '15px', overflowX: 'auto', whiteSpace: 'nowrap', alignItems: 'center' }}>
          <span style={{ color: '#facc15', fontFamily: "'Playfair Display', serif", fontWeight: 'bold', fontSize: '0.9rem', marginRight: '10px' }}>Dòng Thời Gian:</span>
          {(character === 'batrieu' 
            ? [ { year: '226', event: 'Sinh ra tại Quan Yên' }, { year: '248', event: 'Khởi nghĩa ngàn Nưa' }, { year: '248', event: 'Trận chiến Bồ Điền' }, { year: 'Cuối 248', event: 'Tuẫn tiết tại núi Tùng' } ]
            : [ { year: '1416', event: 'Hội thề Lũng Nhai' }, { year: '1418', event: 'Khởi nghĩa Lam Sơn' }, { year: '1427', event: 'Hội thề Đông Quan' }, { year: '1428', event: 'Lên ngôi Hoàng Đế' } ]
          ).map((item, idx) => (
            <button 
              key={idx}
              className="btn-primary"
              style={{ padding: '5px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '15px' }}
              onClick={() => sendMessage(`Hãy kể về sự kiện: ${item.year} - ${item.event}`)}
              disabled={!isConnected || isReceiving}
            >
              <strong style={{ color: '#fef08a' }}>{item.year}</strong>: {item.event}
            </button>
          ))}
        </div>

        <div className="chat-history" ref={historyRef}>
          {messages.length === 0 && (
            <div className="suggested-prompts slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: 'auto', marginBottom: '20px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginBottom: '10px' }}>Gợi ý câu hỏi:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {(character === "batrieu" 
                  ? ["Trận Bồ Điền diễn ra như thế nào?", "Vì sao ngài khởi nghĩa?", "Lục Dận là kẻ nào?"]
                  : ["Hội thề Lũng Nhai diễn ra thế nào?", "Sự tích Gươm Thần Thuận Thiên?", "Lê Lai liều mình cứu chúa ra sao?"]
                ).map((promptText, i) => (
                  <button 
                    key={i} 
                    className="btn-primary" 
                    style={{ fontSize: '0.9rem', padding: '8px 16px', background: 'transparent' }}
                    onClick={() => sendMessage(promptText)}
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message-container ${msg.sender} slide-up`}
            >
              {msg.sender === "bot" && (
                <ParticleAvatar character={character} />
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
              <ParticleAvatar character={character} />
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
              isListening ? "Đang nghe... (Hãy nói gì đó)" : "Bạn muốn hỏi điều gì..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendText()}
            disabled={!isConnected || isReceiving}
          />
          <button
            className={`btn-primary ${isListening ? 'listening-pulse' : ''}`}
            style={{ 
              fontWeight: "800", 
              fontSize: '1.2rem', 
              padding: '10px 20px',
              background: isListening ? 'rgba(239, 68, 68, 0.8)' : '', // Đỏ khi đang thu âm
              borderColor: isListening ? '#fca5a5' : ''
            }}
            onClick={toggleListen}
            disabled={!isConnected || isReceiving}
            title="Thu âm bằng giọng nói"
          >
            🎤
          </button>
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
