import React, { useState, useEffect, useRef, useCallback } from 'react';
import { STORY_BATRIEU, STORY_LELOI } from '../story';

// Removed playSynthesizedSFX as per request to remove sfx sounds

export default function VisualNovelMode({ character, lang = 'vi', onBack }) {
  const STORY_NODES = character === 'batrieu' ? STORY_BATRIEU : STORY_LELOI;
  const SAVE_KEY = `vn_save_${character}`;

  // Persistent Game State Initialization from LocalStorage
  const [currentNodeId, setCurrentNodeId] = useState(() => {
    try {
      const saved = localStorage.getItem(`vn_save_${character}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentNodeId) return parsed.currentNodeId;
      }
    } catch (e) {}
    return 'start';
  });

  const [visitedNodeIds, setVisitedNodeIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`vn_save_${character}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.visitedNodeIds && Array.isArray(parsed.visitedNodeIds)) return parsed.visitedNodeIds;
      }
    } catch (e) {}
    return ['start'];
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(`vn_save_${character}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.history && Array.isArray(parsed.history)) return parsed.history;
      }
    } catch (e) {}
    return [];
  });

  const [ending, setEnding] = useState(() => {
    try {
      const saved = localStorage.getItem(`vn_save_${character}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ending) return parsed.ending;
      }
    } catch (e) {}
    return null;
  });

  const [showEndingOverlay, setShowEndingOverlay] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showTreeModal, setShowTreeModal] = useState(false);

  // Immersive Dropdown Menu state
  const [showMenu, setShowMenu] = useState(false);

  // VN Control Toggles
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFastSkip, setIsFastSkip] = useState(false);
  const [screenEffect, setScreenEffect] = useState(null); // 'shake' or 'flash'

  // Typewriter and Timer state
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const MAX_TIME = 10;

  const lastProcessedNodeRef = useRef(null);

  const handleChoice = useCallback((nextId) => {
    setCurrentNodeId(nextId);
  }, []);

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  // Reset/Restart Game Progress
  const handleResetProgress = useCallback(() => {
    if (window.confirm("Bạn có chắc chắn muốn chơi lại từ đầu? Toàn bộ tiến trình rẽ nhánh hiện tại sẽ được làm mới.")) {
      try {
        localStorage.removeItem(`vn_save_${character}`);
      } catch (e) {}
      lastProcessedNodeRef.current = null;
      setVisitedNodeIds(['start']);
      setHistory([]);
      setEnding(null);
      setCurrentNodeId('start');
      setShowEndingOverlay(false);
      setShowTreeModal(false);
    }
  }, [character]);

  // Auto-Save Game Progress to LocalStorage
  useEffect(() => {
    try {
      const saveData = {
        currentNodeId,
        visitedNodeIds,
        history,
        ending
      };
      localStorage.setItem(`vn_save_${character}`, JSON.stringify(saveData));
    } catch (e) {
      console.error("Auto-save failed", e);
    }
  }, [currentNodeId, visitedNodeIds, history, ending, character]);



  // Node Loading & In-Session Branch Tracker
  useEffect(() => {
    if (lastProcessedNodeRef.current === currentNodeId) return;
    lastProcessedNodeRef.current = currentNodeId;

    const node = STORY_NODES[currentNodeId];
    if (!node) return;

    // Track visited nodes in session state
    const updatedVisited = Array.from(new Set([...visitedNodeIds, currentNodeId]));
    setVisitedNodeIds(updatedVisited);

    // Add to history log
    setHistory((prev) => [...prev, { id: currentNodeId, ...node }]);

    // Screen effects logic removed with SFX

    setDisplayedText("");
    setIsTyping(true);
    if (node.ending) {
      setEnding(node.ending);
    }
  }, [currentNodeId, STORY_NODES, character]);

  // Typewriter Effect
  useEffect(() => {
    const node = STORY_NODES[currentNodeId];
    if (!node) return;

    if (!isTyping) {
      setDisplayedText(node.text);
      return;
    }

    const fullText = node.text;
    let index = 0;
    const speed = isFastSkip ? 5 : 22;

    const intervalId = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [currentNodeId, isTyping, isFastSkip, STORY_NODES]);

  // Auto-play advances text when typing finishes
  useEffect(() => {
    if (isTyping) return;
    const node = STORY_NODES[currentNodeId];
    if (!node) return;

    if (isAutoPlay && !node.ending && node.choices && node.choices.length === 1) {
      const autoTimer = setTimeout(() => {
        handleChoice(node.choices[0].nextId);
      }, 2500);
      return () => clearTimeout(autoTimer);
    }
  }, [isTyping, isAutoPlay, currentNodeId, STORY_NODES, handleChoice]);

  // Countdown Timer Reset
  useEffect(() => {
    if (isTyping) {
      setTimeLeft(null);
      return;
    }
    const node = STORY_NODES[currentNodeId];
    if (node && !node.ending && node.choices && node.choices.length > 1) {
      setTimeLeft(MAX_TIME);
    } else {
      setTimeLeft(null);
    }
  }, [isTyping, currentNodeId, STORY_NODES]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const node = STORY_NODES[currentNodeId];
          if (node && node.choices) {
            const randomIndex = Math.floor(Math.random() * node.choices.length);
            handleChoice(node.choices[randomIndex].nextId);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, currentNodeId, STORY_NODES, handleChoice]);



  const handleDialogClick = () => {
    const node = STORY_NODES[currentNodeId];
    if (!node) return;

    if (isTyping) {
      setIsTyping(false);
      setDisplayedText(node.text);
    } else {
      if (!node.ending && node.choices && node.choices.length === 1) {
        handleChoice(node.choices[0].nextId);
      }
    }
  };

  const currentNode = STORY_NODES[currentNodeId];
  if (!currentNode) return null;

  const allNodeKeys = Object.keys(STORY_NODES);

  return (
    <div className={`vn-container ${screenEffect === 'shake' ? 'vn-shake-active' : ''}`}>
      
      {/* Screen Flash Overlay */}
      {screenEffect === 'flash' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.85)', zIndex: 9999, pointerEvents: 'none', animation: 'flashOut 0.3s ease-out forwards' }} />
      )}

      <div className="letterbox-top"></div>

      {/* Top Navigation & Action Header Bar */}
      <header className="vn-top-bar">
        <div className="vn-top-left">
          <button className="btn-back-nav" onClick={handleBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>Thoát</span>
          </button>
        </div>

        {/* Chapter Title Ribbon */}
        {currentNode.chapter && (
          <div className="vn-chapter-ribbon">
            <span>{currentNode.chapter}</span>
          </div>
        )}

        {/* Quick Action Toolbar */}
        <div className="vn-top-right">
          {ending && !showEndingOverlay && (
            <button className="vn-tool-btn" onClick={() => setShowEndingOverlay(true)} style={{ borderColor: '#facc15', color: '#facc15' }}>
              🏆 Kết Cục
            </button>
          )}

          <button 
            className="vn-tool-btn"
            onClick={() => setShowTreeModal(true)}
            title="Xem sơ đồ cây rẽ nhánh cốt truyện"
          >
            🌿 Sơ Đồ
          </button>

          <button 
            className="vn-tool-btn"
            onClick={() => setShowHistoryModal(true)}
            title="Xem lịch sử hội thoại"
          >
            📜 Nhật Ký
          </button>

          <button 
            className={`vn-tool-btn ${isAutoPlay ? 'active' : ''}`}
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            title="Tự động chuyển thoại"
          >
            ⏩ Tự Động
          </button>
        </div>
      </header>

      {/* Main Dialogue Content Area */}
      <div className="vn-content" style={{ paddingBottom: '180px' }}>
        
        {/* Dialogue Box */}
        <div
          className="dialog-box"
          onClick={handleDialogClick}
          style={{ cursor: isTyping || (currentNode.choices && currentNode.choices.length === 1) ? 'pointer' : 'default' }}
        >
          {/* Character Speaker Badge */}
          <div className="dialog-speaker" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>{currentNode.avatar || '📜'}</span>
            <span>{currentNode.speaker}</span>
          </div>

          {/* Dialogue Text Paragraph */}
          <div className="dialog-text">
            {displayedText}
            {!isTyping && !ending && <span className="vn-typing-indicator">▼</span>}
          </div>
        </div>

        {/* Branching Choices Grid */}
        {!isTyping && !ending && currentNode.choices && (
          <div className="vn-choices-split">
            {timeLeft !== null && currentNode.choices.length > 1 && (
              <div className="vn-timer-container">
                <div className="vn-timer-label">
                  <span>⏳ QUYẾT ĐỊNH SINH TỬ</span>
                  <span>{timeLeft}s</span>
                </div>
                <div className="vn-timer-track">
                  <div
                    className={`vn-timer-bar ${timeLeft <= 3 ? 'urgent' : ''}`}
                    style={{ width: `${(timeLeft / MAX_TIME) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="split-choices-row" style={{ display: 'flex', gap: '20px', justifyContent: 'center', width: '100%', maxWidth: '950px', margin: '0 auto' }}>
              {currentNode.choices.map((choice, i) => (
                <button
                  key={i}
                  className="choice-btn split-choice-btn"
                  onClick={() => handleChoice(choice.nextId)}
                  style={{
                    flex: 1,
                    padding: '20px 24px',
                    fontSize: '1.1rem',
                    lineHeight: '1.5',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(30, 22, 12, 0.95), rgba(18, 12, 24, 0.95))',
                    border: '1.5px solid rgba(250, 204, 21, 0.6)',
                    color: '#fef08a',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.7), 0 0 15px rgba(250,204,21,0.2)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.borderColor = '#facc15';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(250,204,21,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.6)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.7), 0 0 15px rgba(250,204,21,0.2)';
                  }}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="letterbox-bottom"></div>

      {/* Branching Story Flowchart Tree Modal (Detroit: Become Human / FMV Interactive Tree Style) */}
      {showTreeModal && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(5,3,10,0.94)', backdropFilter: 'blur(20px)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
          onClick={() => setShowTreeModal(false)}
        >
          <div 
            className="glass-panel slide-up" 
            style={{ background: 'linear-gradient(180deg, rgba(20,12,28,0.98) 0%, rgba(10,6,15,0.98) 100%)', border: '2px solid #facc15', borderRadius: '24px', padding: '32px', maxWidth: '1050px', width: '100%', maxHeight: '88vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(250,204,21,0.25)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowTreeModal(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '3px', color: '#facc15', textTransform: 'uppercase' }}>
                DETROIT / FMV INTERACTIVE STORY TREE
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', margin: '6px 0 10px 0', fontSize: '2rem' }}>
                🌿 Sơ Đồ Cây Tiến Trình Rẽ Nhánh
              </h2>
              
              {/* Status Legend & Reset Progress Bar */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', fontSize: '0.8rem', marginTop: '12px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontWeight: 'bold' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80' }}></span>
                  📍 Đang Ở Đây
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#facc15', fontWeight: 'bold' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#facc15' }}></span>
                  ✅ Đã Trải Nghiệm
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#475569' }}></span>
                  🔒 Cốt Truyện Ẩn (Fog of War)
                </span>

                <button 
                  onClick={handleResetProgress}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #ef4444',
                    color: '#fca5a5',
                    borderRadius: '20px',
                    padding: '4px 14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginLeft: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                  title="Xóa tiến trình đã lưu và chơi lại từ đầu"
                >
                  🔄 Chơi Lại Từ Đầu
                </button>
              </div>
            </div>

            {/* Tiered Tree Hierarchy Flowchart */}
            {(() => {
              const TREE_TIERS = {
                batrieu: [
                  { level: 'ACT I', title: 'CỘT MỐC I • LỜI THỀ NÚI NƯA (248)', nodes: ['start'] },
                  { level: 'ACT II', title: 'CỘT MỐC II • PHÂN NGHĨA HUYẾT MẠCH', nodes: ['act1_heroic_path', 'act1_tactical_path'] },
                  { level: 'ACT III', title: 'CỘT MỐC III • ĐỊNH MỆNH TRẬN MẠC', nodes: ['act2_elephant_battle', 'act2_fire_siege', 'act2_allied_rebellion', 'act2_ambush_trap'] },
                  { level: 'ENDING', title: 'CỘT MỐC IV • KẾT CỤC LỊCH SỬ', nodes: ['ending_batrieu_heroic_victory', 'ending_batrieu_historical', 'ending_batrieu_fire_victory', 'ending_batrieu_sovereignty', 'ending_batrieu_liberation', 'ending_batrieu_guerrilla_legend', 'ending_batrieu_trap_victory', 'ending_batrieu_diplomatic_triumph'] }
                ],
                leloi: [
                  { level: 'ACT I', title: 'CỘT MỐC I • HỘI THỀ LŨNG NHAI (1416)', nodes: ['start'] },
                  { level: 'ACT II', title: 'CỘT MỐC II • PHÂN NGHĨA HUYẾT MẠCH', nodes: ['act1_oath_path', 'act1_nghean_path'] },
                  { level: 'ACT III', title: 'CỘT MỐC III • ĐỊNH MỆNH TRẬN MẠC', nodes: ['act2_lelai_sacrifice', 'act2_chiling_breakthrough', 'act2_boai_campaign', 'act2_nghean_surrender'] },
                  { level: 'ENDING', title: 'CỘT MỐC IV • KẾT CỤC LỊCH SỬ', nodes: ['ending_leloi_chilang_triumph', 'ending_leloi_peace', 'ending_leloi_emperor', 'ending_leloi_legend', 'ending_leloi_northern_conquest', 'ending_leloi_great_announcement', 'ending_leloi_sovereignty_peace', 'ending_leloi_golden_era'] }
                ]
              };

              const currentTiers = TREE_TIERS[character] || TREE_TIERS.batrieu;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentTiers.map((tier, tierIdx) => (
                    <React.Fragment key={tierIdx}>
                      {/* Tier Section Header */}
                      <div style={{ borderLeft: '3px solid #facc15', paddingLeft: '12px', margin: '15px 0 10px 0' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#facc15', letterSpacing: '2px' }}>{tier.level}</span>
                        <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1.1rem' }}>{tier.title}</h3>
                      </div>

                      {/* Tier Nodes Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${tier.nodes.length > 4 ? '180px' : '220px'}, 1fr))`, gap: '15px' }}>
                        {tier.nodes.map((nodeKey) => {
                          const isUnlocked = visitedNodeIds.includes(nodeKey);
                          const isCurrent = currentNodeId === nodeKey;
                          const nodeData = STORY_NODES[nodeKey];

                          if (!nodeData) return null;

                          if (isUnlocked) {
                            return (
                              <div 
                                key={nodeKey}
                                onClick={() => {
                                  setCurrentNodeId(nodeKey);
                                  setShowTreeModal(false);
                                }}
                                style={{
                                  background: isCurrent 
                                    ? 'linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(20,80,40,0.4) 100%)' 
                                    : 'linear-gradient(135deg, rgba(40,28,15,0.85) 0%, rgba(20,12,25,0.85) 100%)',
                                  border: isCurrent ? '2px solid #4ade80' : '1.5px solid rgba(250,204,21,0.5)',
                                  borderRadius: '16px',
                                  padding: '16px',
                                  cursor: 'pointer',
                                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                  position: 'relative',
                                  boxShadow: isCurrent ? '0 0 25px rgba(74,222,128,0.4)' : '0 8px 20px rgba(0,0,0,0.6)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                                  e.currentTarget.style.borderColor = '#facc15';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'none';
                                  e.currentTarget.style.borderColor = isCurrent ? '#4ade80' : 'rgba(250,204,21,0.5)';
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: isCurrent ? '#4ade80' : '#fef08a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {isCurrent ? '📍 HIỆN TẠI' : '✅ ĐÃ TRẢI NGHIỆM'}
                                  </span>
                                  <span style={{ fontSize: '1.2rem' }}>{nodeData.avatar || '📜'}</span>
                                </div>

                                <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '0.98rem', marginBottom: '6px', lineHeight: 1.3 }}>
                                  {nodeData.ending ? nodeData.ending.title : (nodeData.chapter || nodeKey)}
                                </h4>

                                <p style={{ fontSize: '0.78rem', color: '#93c5fd', margin: 0, opacity: 0.9 }}>
                                  🗣️ {nodeData.speaker}
                                </p>

                                <button 
                                  className="btn-primary" 
                                  style={{ fontSize: '0.72rem', padding: '5px 10px', marginTop: '12px', width: '100%', background: isCurrent ? 'rgba(74,222,128,0.2)' : 'rgba(250,204,21,0.15)', borderColor: isCurrent ? '#4ade80' : '#facc15', color: '#fff' }}
                                >
                                  ⚡ Nhảy Đến Đoạn Này
                                </button>
                              </div>
                            );
                          } else {
                            /* LOCKED FOG-OF-WAR BRANCH NODE */
                            return (
                              <div 
                                key={nodeKey}
                                style={{
                                  background: 'rgba(10,6,15,0.7)',
                                  border: '1px dashed rgba(255,255,255,0.15)',
                                  borderRadius: '16px',
                                  padding: '16px',
                                  textAlign: 'center',
                                  opacity: 0.5,
                                  userSelect: 'none',
                                  filter: 'grayscale(0.8)'
                                }}
                              >
                                <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>🔒</div>
                                <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#888', fontSize: '0.9rem', margin: 0 }}>
                                  ??? (Nhánh Chưa Mở)
                                </h4>
                                <p style={{ fontSize: '0.72rem', color: '#555', marginTop: '6px', lineHeight: 1.3 }}>
                                  Đưa ra lựa chọn ở mốc trước để khai phá
                                </p>
                              </div>
                            );
                          }
                        })}
                      </div>

                      {/* Visual Tree Connector Line between Tiers */}
                      {tierIdx < currentTiers.length - 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
                          <div style={{ width: '2px', height: '24px', background: 'linear-gradient(180deg, #facc15 0%, rgba(250,204,21,0.2) 100%)', boxShadow: '0 0 8px rgba(250,204,21,0.5)' }}></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* History Log Modal */}
      {showHistoryModal && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
          onClick={() => setShowHistoryModal(false)}
        >
          <div 
            className="glass-panel slide-up" 
            style={{ background: 'rgba(15,10,20,0.95)', border: '1px solid #facc15', borderRadius: '24px', padding: '30px', maxWidth: '750px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowHistoryModal(false)}
              style={{ position: 'absolute', top: 15, right: 15, background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ✕
            </button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fef08a', textAlign: 'center', marginBottom: '20px' }}>
              📜 Nhật Ký Hội Thoại
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {history.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #facc15' }}>
                  <div style={{ color: '#facc15', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
                    {item.avatar} {item.speaker}
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ending Overlay */}
      {ending && showEndingOverlay && (
        <div
          className={`ending-overlay ending-${ending.type}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(0,0,0,0.92)'
          }}
        >
          <button
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', opacity: 0.8 }}
            onClick={() => setShowEndingOverlay(false)}
          >
            ✕
          </button>
          <h1 className="ending-title" style={{ fontSize: '4em', textShadow: '0 10px 30px rgba(0,0,0,0.9)', fontFamily: "'Playfair Display', serif", color: '#facc15' }}>
            {ending.title}
          </h1>
          <p className="ending-desc" style={{ fontSize: '1.4em', maxWidth: '800px', lineHeight: 1.8, marginTop: '20px', color: '#e2e8f0' }}>
            {ending.desc}
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
            <button className="btn-primary" style={{ padding: '14px 35px', fontSize: '1.1em' }} onClick={() => setShowEndingOverlay(false)}>
              📖 Đọc Thoại
            </button>
            <button className="btn-primary" style={{ padding: '14px 35px', fontSize: '1.1em', background: 'rgba(255,255,255,0.1)' }} onClick={handleBack}>
              🏠 Trở Về Màn Hình Chính
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
