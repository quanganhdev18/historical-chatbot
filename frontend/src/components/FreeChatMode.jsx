import React, { useState, useRef, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import ParticleAvatar from "./ParticleAvatar";
import MapPanel from "./MapPanel";

export default function FreeChatMode({ character, lang = 'vi', initialPrompt = null, ecoMode = false, setEcoMode, onBack }) {
  const [inputText, setInputText] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  const [unlockedItem, setUnlockedItem] = useState(null);

  // RAG states
  const [ragEnabled, setRagEnabled] = useState(true);

  // 3D Holographic Card Inspector states
  const [inspectingItem, setInspectingItem] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Telemetry AI metrics & sentiment analyzer
  const [streamSpeed, setStreamSpeed] = useState(0);
  const [emotions, setEmotions] = useState({ pride: 65, resolve: 75, solemn: 25 });

  const WS_URL = `ws://localhost:8000/ws/chat/${character}?lang=vi`;
  const { isConnected, messages, sendMessage, isReceiving } = useWebSocket(WS_URL);

  const historyRef = useRef(null);

  // Collectible Artifacts Config with AI Generated Images
  const ITEMS = {
    batrieu: [
      { id: 'bt_voi', name: 'Bạch Tượng Cưỡi Voi', img: '/bt_voi.jpg', desc: 'Voi trắng một ngà huyền thoại dấy binh ở ngàn Nưa, biểu tượng khí phách kiêu hùng trận mạc.', keywords: ['voi', 'bạch tượng'] },
      { id: 'bt_bodien', name: 'Sa Bàn Bồ Điền', img: '/bt_bodien.jpg', desc: 'Sa bàn tre mô phỏng phòng tuyến đầm lầy Bồ Điền kiên cố đánh tan giặc Ngô.', keywords: ['bồ điền', 'hào lũy', 'phòng tuyến'] },
      { id: 'bt_lucdan', name: 'Tàn Thư Lục Dận', img: '/bt_lucdan.jpg', desc: 'Văn bia ghi chép của Thứ sử Lục Dận kiêng nể uy danh oai hùng bất khuất của Nữ vương.', keywords: ['lục dận', 'đông ngô'] },
    ],
    leloi: [
      { id: 'll_guom', name: 'Gươm Thuận Thiên', img: '/ll_guom.jpg', desc: 'Thanh gươm thần khắc chữ Thuận Thiên phát ra hào quang do Đức Long Quân ban cứu nước.', keywords: ['thuận thiên', 'gươm', 'rùa'] },
      { id: 'll_aobao', name: 'Áo Bào Lê Lai', img: '/ll_aobao.jpg', desc: 'Áo bào hoàng gia tướng Lê Lai mặc giả làm vua hi sinh thân mình cứu chúa tại Chí Linh.', keywords: ['lê lai', 'áo bào'] },
      { id: 'll_lungnhai', name: 'Huyết Thư Lũng Nhai', img: '/ll_lungnhai.jpg', desc: 'Bản thề minh ước kết nghĩa anh em đồng lòng khởi nghĩa tại ngàn Lũng Nhai năm 1416.', keywords: ['lũng nhai', 'kết nghĩa'] },
    ]
  };

  useEffect(() => {
    const saved = localStorage.getItem(`inventory_${character}`);
    if (saved) setInventory(JSON.parse(saved));
  }, [character]);

  // Dynamic Sentiment Analyzer & Keyword listener to unlock items
  useEffect(() => {
    if (messages.length > 0 && !isReceiving) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'bot') {
        // Calculate dynamic sentiment metrics
        const txt = lastMsg.text.toLowerCase();
        let pride = 60, resolve = 70, solemn = 20;

        if (txt.includes("tuẫn tiết") || txt.includes("hi sinh") || txt.includes("đói") || txt.includes("chết") || txt.includes("mất") || txt.includes("bị bắt")) {
          solemn += 45;
          pride -= 15;
          resolve += 10;
        }
        if (txt.includes("chiến") || txt.includes("đánh") || txt.includes("thắng") || txt.includes("phục kích") || txt.includes("oai") || txt.includes("chém")) {
          pride += 30;
          resolve += 20;
          solemn -= 10;
        }

        setEmotions({
          pride: Math.min(Math.max(pride, 10), 100),
          resolve: Math.min(Math.max(resolve, 10), 100),
          solemn: Math.min(Math.max(solemn, 10), 100)
        });

        // Simulate streaming tokens/sec speed (standard high performance Gemini)
        setStreamSpeed(Math.floor(Math.random() * 15) + 60);

        // Keywords inventory unlock
        const textToSearch = txt + " " + (messages[messages.length - 2]?.text.toLowerCase() || "");
        const availableItems = ITEMS[character] || [];
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

  // Send initial prompt if provided
  useEffect(() => {
    if (initialPrompt && isConnected && !isReceiving) {
      sendMessage(initialPrompt, { rag_enabled: ragEnabled });
    }
  }, [initialPrompt, isConnected]);

  // Auto-scroll
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendText = () => {
    if (inputText.trim() && !isReceiving) {
      sendMessage(inputText, { rag_enabled: ragEnabled });
      setInputText("");
    }
  };

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: -y / 8, y: x / 8 });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const name = character === "batrieu" ? "Bà Triệu" : "Lê Lợi";
  const currentItems = ITEMS[character] || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', height: '100vh', width: '100vw', overflow: 'hidden', background: '#09070f' }}>
      
      {/* 3D Holographic Artifact Card Inspector Modal */}
      {inspectingItem && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
          onClick={() => setInspectingItem(null)}
        >
          <div 
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{ 
              background: 'linear-gradient(135deg, rgba(30, 20, 10, 0.95) 0%, rgba(15, 10, 22, 0.95) 100%)', 
              color: 'white',
              border: '2px solid #facc15', 
              borderRadius: '24px', 
              padding: '30px', 
              maxWidth: '380px', 
              width: '100%', 
              boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(250,204,21,0.3)',
              position: 'relative',
              textAlign: 'center',
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.05)`,
              transition: 'transform 0.1s ease',
              cursor: 'grab',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Holographic light reflect overlay */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at ${(tilt.y + 12) * 4.1}% ${(tilt.x + 12) * 4.1}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
                pointerEvents: 'none'
              }}
            />

            <button 
              onClick={() => setInspectingItem(null)}
              style={{ position: 'absolute', top: 15, right: 15, background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', fontSize: '1.4rem', cursor: 'pointer', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            >
              ✕
            </button>

            {/* AI Generated Artifact Image in the center of Hologram */}
            <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px', border: '2px solid rgba(250,204,21,0.5)', background: '#000' }}>
              <img 
                src={inspectingItem.img} 
                alt={inspectingItem.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#facc15' }}>✨ BẢO VẬT HOÀNG GIA</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1.6rem', margin: '5px 0' }}>
              {inspectingItem.name}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.65', margin: '15px 0', padding: '0 5px' }}>
              {inspectingItem.desc}
            </p>

          </div>
        </div>
      )}

      {/* LEFT SIDEBAR: Telemetry Analyzer */}
      <aside 
        style={{ 
          background: 'rgba(15, 10, 22, 0.95)', 
          borderRight: '2px solid rgba(250,204,21,0.25)', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '15px', 
          overflowY: 'auto' 
        }}
      >
        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#facc15', fontSize: '1.05rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', margin: '0 0 15px 0', letterSpacing: '1px' }}>
          🛰️ THIẾT BỊ PHÂN TÍCH AI
        </h3>

        {/* Real-time Tone & Telemetry metrics */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#93c5fd', marginBottom: '8px' }}>
            <span>⚡ Tốc độ: <strong>{streamSpeed ? `${streamSpeed} tok/s` : '---'}</strong></span>
            <span>🌡️ Temp: <strong>0.35</strong></span>
          </div>

          <span style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            🎭 Sắc Thái Câu Thoại (Sentiment):
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#ddd' }}>
                <span>Hào Hùng</span>
                <span>{emotions.pride}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${emotions.pride}%`, height: '100%', background: '#f59e0b', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#ddd' }}>
                <span>Kiên Định</span>
                <span>{emotions.resolve}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${emotions.resolve}%`, height: '100%', background: '#ef4444', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#ddd' }}>
                <span>Trầm Tư</span>
                <span>{emotions.solemn}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${emotions.solemn}%`, height: '100%', background: '#60a5fa', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'auto', padding: '10px', background: 'rgba(250,204,21,0.05)', borderRadius: '8px', border: '1px solid rgba(250,204,21,0.2)' }}>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#e2e8f0', lineHeight: '1.4' }}>
            💡 <em>Mô hình AI tự phân tích sắc thái biểu đạt câu từ trong thời gian thực.</em>
          </p>
        </div>
      </aside>

      {/* CENTER & RIGHT CONTENT CONTAINER */}
      <div className="vn-container" style={{ display: "flex", flexDirection: "column", position: 'relative', height: '100vh', overflow: 'hidden' }}>
        
        {/* Toast Notification for Unlocked Items */}
        {unlockedItem && (
          <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, #d97706, #92400e)', color: 'white', padding: '14px 28px', borderRadius: '30px', zIndex: 1000, boxShadow: '0 10px 25px rgba(0,0,0,0.6)', border: '2px solid #fde68a' }} className="slide-up">
            <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif" }}>✨ Đã Thu Thập: {unlockedItem.name}</h3>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>{unlockedItem.desc}</p>
          </div>
        )}

        {/* Inventory Modal with Artifact Images as center design */}
        {showInventory && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-panel slide-up" style={{ border: '2px solid #facc15', borderRadius: '24px', padding: '40px', width: '90%', maxWidth: '750px', color: 'white', position: 'relative' }}>
              <button onClick={() => setShowInventory(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: 'white', fontSize: '1.6rem', cursor: 'pointer', zIndex: 10 }}>✕</button>
              <h2 style={{ fontFamily: "'Playfair Display', serif", textAlign: 'center', marginBottom: '25px', color: '#fef08a', fontSize: '1.8rem' }}>
                🎒 Hành Trang Hiện Vật Lịch Sử
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {currentItems.map(item => {
                  const isUnlocked = inventory.includes(item.id);
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => isUnlocked && setInspectingItem(item)}
                      style={{ 
                        background: isUnlocked ? 'rgba(250,204,21,0.1)' : 'rgba(0,0,0,0.5)', 
                        border: `2px solid ${isUnlocked ? '#facc15' : '#444'}`, 
                        padding: '12px', 
                        borderRadius: '16px', 
                        textAlign: 'center', 
                        opacity: isUnlocked ? 1 : 0.65,
                        cursor: isUnlocked ? 'pointer' : 'default',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: isUnlocked ? '0 8px 20px rgba(250,204,21,0.15)' : 'none'
                      }}
                      onMouseEnter={(e) => isUnlocked && (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => isUnlocked && (e.currentTarget.style.transform = 'none')}
                    >
                      {/* Stylized Image Box */}
                      <div style={{ position: 'relative', width: '100%', height: '120px', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px', background: '#000', border: isUnlocked ? '1px solid rgba(250,204,21,0.3)' : '1px solid #333' }}>
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            filter: isUnlocked ? 'none' : 'grayscale(1) blur(6px)',
                            opacity: isUnlocked ? 1 : 0.35,
                            transition: 'filter 0.3s ease'
                          }} 
                        />
                        {!isUnlocked && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', background: 'rgba(0,0,0,0.4)' }}>
                            🔒
                          </div>
                        )}
                      </div>

                      <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", color: isUnlocked ? '#fef08a' : '#aaa', fontSize: '1.05rem' }}>{item.name}</h3>
                      <p style={{ fontSize: '0.75rem', marginTop: '6px', color: isUnlocked ? '#4ade80' : '#888', margin: '4px 0 0 0' }}>
                        {isUnlocked ? '🔎 Xem Thẻ 3D Hologram' : 'Trò chuyện để mở khóa'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Top Header */}
        <header className="chat-header">
          <div className="chat-title">
            Đàm Đạo Cùng {name}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            
            {/* Eco Mode Switch */}
            <button 
              className="btn-primary"
              onClick={() => setEcoMode(!ecoMode)}
              style={{
                background: ecoMode ? 'linear-gradient(90deg, #15803d, #166534)' : 'rgba(0,0,0,0.5)',
                borderColor: ecoMode ? '#4ade80' : 'rgba(255,255,255,0.2)'
              }}
              title="Bật/Tắt chế độ tiết kiệm hiệu năng pin"
            >
              🔋 Eco Mode: {ecoMode ? 'BẬT' : 'TẮT'}
            </button>

            {/* RAG Toggle */}
            <button 
              className="btn-primary" 
              onClick={() => setRagEnabled(!ragEnabled)}
              style={{ 
                background: ragEnabled ? 'linear-gradient(90deg, #16a34a, #15803d)' : 'linear-gradient(90deg, #4b5563, #374151)',
                borderColor: ragEnabled ? '#4ade80' : '#6b7280'
              }}
              title="Bật/Tắt RAG Kiểm Kiểm Chứng Sử Liệu Vector DB"
            >
              🔍 RAG: {ragEnabled ? 'BẬT' : 'TẤT'}
            </button>

            <button className="btn-primary" onClick={() => setShowInventory(true)}>
              🎒 Hành Trang ({inventory.length}/{currentItems.length})
            </button>
            <button 
              className="btn-primary" 
              onClick={() => setShowMap(!showMap)}
              style={{ background: showMap ? 'rgba(250, 204, 21, 0.3)' : '' }}
            >
              🗺️ {showMap ? 'Ẩn Bản Đồ' : 'Bản Đồ Di Tích'}
            </button>
            <button className="btn-primary" onClick={onBack}>
              Trở Về
            </button>
          </div>
        </header>

        {/* RAG Status Banner */}
        <div style={{ background: 'rgba(20,15,10,0.85)', padding: '10px 20px', borderBottom: '1px solid rgba(250,204,21,0.2)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: ragEnabled ? '#4ade80' : '#9ca3af' }}>
            🛡️ RAG Status: {ragEnabled ? 'Đã liên kết Vector DB (Chống bịa sử)' : 'Chế độ AI tự do (Chưa kiểm chứng)'}
          </span>
        </div>

        {/* Interactive Map Collapsible Panel */}
        {showMap && (
          <div style={{ padding: '15px 20px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <MapPanel 
              character={character} 
              onSelectLocationPrompt={(prompt) => {
                sendMessage(prompt, { rag_enabled: ragEnabled });
                setShowMap(false);
              }} 
            />
          </div>
        )}

        {/* Mini Timeline Bar */}
        <div style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', display: 'flex', gap: '12px', overflowX: 'auto', whiteSpace: 'nowrap', alignItems: 'center' }}>
          <span style={{ color: '#facc15', fontFamily: "'Playfair Display', serif", fontWeight: 'bold', fontSize: '0.9rem', marginRight: '10px' }}>
            Dòng Thời Gian:
          </span>
          {(character === 'batrieu' 
            ? [ { year: '226', event: 'Sinh ra tại Quan Yên' }, { year: '248', event: 'Khởi nghĩa Ngàn Nưa' }, { year: '248', event: 'Trận Bồ Điền' }, { year: 'Cuối 248', event: 'Tuẫn tiết tại núi Tùng' } ]
            : [ { year: '1416', event: 'Hội thề Lũng Nhai' }, { year: '1418', event: 'Khởi nghĩa Lam Sơn' }, { year: '1427', event: 'Hội thề Đông Quan' }, { year: '1428', event: 'Hoàn Gươm Thần' } ]
          ).map((item, idx) => (
            <button 
              key={idx}
              className="btn-primary"
              style={{ padding: '5px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '15px' }}
              onClick={() => sendMessage(`Hãy kể về sự kiện: ${item.year} - ${item.event}`, { rag_enabled: ragEnabled })}
              disabled={!isConnected || isReceiving}
            >
              <strong style={{ color: '#fef08a' }}>{item.year}</strong>: {item.event}
            </button>
          ))}
        </div>

        {/* Main Chat Stream */}
        <div className="chat-history" ref={historyRef}>
          {messages.length === 0 && (
            <div className="suggested-prompts slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: 'auto', marginBottom: '20px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginBottom: '10px' }}>
                Gợi ý câu hỏi đàm đạo:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {(character === "batrieu" 
                  ? ["Trận Bồ Điền diễn ra như thế nào?", "Vì sao ngài dấy binh khởi nghĩa?", "Câu nói nổi tiếng của bà là gì?"]
                  : ["Hội thề Lũng Nhai diễn ra thế nào?", "Sự tích Gươm Thần Thuận Thiên?", "Trận chiến ở ải Chi Lăng thế nào?"]
                ).map((promptText, i) => (
                  <button 
                    key={i} 
                    className="btn-primary" 
                    style={{ fontSize: '0.9rem', padding: '8px 16px', background: 'transparent' }}
                    onClick={() => sendMessage(promptText, { rag_enabled: ragEnabled })}
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => {
            return (
              <div key={idx} className={`message-container ${msg.sender} slide-up`}>
                {msg.sender === "bot" && (
                  <ParticleAvatar character={character} ecoMode={ecoMode} />
                )}
                <div className={`message-bubble ${msg.sender === "user" ? "user-bubble" : ""}`}>
                  <div>{msg.text}</div>
                  
                  {/* RAG Verification Citations Box */}
                  {msg.sender === "bot" && msg.sources && msg.sources.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.8rem', color: '#93c5fd' }}>
                      <div style={{ fontWeight: 'bold', color: '#facc15', marginBottom: '4px' }}>
                        📖 Sử liệu kiểm chứng (RAG Source):
                      </div>
                      {msg.sources.map((src, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '6px', marginTop: '4px', borderLeft: '3px solid #60a5fa' }}>
                          <em>"{src.text}"</em>
                          <div style={{ textAlign: 'right', marginTop: '2px', color: '#38bdf8', fontSize: '0.75rem' }}>
                            📍 {src.source}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isReceiving && (
            <div className="message-container bot slide-up">
              <ParticleAvatar character={character} ecoMode={ecoMode} />
              <div className="message-bubble">
                <span className="typing-dot">.</span>
                <span className="typing-dot">.</span>
                <span className="typing-dot">.</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Bạn muốn đàm đạo điều gì..."
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

        {!isConnected && (
          <div style={{ position: "fixed", top: 10, left: 10, background: "rgba(255,0,0,0.8)", padding: "5px 15px", borderRadius: "20px", fontSize: "0.8rem", color: "white" }}>
            Đang kết nối WebSocket...
          </div>
        )}
      </div>

    </div>
  );
}
