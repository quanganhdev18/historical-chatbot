import React, { useState } from 'react';
import FreeChatMode from './components/FreeChatMode';
import VisualNovelMode from './components/VisualNovelMode';

function App() {
  const [character, setCharacter] = useState(null); // 'batrieu' or 'leloi'
  const [mode, setMode] = useState(null);

  if (!character) {
    return (
      <div className="split-screen-container">
        {/* BÀ TRIỆU */}
        <div className="split-pane split-batrieu" onClick={() => setCharacter('batrieu')}>
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
        <div className="split-pane split-leloi" onClick={() => setCharacter('leloi')}>
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
    );
  }

  // Once character is selected, show mode selection or the active mode
  return (
    <div className={`app-container theme-${character}`}>
      <div className="background-overlay"></div>
      
      {!mode ? (
        <div className="menu-container">
          <button className="btn-primary" style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }} onClick={() => setCharacter(null)}>
            ← Đổi Nhân Vật
          </button>
          
          <div className="menu-content">
            <h1 className="title text-gradient" style={{ textAlign: 'center', marginBottom: '10px' }}>
              {character === 'batrieu' ? 'TRUYỀN THUYẾT BÀ TRIỆU' : 'HÀO KHÍ LAM SƠN'}
            </h1>
            <p className="subtitle" style={{ textAlign: 'center', marginBottom: '50px' }}>
              Chọn hình thức để trải nghiệm
            </p>
            
            <div className="menu-cards">
              <div className="menu-card glass-panel" onClick={() => setMode('chat')}>
                <div className="card-icon">🗣️</div>
                <h2>Đàm Đạo Tự Do</h2>
                <p>Trò chuyện trực tiếp với {character === 'batrieu' ? 'Bà Triệu' : 'Lê Lợi'}. Hỏi đáp về binh pháp, triết lý và những góc khuất lịch sử.</p>
              </div>
              
              <div className="menu-card glass-panel" onClick={() => setMode('vn')}>
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
        <VisualNovelMode character={character} onBack={() => setMode(null)} />
      )}
    </div>
  );
}

export default App;
