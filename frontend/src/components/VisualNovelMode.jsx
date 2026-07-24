import React, { useState, useEffect, useRef, useCallback } from 'react';
import { STORY_BATRIEU, STORY_LELOI } from '../story';

let _audioCtx = null;
function getAudioContext() {
  if (!_audioCtx || _audioCtx.state === 'closed') {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    _audioCtx = new AudioCtx();
  }
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume();
  }
  return _audioCtx;
}

// Web Audio API Synthesizer for Visual Novel SFX Sound Effects
function playSynthesizedSFX(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

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

export default function VisualNovelMode({ character, lang = 'vi', onBack }) {
  const STORY_NODES = character === 'batrieu' ? STORY_BATRIEU : STORY_LELOI;

  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [visitedNodeIds, setVisitedNodeIds] = useState(['start']);
  const [history, setHistory] = useState([]);
  const [ending, setEnding] = useState(null);
  const [showEndingOverlay, setShowEndingOverlay] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [screenEffect, setScreenEffect] = useState(null); // 'shake' or 'flash'

  // Typewriter state
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bgmRef = useRef(new Audio());
  const lastProcessedNodeRef = useRef(null);

  const handleChoice = useCallback((nextId) => {
    if (STORY_NODES[nextId]) {
      setCurrentNodeId(nextId);
    }
  }, [STORY_NODES]);

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

  // Ensure valid currentNodeId on character change
  useEffect(() => {
    if (!STORY_NODES[currentNodeId]) {
      setCurrentNodeId('start');
    }
  }, [character, currentNodeId, STORY_NODES]);

  // Node Loading & In-Session Branch Tracker
  useEffect(() => {
    if (lastProcessedNodeRef.current === currentNodeId) return;
    lastProcessedNodeRef.current = currentNodeId;

    const node = STORY_NODES[currentNodeId];
    if (!node) return;

    // Track visited nodes in session state
    setVisitedNodeIds((prev) => Array.from(new Set([...prev, currentNodeId])));

    // Add to history log safely (avoid duplicate consecutive entries)
    setHistory((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].id === currentNodeId) {
        return prev;
      }
      return [...prev, { id: currentNodeId, ...node }];
    });

    // Trigger visual & audio screen effects
    if (node.sfx) {
      playSynthesizedSFX(node.sfx);
      if (node.sfx === 'sword' || node.sfx === 'fire') {
        setScreenEffect('flash');
        setTimeout(() => setScreenEffect(null), 300);
      } else if (node.sfx === 'slam' || node.sfx === 'thunder' || node.sfx === 'battle') {
        setScreenEffect('shake');
        setTimeout(() => setScreenEffect(null), 400);
      }
    }

    setDisplayedText("");
    setIsTyping(true);

    if (node.ending) {
      setEnding(node.ending);
      setShowEndingOverlay(true);
      playEndingBGM(node.ending.type);
    } else {
      setEnding(null);
      setShowEndingOverlay(false);
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
    const speed = 20;

    const intervalId = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [currentNodeId, isTyping, STORY_NODES]);



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

  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES['start'];
  if (!currentNode) return null;

  return (
    <div className={`vn-container ${screenEffect === 'shake' ? 'vn-shake-active' : ''}`}>
      
      {/* Screen Flash Overlay */}
      {screenEffect === 'flash' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.85)', zIndex: 9999, pointerEvents: 'none', animation: 'flashOut 0.3s ease-out forwards' }} />
      )}

      <div className="letterbox-top"></div>

      {/* Top Header Bar */}
      <header className="vn-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', zIndex: 100 }}>
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

        {/* Toolbar - Only Keep Dialogue History Log */}
        <div className="vn-top-right" style={{ display: 'flex', gap: '10px' }}>
          {ending && !showEndingOverlay && (
            <button className="vn-tool-btn" onClick={() => setShowEndingOverlay(true)} style={{ borderColor: '#d4af37', color: '#d4af37' }}>
              🏆 Kết Cục
            </button>
          )}

          <button 
            className="vn-tool-btn"
            onClick={() => setShowHistoryModal(true)}
            title="Xem lịch sử hội thoại"
          >
            📜 Nhật Ký
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
            <div className="split-choices-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', width: '100%', maxWidth: '950px', margin: '0 auto' }}>
              {currentNode.choices.map((choice, i) => (
                <button
                  key={i}
                  className="choice-btn split-choice-btn"
                  onClick={() => handleChoice(choice.nextId)}
                  style={{
                    flex: '1 1 280px',
                    padding: '18px 22px',
                    fontSize: '1.05rem',
                    lineHeight: '1.5',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(35,20,10,0.95), rgba(15,10,20,0.95))',
                    border: '1px solid #d4af37',
                    color: '#e8d48b',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.7), 0 0 15px rgba(212,175,55,0.2)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(212,175,55,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.7), 0 0 15px rgba(212,175,55,0.2)';
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

      {/* History Log Modal */}
      {showHistoryModal && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
          onClick={() => setShowHistoryModal(false)}
        >
          <div 
            className="glass-panel slide-up" 
            style={{ background: 'rgba(15,10,20,0.95)', border: '1px solid #d4af37', borderRadius: '24px', padding: '30px', maxWidth: '750px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowHistoryModal(false)}
              style={{ position: 'absolute', top: 15, right: 15, background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ✕
            </button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#e8d48b', textAlign: 'center', marginBottom: '20px' }}>
              📜 Nhật Ký Hội Thoại
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {history.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #d4af37' }}>
                  <div style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
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
          <h1 className="ending-title" style={{ fontSize: '4em', textShadow: '0 10px 30px rgba(0,0,0,0.9)', fontFamily: "'Playfair Display', serif", color: '#d4af37' }}>
            {ending.title}
          </h1>
          <p className="ending-desc" style={{ fontSize: '1.4em', maxWidth: '800px', lineHeight: 1.8, marginTop: '20px', color: '#e2e8f0' }}>
            {ending.desc}
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
            <button className="btn-primary" style={{ padding: '14px 35px', fontSize: '1.1em' }} onClick={() => setShowHistoryModal(true)}>
              📜 Nhật Ký
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
