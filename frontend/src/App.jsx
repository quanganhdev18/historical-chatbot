import React, { useState, useRef, useCallback } from 'react';
import FreeChatMode from './components/FreeChatMode';
import VisualNovelMode from './components/VisualNovelMode';
import TimeVortex from './components/TimeVortex';
import { useHandTracking } from './hooks/useHandTracking';

function App() {
  const [character, setCharacter] = useState(null); // 'batrieu' or 'leloi'
  const [mode, setMode] = useState(null);
  const [isVortexing, setIsVortexing] = useState(false);
  const [vortexChar, setVortexChar] = useState(null);

  const handleCharacterSelect = (char) => {
    if (isVortexing) return;
    setVortexChar(char);
    setIsVortexing(true);
    
    setTimeout(() => {
      setCharacter(char);
    }, 1750);

    setTimeout(() => {
      setIsVortexing(false);
    }, 2100);
  };

  // --- HAND TRACKING INTEGRATION ---
  const activeHandlersRef = useRef({ left: null, right: null });

  const handleGlobalWaveLeft = useCallback(() => {
    if (!character && !isVortexing) {
      handleCharacterSelect('batrieu');
    } else if (character && !mode) {
      setMode('chat');
    } else if (activeHandlersRef.current.left) {
      activeHandlersRef.current.left();
    }
  }, [character, mode, isVortexing]);

  const handleGlobalWaveRight = useCallback(() => {
    if (!character && !isVortexing) {
      handleCharacterSelect('leloi');
    } else if (character && !mode) {
      setMode('vn');
    } else if (activeHandlersRef.current.right) {
      activeHandlersRef.current.right();
    }
  }, [character, mode, isVortexing]);

  const handleGlobalPinchRelease = useCallback(() => {
    if (mode) {
      setMode(null); // Quay lại Mode Selection
    } else if (character && !isVortexing) {
      setCharacter(null); // Quay lại Character Selection
    }
  }, [mode, character, isVortexing]);

  const { videoRef, isReady, errorMsg } = useHandTracking({
    onWaveLeft: handleGlobalWaveLeft,
    onWaveRight: handleGlobalWaveRight,
    onPinchRelease: handleGlobalPinchRelease,
    cooldownMs: 1500
  });

  return (
    <>
      {/* GLOBAL CAMERA PIP */}
      <div className="hand-tracking-pip" style={{ 
        position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, 
        width: '200px', height: '150px', borderRadius: '12px', overflow: 'hidden',
        border: errorMsg ? '3px solid #ef4444' : (isReady ? '3px solid #10b981' : '3px solid #facc15'),
        boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
        background: 'black'
      }}>
        <video 
          ref={videoRef} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
          autoPlay playsInline muted 
        />
        {errorMsg ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.9)', color: 'white', fontSize: '12px', textAlign: 'center', padding: '10px' }}>
            <span style={{ fontSize: '24px', marginBottom: '5px' }}>❌</span>
            {errorMsg}
          </div>
        ) : !isReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '12px', textAlign: 'center', padding: '10px' }}>
            <span style={{ fontSize: '24px', marginBottom: '5px' }}>✋</span>
            Đang khởi động AI...<br/>Vui lòng cấp quyền Camera
          </div>
        )}
      </div>

      {isVortexing && <TimeVortex character={vortexChar} />}
      
      {!character ? (
        <div className="split-screen-container">
          {/* BÀ TRIỆU */}
          <div className="split-pane split-batrieu" onClick={() => handleCharacterSelect('batrieu')}>
            <div className="wave-hint" style={{position: 'absolute', top: 40, left: 40, zIndex: 10, fontSize: '1.4rem'}}>👈 Đưa tay trái</div>
            <div className="split-bg"></div>
            <div className="split-overlay"></div>
            <div className="split-content">
              <h2 className="split-title-vertical">BÀ TRIỆU</h2>
              <div className="split-details">
                <h2 className="split-name">BÀ TRIỆU</h2>
                <h3 className="split-title">Nhuỵ Kiều Tướng Quân</h3>
                <p className="split-desc">
                  Nữ anh hùng dân tộc thế kỷ 3. Cưỡi voi trắng dấy binh khởi nghĩa ở núi Nưa chống ách đô hộ Đông Ngô.
                  "Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông..."
                </p>
                <button className="btn-primary split-btn">Lựa Chọn</button>
              </div>
            </div>
          </div>
          
          {/* LÊ LỢI */}
          <div className="split-pane split-leloi" onClick={() => handleCharacterSelect('leloi')}>
            <div className="wave-hint" style={{position: 'absolute', top: 40, right: 40, zIndex: 10, fontSize: '1.4rem'}}>Đưa tay phải 👉</div>
            <div className="split-bg"></div>
            <div className="split-overlay"></div>
            <div className="split-content">
              <h2 className="split-title-vertical">LÊ LỢI</h2>
              <div className="split-details">
                <h2 className="split-name">LÊ LỢI</h2>
                <h3 className="split-title">Bình Định Vương</h3>
                <p className="split-desc">
                  Anh hùng dân tộc thế kỷ 15. Lãnh đạo Khởi nghĩa Lam Sơn đại phá giặc Minh, lập nên triều Hậu Lê huy hoàng, hoàn gươm thần Thuận Thiên.
                </p>
                <button className="btn-primary split-btn">Lựa Chọn</button>
              </div>
            </div>
          </div>
          
          <div className="split-center-title">
            <h1>CHỌN NHÂN VẬT</h1>
          </div>
        </div>
      ) : (
        <div className={`app-container theme-${character}`}>
          <div className="background-overlay"></div>
          
          {!mode ? (
            <div className="menu-container">
              <button className="btn-primary" style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }} onClick={() => setCharacter(null)}>
                ← Đổi Nhân Vật (🤏 Chụm nhả)
              </button>
              
              <div className="menu-content">
                <h1 className="title text-gradient" style={{ textAlign: 'center', marginBottom: '10px' }}>
                  {character === 'batrieu' ? 'TRUYỀN THUYẾT BÀ TRIỆU' : 'HÀO KHÍ LAM SƠN'}
                </h1>
                <p className="subtitle" style={{ textAlign: 'center', marginBottom: '50px' }}>
                  Chọn hình thức để trải nghiệm
                </p>
                
                <div className="menu-cards">
                  <div className="menu-card glass-panel" onClick={() => setMode('chat')} style={{position: 'relative'}}>
                    <div className="wave-hint" style={{position: 'absolute', top: -30}}>👈 Đưa tay trái</div>
                    <div className="card-icon">🗣️</div>
                    <h2>Đàm Đạo Tự Do</h2>
                    <p>Trò chuyện trực tiếp với {character === 'batrieu' ? 'Bà Triệu' : 'Lê Lợi'}. Hỏi đáp về binh pháp, triết lý và những góc khuất lịch sử.</p>
                  </div>
                  
                  <div className="menu-card glass-panel" onClick={() => setMode('vn')} style={{position: 'relative'}}>
                    <div className="wave-hint" style={{position: 'absolute', top: -30}}>Đưa tay phải 👉</div>
                    <div className="card-icon">📖</div>
                    <h2>Dấu Ấn Lịch Sử</h2>
                    <p>Nhập vai phó tướng, đưa ra các quyết định sinh tử và thay đổi cục diện chiến trường.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : mode === 'chat' ? (
            <FreeChatMode character={character} onBack={() => setMode(null)} />
          ) : (
            <VisualNovelMode character={character} onBack={() => setMode(null)} waveHandlersRef={activeHandlersRef} />
          )}
        </div>
      )}
    </>
  );
}

export default App;
