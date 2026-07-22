import React, { useState, useEffect, useRef, useCallback } from 'react';
import { STORY_BATRIEU, STORY_LELOI } from '../story';

// Web Audio API Synthesizer for Visual Novel SFX Sound Effects
function playSynthesizedSFX(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'sword') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'drum' || type === 'slam') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'horn') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(330, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch (e) {
    console.log('SFX Play fail', e);
  }
}

export default function VisualNovelMode({ character, lang = 'vi', ecoMode = false, setEcoMode, onBack }) {
  const STORY_NODES = character === 'batrieu' ? STORY_BATRIEU : STORY_LELOI;

  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [visitedNodeIds, setVisitedNodeIds] = useState(['start']);
  const [history, setHistory] = useState([]);
  const [ending, setEnding] = useState(null);
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

  const bgmRef = useRef(new Audio());
  const lastProcessedNodeRef = useRef(null);

  const handleChoice = useCallback((nextId) => {
    setCurrentNodeId(nextId);
  }, []);

  const handleBack = useCallback(() => {
    if (bgmRef.current) bgmRef.current.pause();
    onBack();
  }, [onBack]);

  // Cleanup BGM on unmount
  useEffect(() => {
    return () => {
      if (bgmRef.current) bgmRef.current.pause();
    };
  }, []);

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

    // Trigger visual & audio screen effects
    if (node.sfx) {
      playSynthesizedSFX(node.sfx);
      if (!ecoMode) { // Suppress visual shakes/flashes in Eco Mode for low-end hardware
        if (node.sfx === 'sword' || node.sfx === 'fire') {
          setScreenEffect('flash');
          setTimeout(() => setScreenEffect(null), 300);
        } else if (node.sfx === 'slam' || node.sfx === 'thunder' || node.sfx === 'battle') {
          setScreenEffect('shake');
          setTimeout(() => setScreenEffect(null), 400);
        }
      }
    }

    setDisplayedText("");
    setIsTyping(true);
    setTimeLeft(null);

    if (node.ending) {
      setEnding(node.ending);
      playEndingBGM(node.ending.type);
    }
  }, [currentNodeId, STORY_NODES, character, ecoMode]);

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

  // Countdown Timer
  useEffect(() => {
    if (isTyping) return;
    const node = STORY_NODES[currentNodeId];
    if (node && !node.ending && node.choices && node.choices.length > 1) {
      setTimeLeft(MAX_TIME);
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
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, currentNodeId, STORY_NODES, handleChoice]);

  const playEndingBGM = (type) => {
    bgmRef.current.pause();
    let src = '';
    if (type === 'victory') src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    else if (type === 'historical') src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
    else src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';

    bgmRef.current.src = src;
    bgmRef.current.loop = true;
    bgmRef.current.play().catch((e) => console.log('BGM play blocked', e));
  };

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

      {/* Top Header - Compact Immersive Menu Trigger */}
      <header style={{ position: 'absolute', top: '20px', right: '20px', left: '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {ending && !showEndingOverlay && (
            <button className="btn-primary glow-effect" onClick={() => setShowEndingOverlay(true)}>
              🏆 Xem lại Kết Cục
            </button>
          )}
        </div>

        {/* Dropdown Menu wrapper */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-primary" 
            onClick={() => setShowMenu(!showMenu)}
            style={{ 
              background: showMenu ? '#facc15' : 'rgba(0,0,0,0.6)', 
              color: showMenu ? '#000' : '#fff',
              border: '1px solid #facc15',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '10px 22px',
              fontSize: '0.95rem'
            }}
          >
            ⚙️ CÀI ĐẶT {showMenu ? '▲' : '▼'}
          </button>

          {/* Floating Dropdown settings Panel */}
          {showMenu && (
            <div 
              className="glass-panel slide-up"
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '230px',
                background: 'rgba(15, 10, 22, 0.96)',
                border: '1.5px solid #facc15',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.8), 0 0 15px rgba(250,204,21,0.25)',
                zIndex: 200
              }}
            >
              <button 
                className="btn-primary" 
                onClick={() => { setShowMenu(false); setShowTreeModal(true); }}
                style={{ background: 'linear-gradient(90deg, #d97706, #b45309)', width: '100%', padding: '8px 12px', fontSize: '0.9rem' }}
              >
                🌿 Sơ Đồ Rẽ Nhánh
              </button>

              <button 
                className="btn-primary" 
                onClick={() => { setShowMenu(false); setShowHistoryModal(true); }}
                style={{ background: 'rgba(255,255,255,0.08)', width: '100%', padding: '8px 12px', fontSize: '0.9rem' }}
              >
                📜 Nhật Ký Thoại
              </button>

              <button 
                className="btn-primary" 
                onClick={() => setEcoMode(!ecoMode)}
                style={{ 
                  background: ecoMode ? 'linear-gradient(90deg, #15803d, #166534)' : 'rgba(255,255,255,0.08)', 
                  borderColor: ecoMode ? '#4ade80' : '',
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.9rem'
                }}
              >
                🔋 Eco Mode: {ecoMode ? 'BẬT' : 'TẮT'}
              </button>

              <button 
                className="btn-primary" 
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                style={{ 
                  background: isAutoPlay ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255,255,255,0.08)', 
                  borderColor: isAutoPlay ? '#4ade80' : '',
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.9rem'
                }}
              >
                ⏩ Tự Động: {isAutoPlay ? 'BẬT' : 'TẮT'}
              </button>

              <button 
                className="btn-primary" 
                onClick={() => setIsFastSkip(!isFastSkip)}
                style={{ 
                  background: isFastSkip ? 'rgba(234, 179, 8, 0.4)' : 'rgba(255,255,255,0.08)', 
                  borderColor: isFastSkip ? '#facc15' : '',
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.9rem'
                }}
              >
                ⏭️ Tua Nhanh: {isFastSkip ? 'BẬT' : 'TẮT'}
              </button>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px', marginTop: '4px' }}>
                <button 
                  className="btn-primary" 
                  onClick={handleBack}
                  style={{ background: 'rgba(239, 68, 68, 0.25)', borderColor: '#ef4444', width: '100%', padding: '8px 12px', fontSize: '0.9rem' }}
                >
                  🏠 Quay lại Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Chapter Title Banner */}
      {currentNode.chapter && (
        <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 90, background: 'linear-gradient(90deg, transparent, rgba(30,15,5,0.9), transparent)', borderBottom: '1px solid #facc15', padding: '6px 40px', color: '#fef08a', fontFamily: "'Cinzel', serif", letterSpacing: '3px', fontSize: '1rem', textTransform: 'uppercase', textShadow: '0 0 10px rgba(250,204,21,0.5)' }}>
          {currentNode.chapter}
        </div>
      )}

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
            {timeLeft !== null && (
              <div className="vn-timer-container split-timer">
                <div className="vn-timer-bar" style={{ width: `${(timeLeft / MAX_TIME) * 100}%` }}></div>
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
                    padding: '22px 25px',
                    fontSize: '1.15rem',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(35,20,10,0.95), rgba(15,10,20,0.95))',
                    border: '1px solid #facc15',
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
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(250,204,21,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
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

      {/* Branching Story Flowchart Tree Modal (Hides Unvisited Nodes!) */}
      {showTreeModal && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
          onClick={() => setShowTreeModal(false)}
        >
          <div 
            className="glass-panel slide-up" 
            style={{ background: 'rgba(15,10,20,0.96)', border: '2px solid #facc15', borderRadius: '24px', padding: '30px', maxWidth: '850px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowTreeModal(false)}
              style={{ position: 'absolute', top: 15, right: 15, background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ✕
            </button>
            
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fef08a', textAlign: 'center', marginBottom: '20px', fontSize: '1.8rem' }}>
              🌿 Sơ Đồ Tiến Trình Rẽ Nhánh
            </h2>

            {/* Tree Nodes List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              {allNodeKeys.map((nodeKey) => {
                const isUnlocked = visitedNodeIds.includes(nodeKey);
                const isCurrent = currentNodeId === nodeKey;
                const nodeData = STORY_NODES[nodeKey];

                if (isUnlocked) {
                  return (
                    <div 
                      key={nodeKey}
                      onClick={() => {
                        setCurrentNodeId(nodeKey);
                        setShowTreeModal(false);
                      }}
                      style={{
                        background: isCurrent ? 'rgba(34, 197, 94, 0.25)' : 'rgba(250, 204, 21, 0.1)',
                        border: isCurrent ? '2px solid #4ade80' : '1px solid rgba(250,204,21,0.4)',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isCurrent ? '#4ade80' : '#facc15', textTransform: 'uppercase' }}>
                          {isCurrent ? '📍 Hiện Tại' : 'Đoạn Thoại'}
                        </span>
                        <span style={{ fontSize: '1.1rem' }}>{nodeData.avatar || '📜'}</span>
                      </div>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1rem', marginBottom: '5px' }}>
                        {nodeData.chapter || nodeKey}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#93c5fd', margin: 0 }}>
                        {nodeData.speaker}
                      </p>
                      <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '3px 10px', marginTop: '10px', width: '100%' }}>
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
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px stroke rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding: '20px',
                        textAlign: 'center',
                        opacity: 0.5,
                        filter: 'blur(0.5px)',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔒</div>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#777', fontSize: '0.95rem', margin: 0 }}>
                        ??? (Chưa Mở Khóa)
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '5px' }}>
                        Đưa ra lựa chọn để mở nhánh này
                      </p>
                    </div>
                  );
                }
              })}
            </div>

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
              🏠 Trở Về Màn Hách Chính
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
