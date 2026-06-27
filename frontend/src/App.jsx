import React, { useState } from 'react';
import FreeChatMode from './components/FreeChatMode';
import VisualNovelMode from './components/VisualNovelMode';

function App() {
  const [character, setCharacter] = useState(null); // 'batrieu' or 'leloi'
  const [mode, setMode] = useState(null);

  if (!character) {
    return (
      <div className="character-select-container theme-batrieu">
        <h1 className="text-gradient" style={{ fontSize: '3rem', textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>
          CHỌN NHÂN VẬT
        </h1>
        <div className="character-cards">
          <div className="char-card glass-panel" onClick={() => setCharacter('batrieu')}>
            <div className="char-avatar" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Lady_Trieu_Au.jpg/250px-Lady_Trieu_Au.jpg)' }}></div>
            <h2 className="char-name">BÀ TRIỆU</h2>
            <p className="char-desc">Nữ anh hùng dân tộc thế kỷ 3. Cưỡi voi trắng dấy binh khởi nghĩa ở núi Nưa chống ách đô hộ Đông Ngô.</p>
          </div>
          
          <div className="char-card glass-panel" onClick={() => setCharacter('leloi')} style={{ borderColor: '#eab308' }}>
            <div className="char-avatar" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/T%C6%B0%E1%BB%A3ng_%C4%91%C3%A0i_L%C3%AA_L%E1%BB%A3i.jpg/220px-T%C6%B0%E1%BB%A3ng_%C4%91%C3%A0i_L%C3%AA_L%E1%BB%A3i.jpg)', borderColor: '#eab308', boxShadow: '0 0 20px rgba(234, 179, 8, 0.4)' }}></div>
            <h2 className="char-name" style={{ color: '#eab308' }}>LÊ LỢI</h2>
            <p className="char-desc">Bình Định Vương thế kỷ 15. Lãnh đạo Khởi nghĩa Lam Sơn đại phá giặc Minh, lập nên triều Hậu Lê huy hoàng.</p>
          </div>
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
