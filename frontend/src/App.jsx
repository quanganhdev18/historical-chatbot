import React, { useState } from 'react';
import FreeChatMode from './components/FreeChatMode';
import VisualNovelMode from './components/VisualNovelMode';
import TimeVortex from './components/TimeVortex';

function App() {
  const [character, setCharacter] = useState(null); // 'batrieu' or 'leloi'
  const [mode, setMode] = useState(null); // 'chat' or 'vn'
  const [isVortexing, setIsVortexing] = useState(false);
  const [vortexChar, setVortexChar] = useState(null);
  const [initialPrompt, setInitialPrompt] = useState(null);

  // Global Eco Mode state
  const [ecoMode, setEcoMode] = useState(false);

  const handleCharacterSelect = (char) => {
    if (isVortexing) return;

    if (ecoMode) {
      setCharacter(char);
      return;
    }

    setVortexChar(char);
    setIsVortexing(true);

    setTimeout(() => {
      setCharacter(char);
    }, 1750);

    setTimeout(() => {
      setIsVortexing(false);
    }, 2100);
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
                <h3 className="split-title" style={{ color: '#fef08a' }}>Nhụy Kiều Tướng Quân (Ấn để Chọn)</h3>
                <p className="split-desc" style={{ fontSize: '1.1rem', color: '#fff', textShadow: '1px 1px 4px #000' }}>
                  Nữ anh hùng dân tộc thế kỷ 3 cưỡi voi trắng đánh tan giặc Đông Ngô giữ gìn giang sơn đất nước.
                </p>
                <button className="btn-primary split-btn" style={{ fontSize: '1.2rem', padding: '12px 30px' }}>BẮT ĐẦU VỚI BÀ TRIỆU</button>
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
                <h3 className="split-title" style={{ color: '#fef08a' }}>Bình Định Vương (Ấn để Chọn)</h3>
                <p className="split-desc" style={{ fontSize: '1.1rem', color: '#fff', textShadow: '1px 1px 4px #000' }}>
                  Đức vua Lê Thái Tổ lãnh đạo cuộc khởi nghĩa Lam Sơn đại phá giặc Minh giành lại hòa bình thái bình.
                </p>
                <button className="btn-primary split-btn" style={{ fontSize: '1.2rem', padding: '12px 30px' }}>BẮT ĐẦU VỚI LÊ LỢI</button>
              </div>
            </div>
          </div>

          <div className="split-center-title">
            <h1 style={{ fontSize: '2.5rem' }}>CHỌN NHÂN VẬT LỊCH SỬ</h1>
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
                className="btn-primary"
                style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, fontSize: '1.1rem', padding: '10px 20px' }}
                onClick={() => {
                  setCharacter(null);
                  setInitialPrompt(null);
                }}
              >
                ← Chọn lại Nhân Vật
              </button>

              <div className="menu-content" style={{ maxWidth: '900px', width: '95%' }}>
                <h1 className="title text-gradient" style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2.8rem' }}>
                  {character === 'batrieu' ? 'TRUYỀN THUYẾT BÀ TRIỆU' : 'HÀO KHÍ LAM SƠN'}
                </h1>
                <p className="subtitle" style={{ textAlign: 'center', marginBottom: '45px', fontSize: '1.2rem', color: 'rgba(255,255,255,0.85)' }}>
                  Chọn một cách chơi đơn giản bên dưới:
                </p>

                {/* Two Core Feature Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                  
                  {/* Core Feature 1: Free Chat Dialogue */}
                  <div className="menu-card glass-panel" onClick={() => setMode('chat')} style={{ padding: '50px 30px', border: '2px solid rgba(250,204,21,0.5)', cursor: 'pointer' }}>
                    <div className="card-icon" style={{ fontSize: '4.5rem' }}>🗣️</div>
                    <h2 style={{ fontSize: '1.8rem', marginTop: '15px' }}>Nói chuyện & Hỏi đáp</h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>
                      Trò chuyện trực tiếp cùng {character === 'batrieu' ? 'Bà Triệu' : 'Lê Lợi'}. Dễ dàng đặt câu hỏi bằng bàn phím.
                    </p>
                    <button className="btn-primary" style={{ marginTop: '20px', fontSize: '1.2rem', padding: '12px 30px', width: '100%' }}>
                      💬 Bắt Đầu Nói Chuyện
                    </button>
                  </div>

                  {/* Core Feature 2: Visual Novel Story */}
                  <div className="menu-card glass-panel" onClick={() => setMode('vn')} style={{ padding: '50px 30px', border: '2px solid rgba(250,204,21,0.5)', cursor: 'pointer' }}>
                    <div className="card-icon" style={{ fontSize: '4.5rem' }}>📖</div>
                    <h2 style={{ fontSize: '1.8rem', marginTop: '15px' }}>Xem Truyện Nhập Vai</h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>
                      Xem diễn biến câu chuyện lịch sử hào hùng và bấm chọn các quyết định đơn giản trên màn hình.
                    </p>
                    <button className="btn-primary" style={{ marginTop: '20px', fontSize: '1.2rem', padding: '12px 30px', width: '100%' }}>
                      📚 Bắt Đầu Xem Truyện
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ) : mode === 'chat' ? (
            <FreeChatMode character={character} lang="vi" initialPrompt={initialPrompt} ecoMode={ecoMode} setEcoMode={setEcoMode} onBack={() => { setMode(null); setInitialPrompt(null); }} />
          ) : (
            <VisualNovelMode character={character} lang="vi" ecoMode={ecoMode} setEcoMode={setEcoMode} onBack={() => setMode(null)} />
          )}
        </div>
      )}
    </>
  );
}

export default App;
