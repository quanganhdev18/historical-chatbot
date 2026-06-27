import React, { useState, useEffect, useRef } from 'react';
import { STORY_BATRIEU, STORY_LELOI } from '../story';

export default function VisualNovelMode({ character, onBack }) {
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
    }, 25); // 25ms per char for a nice reading speed
    
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
  }, [timeLeft, currentNodeId, STORY_NODES]);

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

  const handleChoice = (nextId) => {
    setCurrentNodeId(nextId);
  }

  const handleDialogClick = () => {
    const node = STORY_NODES[currentNodeId];
    if (!node) return;
    
    if (isTyping) {
      // Skip typing
      setIsTyping(false);
      setDisplayedText(node.text);
    } else {
      // If typing is done and there's only 1 choice, auto advance
      if (!node.ending && node.choices && node.choices.length === 1) {
        handleChoice(node.choices[0].nextId);
      }
    }
  }

  const handleBack = () => {
    bgmRef.current.pause();
    onBack();
  }

  const currentNode = STORY_NODES[currentNodeId];
  if (!currentNode) return null;

  return (
    <div className="vn-container">
      {/* Cinematic Letterbox Effects */}
      <div className="letterbox-top"></div>
      
      <header style={{ position: 'absolute', top: '20px', right: '20px', left: '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {ending && !showEndingOverlay && (
            <button className="btn-primary glow-effect" onClick={() => setShowEndingOverlay(true)}>
              Xem lại Kết Cục
            </button>
          )}
        </div>
        <button className="btn-primary" onClick={handleBack}>Quay lại Menu</button>
      </header>

      <div className="vn-content">
        {!isTyping && !ending && currentNode.choices && (
          <div className="vn-choices">
            {timeLeft !== null && (
              <div className="vn-timer-container">
                <div className="vn-timer-bar" style={{ width: `${(timeLeft / MAX_TIME) * 100}%` }}></div>
              </div>
            )}
            {currentNode.choices.map((choice, i) => (
              <button 
                key={i} 
                className="choice-btn" 
                onClick={() => handleChoice(choice.nextId)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        )}

        {/* Dialog Box pinned to bottom */}
        <div className="dialog-box" onClick={handleDialogClick} style={{ cursor: isTyping || (currentNode.choices && currentNode.choices.length === 1) ? 'pointer' : 'default' }}>
          <div className="dialog-speaker">{currentNode.speaker}</div>
          <div className="dialog-text">
            {displayedText}
            {!isTyping && !ending && <span className="vn-typing-indicator">▼</span>}
          </div>
        </div>
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
            <button className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.2em' }} onClick={() => setShowEndingOverlay(false)}>
              Đóng bảng (Đọc thoại)
            </button>
            <button className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.2em', background: 'rgba(255,255,255,0.1)' }} onClick={handleBack}>
              Trở Về Màn Hình Chính
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
