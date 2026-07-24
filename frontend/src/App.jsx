import React, { useState, useRef, useEffect } from 'react';
import FreeChatMode from './components/FreeChatMode';
import VisualNovelMode from './components/VisualNovelMode';
import TimeVortex from './components/TimeVortex';

function App() {
  const [character, setCharacter] = useState(null); // 'batrieu' or 'leloi'
  const [mode, setMode] = useState(null); // 'chat' or 'vn'
  const [isVortexing, setIsVortexing] = useState(false);
  const [vortexChar, setVortexChar] = useState(null);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const handleCharacterSelect = (char) => {
    if (isVortexing) return;

    setVortexChar(char);
    setIsVortexing(true);

    timersRef.current.push(setTimeout(() => {
      setCharacter(char);
    }, 1750));

    timersRef.current.push(setTimeout(() => {
      setIsVortexing(false);
    }, 2100));
  };

  return (
    <>
      {isVortexing && <TimeVortex character={vortexChar} />}

      {!character ? (
        /* Split Screen Character Select */
        <div className="split-screen-container">
          {/* BÀ TRIỆU */}
          <div className="split-pane split-batrieu" onClick={() => handleCharacterSelect('batrieu')}>
            <div className="split-bg"></div>
            <div className="split-overlay"></div>
            <div className="split-content">
              <h2 className="split-title-vertical">BÀ TRIỆU</h2>
              <div className="split-details">
                <h2 className="split-name">BÀ TRIỆU</h2>
                <h3 className="split-title">Nhụy Kiều Tướng Quân</h3>
                <p className="split-desc">
                  Khởi nghĩa Nưa đại phá quân Đông Ngô.
                </p>
                <button className="btn-primary split-btn">BẮT ĐẦU</button>
              </div>
            </div>
          </div>

          {/* LÊ LỢI */}
          <div className="split-pane split-leloi" onClick={() => handleCharacterSelect('leloi')}>
            <div className="split-bg"></div>
            <div className="split-overlay"></div>
            <div className="split-content">
              <h2 className="split-title-vertical">LÊ LỢI</h2>
              <div className="split-details">
                <h2 className="split-name">LÊ LỢI</h2>
                <h3 className="split-title">Bình Định Vương</h3>
                <p className="split-desc">
                  Khởi nghĩa Lam Sơn đại phá quân Minh.
                </p>
                <button className="btn-primary split-btn">BẮT ĐẦU</button>
              </div>
            </div>
          </div>

          <div className="split-center-title">
            <h1>CHỌN NHÂN VẬT LỊCH SỬ</h1>
          </div>
        </div>
      ) : (
        /* Main Experience Container */
        <div className={`app-container theme-${character}`}>
          <div className="background-overlay"></div>

          {!mode ? (
            /* Mode Selection Menu - Two Core Features */
            <div className="menu-container">
              <button
                className="btn-back-nav"
                onClick={() => {
                  setCharacter(null);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                <span>Đổi Nhân Vật</span>
              </button>

              <div className="menu-content">
                <div className="menu-header">
                  <span className="menu-badge">HÀNH TRÌNH LỊCH SỬ</span>
                  <h1 className="title text-gradient">
                    {character === 'batrieu' ? 'TRUYỀN THUYẾT BÀ TRIỆU' : 'HÀO KHÍ LAM SƠN'}
                  </h1>
                  <p className="menu-subtitle">
                    Lựa chọn phương thức trải nghiệm để bắt đầu đàm đạo cùng anh hùng dân tộc
                  </p>
                </div>

                {/* Two Core Feature Cards Grid */}
                <div className="menu-cards-grid">
                  
                  {/* Core Feature 1: Free Chat Dialogue */}
                  <div className="menu-card glass-panel" onClick={() => setMode('chat')}>
                    <div className="menu-card-content">
                      <span className="mode-pill">CHẾ ĐỘ 1 • AI DIALOGUE</span>
                      <div className="card-icon-wrapper">🗣️</div>
                      <h2 className="mode-card-title">Đàm Đạo Tự Do</h2>
                      <p className="mode-card-desc">
                        Trò chuyện trực tiếp cùng {character === 'batrieu' ? 'Bà Triệu' : 'Lê Lợi'}, đàm đạo và giải đáp lịch sử thời gian thực.
                      </p>
                    </div>
                    <button className="btn-mode-action">
                      <span>Bắt Đầu Đàm Đạo</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>

                  {/* Core Feature 2: Visual Novel Story */}
                  <div className="menu-card glass-panel" onClick={() => setMode('vn')}>
                    <div className="menu-card-content">
                      <span className="mode-pill">CHẾ ĐỘ 2 • VISUAL NOVEL</span>
                      <div className="card-icon-wrapper">📖</div>
                      <h2 className="mode-card-title">Cốt Truyện Nhập Vai</h2>
                      <p className="mode-card-desc">
                        Tái hiện diễn biến lịch sử hào hùng qua các mốc quyết định trọng đại mang tính sinh tử.
                      </p>
                    </div>
                    <button className="btn-mode-action">
                      <span>Khám Phá Cốt Truyện</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ) : mode === 'chat' ? (
            <FreeChatMode character={character} lang="vi" onBack={() => setMode(null)} />
          ) : (
            <VisualNovelMode character={character} lang="vi" onBack={() => setMode(null)} />
          )}
        </div>
      )}
    </>
  );
}

export default App;
