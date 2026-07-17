import React, { useState, useEffect, useRef, useCallback } from 'react';
import { STORY_BATRIEU, STORY_LELOI } from '../story';

export default function VisualNovelMode({ character, onBack, waveHandlersRef }) {
  const STORY_NODES = character === 'batrieu' ? STORY_BATRIEU : STORY_LELOI;
  
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState([]);
  const [ending, setEnding] = useState(null);
  const [showEndingOverlay, setShowEndingOverlay] = useState(true);
  
  // VN Mechanics State
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const MAX_TIME = 10;
  
  const bgmRef = useRef(new Audio());
  const messagesEndRef = useRef(null);
  const lastProcessedNodeRef = useRef(null);

  // Cố định ref để dùng trong callback của hand tracking
  const stateRef = useRef({ isTyping, ending, currentNodeId, showEndingOverlay });
  useEffect(() => {
    stateRef.current = { isTyping, ending, currentNodeId, showEndingOverlay };
  }, [isTyping, ending, currentNodeId, showEndingOverlay]);

  const handleChoice = useCallback((nextId) => {
    setCurrentNodeId(nextId);
  }, []);

  const handleBack = useCallback(() => {
    if (bgmRef.current) bgmRef.current.pause();
    onBack();
  }, [onBack]);

  // Hand Tracking Logic
  const handleWaveLeft = useCallback(() => {
    const { isTyping, ending, currentNodeId, showEndingOverlay } = stateRef.current;
    
    if (ending) {
      if (showEndingOverlay) setShowEndingOverlay(false); // Vẫy trái: Đóng bảng
      return;
    }

    const node = STORY_NODES[currentNodeId];
    if (isTyping) {
      setIsTyping(false);
      setDisplayedText(node ? node.text : "");
      return;
    }
    
    if (node && node.choices && node.choices.length > 0) {
      handleChoice(node.choices[0].nextId);
    }
  }, [STORY_NODES, handleChoice]);

  const handleWaveRight = useCallback(() => {
    const { isTyping, ending, currentNodeId, showEndingOverlay } = stateRef.current;
    
    if (ending) {
      if (showEndingOverlay) handleBack(); // Vẫy phải: Trở về
      return;
    }

    const node = STORY_NODES[currentNodeId];
    if (isTyping) {
      setIsTyping(false);
      setDisplayedText(node ? node.text : "");
      return;
    }
    
    if (node && node.choices && node.choices.length > 1) {
      handleChoice(node.choices[1].nextId);
    }
  }, [STORY_NODES, handleChoice, handleBack]);

  // Đăng ký wave handlers với App.jsx (Global)
  useEffect(() => {
    if (waveHandlersRef) {
      waveHandlersRef.current = { left: handleWaveLeft, right: handleWaveRight };
    }
    return () => {
      if (waveHandlersRef) waveHandlersRef.current = { left: null, right: null };
    };
  }, [handleWaveLeft, handleWaveRight, waveHandlersRef]);

  // Cleanup bgm on unmount
  useEffect(() => {
    return () => {
      if (bgmRef.current) bgmRef.current.pause();
    };
  }, []);

  // Node Loading
  useEffect(() => {
    if (lastProcessedNodeRef.current === currentNodeId) return;
    lastProcessedNodeRef.current = currentNodeId;

    const node = STORY_NODES[currentNodeId];
    if (!node) return;

    setHistory(prev => [...prev, { id: currentNodeId, ...node }]);
    
    // Reset mechanics
    setDisplayedText("");
    setIsTyping(true);
    setTimeLeft(null);
    
    if (node.ending) {
      setEnding(node.ending);
      playEndingBGM(node.ending.type);
    }
  }, [currentNodeId, STORY_NODES]);

  // Typewriter Effect
  useEffect(() => {
    if (!isTyping) return;
    const node = STORY_NODES[currentNodeId];
    if (!node) return;
    
    const fullText = node.text;
    let index = 0;
    
    const intervalId = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 25); // 25ms per char
    
    return () => clearInterval(intervalId);
  }, [currentNodeId, isTyping, STORY_NODES]);

  // Start Timer when typing finishes (if multiple choices)
  useEffect(() => {
    if (isTyping) return;
    
    const node = STORY_NODES[currentNodeId];
    if (node && !node.ending && node.choices && node.choices.length > 1) {
      setTimeLeft(MAX_TIME);
    }
  }, [isTyping, currentNodeId, STORY_NODES]);

  // Countdown Timer Logic
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer hits 0! Pick random choice
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
    bgmRef.current.play().catch(e => console.log('BGM Play blocked', e));
  }

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
  }

  const currentNode = STORY_NODES[currentNodeId];
  if (!currentNode) return null;

  return (
    <div className="vn-container">
      <div className="letterbox-top"></div>
      
      <header style={{ position: 'absolute', top: '20px', right: '20px', left: '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {ending && !showEndingOverlay && (
            <button className="btn-primary glow-effect" onClick={() => setShowEndingOverlay(true)}>
              Xem lại Kết Cục
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span className="wave-hint" style={{ animation: 'none', opacity: 0.8, color: '#facc15' }}>🤏 Chụm nhả ngón tay</span>
          <button className="btn-primary" onClick={handleBack}>Quay lại Menu</button>
        </div>
      </header>

      <div className="vn-content" style={{ paddingBottom: '180px' }}>
        <div className="dialog-box" onClick={handleDialogClick} style={{ cursor: isTyping || (currentNode.choices && currentNode.choices.length === 1) ? 'pointer' : 'default' }}>
          <div className="dialog-speaker">{currentNode.speaker}</div>
          <div className="dialog-text">
            {displayedText}
            {!isTyping && !ending && <span className="vn-typing-indicator">▼</span>}
          </div>
        </div>

        {!isTyping && !ending && currentNode.choices && (
          <div className="vn-choices-split">
            {timeLeft !== null && (
              <div className="vn-timer-container split-timer">
                <div className="vn-timer-bar" style={{ width: `${(timeLeft / MAX_TIME) * 100}%` }}></div>
              </div>
            )}
            
            <div className="split-choices-row">
              <div className="choice-side left">
                {currentNode.choices[0] && (
                  <button className="choice-btn split-choice-btn" onClick={() => handleChoice(currentNode.choices[0].nextId)}>
                    <div className="wave-hint">👈 Đưa tay trái</div>
                    {currentNode.choices[0].label}
                  </button>
                )}
              </div>
              
              <div className="choice-side right">
                {currentNode.choices[1] && (
                  <button className="choice-btn split-choice-btn" onClick={() => handleChoice(currentNode.choices[1].nextId)}>
                    <div className="wave-hint">Đưa tay phải 👉</div>
                    {currentNode.choices[1].label}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="letterbox-bottom"></div>

      {ending && showEndingOverlay && (
        <div className={`ending-overlay ending-${ending.type}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
          <button 
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', opacity: 0.8 }} 
            onClick={() => setShowEndingOverlay(false)}
            title="Đóng bảng để đọc thoại"
          >
            ✕
          </button>
          <h1 className="ending-title" style={{ fontSize: '5em', textShadow: '0 10px 30px rgba(0,0,0,0.8)', fontFamily: 'Outfit, sans-serif' }}>{ending.title}</h1>
          <p className="ending-desc" style={{ fontSize: '1.6em', maxWidth: '800px', lineHeight: 1.8, marginTop: '20px' }}>{ending.desc}</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '50px' }}>
            <button className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.2em', position: 'relative' }} onClick={() => setShowEndingOverlay(false)}>
              <div className="wave-hint" style={{position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap'}}>👈 Đưa tay trái</div>
              Đóng bảng (Đọc thoại)
            </button>
            <button className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.2em', background: 'rgba(255,255,255,0.1)', position: 'relative' }} onClick={handleBack}>
              <div className="wave-hint" style={{position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap'}}>Đưa tay phải 👉</div>
              Trở Về Màn Hình Chính
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
