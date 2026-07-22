import React, { useState, useEffect, useRef } from 'react';

const MAP_LOCATIONS = {
  batrieu: [
    {
      id: 'nua',
      name: 'Ngàn Nưa',
      icon: '🐘',
      x: 60,
      y: 110,
      desc: 'Núi Nưa (Triệu Sơn, Thanh Hóa) - Căn cứ dấy binh oanh liệt của Bà Triệu năm 248. Đỉnh núi thiêng sông Mã hội tụ sinh khí.',
      address: 'Huyện Triệu Sơn, Thanh Hóa',
      modernLabel: 'Đền sơn đỉnh ngày nay',
      ancientLabel: 'Trại binh khởi nghĩa thế kỷ 3',
      modernImg: '/nua_modern.jpg',
      ancientImg: '/nua_ancient.jpg'
    },
    {
      id: 'quanyan',
      name: 'Vùng Quan Yên',
      icon: '🏡',
      x: 130,
      y: 60,
      desc: 'Quê hương của Bà Triệu và anh trai Triệu Quốc Đạt. Nơi sinh ra hai anh hùng kiệt xuất và thu phục Bạch Tượng Một Ngà.',
      address: 'Huyện Yên Định, Thanh Hóa',
      modernLabel: 'Quê hương Quan Yên ngày nay',
      ancientLabel: 'Đất Quan Yên cổ đại thế kỷ 3',
      modernImg: '/quanyennay.jpg',
      ancientImg: '/quanyenxua.jpg'
    },
    {
      id: 'bodien',
      name: 'Phòng Tuyến Bồ Điền',
      icon: '🛡️',
      x: 200,
      y: 130,
      desc: 'Chiến lũy đầm lầy sông ngòi bao quanh kiên cố của nghĩa quân. Chặn đứng đạo binh mã hùng hậu của giặc Ngô.',
      address: 'Huyện Hậu Lộc, Thanh Hóa',
      modernLabel: 'Đồng đầm lũy Bồ Điền nay',
      ancientLabel: 'Lũy chiến chống quân Đông Ngô',
      modernImg: '/bodien_modern.jpg',
      ancientImg: '/bodien_ancient.jpg'
    },
    {
      id: 'tung',
      name: 'Núi Tùng',
      icon: '⛰️',
      x: 270,
      y: 90,
      desc: 'Nơi Bà Triệu tuẫn tiết cuối năm 248 để giữ trọn khí tiết kiêu hùng bất khuất trước quân thù.',
      address: 'Huyện Hậu Lộc, Thanh Hóa',
      modernLabel: 'Lăng mộ Đền Bà Triệu ngày nay',
      ancientLabel: 'Chiến trường Núi Tùng cổ đại',
      modernImg: '/langbatrieu.jpg',
      ancientImg: '/nuitung.jpg'
    }
  ],
  leloi: [
    {
      id: 'lungnhai',
      name: 'Ngàn Lũng Nhai',
      icon: '📜',
      x: 40,
      y: 120,
      desc: 'Nơi Lê Lợi cùng 18 chiến hữu tâm phúc dâng sớ cắt máu kết nghĩa anh em cứu nước tại Hội Thề Lũng Nhai năm 1416.',
      address: 'Huyện Thường Xuân, Thanh Hóa',
      modernLabel: 'Khu di tích Lũng Nhai ngày nay',
      ancientLabel: 'Nơi thề minh ước Lam Sơn xưa',
      modernImg: '/lungnhainay.jpg',
      ancientImg: '/lungnhaixua.jpg'
    },
    {
      id: 'chilinh',
      name: 'Núi Chí Linh',
      icon: '⛰️',
      x: 100,
      y: 50,
      desc: 'Nơi nghĩa quân ẩn mình gian khổ, chịu đói ăn rễ cây rừng. Nơi người anh hùng Lê Lai cải trang hi sinh cứu Chúa công.',
      address: 'Huyện Lang Chánh, Thanh Hóa',
      modernLabel: 'Khu đền thờ Chí Linh ngày nay',
      ancientLabel: 'Căn cứ ẩn quân gian khổ xưa',
      modernImg: '/chilinhnay.jpg',
      ancientImg: '/chilinhxua.jpg'
    },
    {
      id: 'lamson',
      name: 'Đất Lam Sơn',
      icon: '🏰',
      x: 160,
      y: 130,
      desc: 'Nơi phát tích khởi nghĩa Lam Sơn. Đại bản doanh thiêng liêng nơi Lê Lợi chính thức phất cờ xưng Bình Định Vương.',
      address: 'Huyện Thọ Xuân, Thanh Hóa',
      modernLabel: 'Điện Lam Kinh tôn nghiêm nay',
      ancientLabel: 'Đại bản doanh Lam Sơn xưa',
      modernImg: '/lamson_modern.jpg',
      ancientImg: '/lamson_ancient.jpg'
    },
    {
      id: 'chilang',
      name: 'Ải Chi Lăng',
      icon: '⚔️',
      x: 220,
      y: 40,
      desc: 'Cửa ải hiểm trở hiểm yếu. Nơi nghĩa quân phục kích chém đầu An Viễn Hầu Liễu Thăng nhà Minh năm 1427.',
      address: 'Huyện Chi Lăng, Lạng Sơn',
      modernLabel: 'Ải Chi Lăng thanh bình ngày nay',
      ancientLabel: 'Ải phục kích chém Liễu Thăng xưa',
      modernImg: '/chilangnay.JPG',
      ancientImg: '/chilangxua.jpg'
    },
    {
      id: 'hoankiem',
      name: 'Hồ Hoàn Kiếm',
      icon: '🐢',
      x: 280,
      y: 95,
      desc: 'Hồ Tả Vọng xưa. Nơi Vua Lê Thái Tổ ngự thuyền rồng trả lại Gươm Thần Thuận Thiên cho Rùa Vàng năm 1428.',
      address: 'Quận Hoàn Kiếm, Hà Nội',
      modernLabel: 'Tháp Rùa Hồ Gươm ngày nay',
      ancientLabel: 'Vua Lê ngự thuyền trả gươm thần xưa',
      modernImg: '/hoankiem_modern.jpg',
      ancientImg: '/hoankiem_ancient.jpg'
    }
  ]
};

export default function MapPanel({ character, onSelectLocationPrompt }) {
  const locations = MAP_LOCATIONS[character] || MAP_LOCATIONS['batrieu'];
  const [selectedLoc, setSelectedLoc] = useState(locations[0]);
  const [sliderVal, setSliderVal] = useState(50); // Before/After slider position
  const [sliderWidth, setSliderWidth] = useState(280); // Dynamic width tracker

  const sliderRef = useRef(null);

  // Dynamically measure the parent container's actual width to fix the sliding crop issue
  useEffect(() => {
    if (!sliderRef.current) return;
    const updateWidth = () => {
      setSliderWidth(sliderRef.current.offsetWidth);
    };
    
    updateWidth();
    
    // Add event listener to handle resize
    window.addEventListener('resize', updateWidth);
    
    // Re-measure after a small delay to handle any flex animation layout shifts
    const timer = setTimeout(updateWidth, 100);

    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, [selectedLoc]);

  return (
    <div 
      className="glass-panel" 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.2fr 1fr', 
        height: '370px', 
        width: '100%', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        border: '2px solid rgba(250,204,21,0.4)', 
        backgroundColor: 'rgba(15,10,25,0.92)', 
        boxShadow: '0 12px 30px rgba(0,0,0,0.6)'
      }}
    >
      
      {/* LEFT COLUMN: Highly Interactive SVG Map */}
      <div style={{ position: 'relative', borderRight: '1px solid rgba(250,204,21,0.2)', backgroundColor: 'rgba(5,5,10,0.5)', overflow: 'hidden' }}>
        
        {/* Map Header Overlay */}
        <div style={{ position: 'absolute', top: 12, left: 15, zIndex: 10, background: 'rgba(0,0,0,0.7)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(250,204,21,0.3)', fontSize: '0.8rem', color: '#facc15', fontWeight: 'bold', letterSpacing: '1px' }}>
          🗺️ BẢN ĐỒ DI TÍCH LỊCH SỬ TƯƠNG TÁC
        </div>

        {/* SVG Canvas */}
        <svg width="100%" height="100%" viewBox="0 0 320 180" style={{ display: 'block' }}>
          
          {/* Procedural Mountains Outline */}
          <path d="M 10,50 Q 30,30 50,55 T 90,40 T 130,60 T 170,35 T 210,60 T 250,30 T 290,65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
          <path d="M 20,80 Q 50,60 80,85 T 140,70 T 200,90 T 260,65 T 300,95" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
          
          {/* Procedural River Outline */}
          <path d="M 0,140 Q 60,110 110,130 T 210,100 T 280,120 T 320,110" fill="none" stroke="rgba(147,197,253,0.15)" strokeWidth="3" />

          {/* Dotted paths connecting sequence of historical events */}
          {locations.map((loc, i) => {
            if (i === 0) return null;
            const prev = locations[i - 1];
            return (
              <line
                key={`line-${loc.id}`}
                x1={prev.x}
                y1={prev.y}
                x2={loc.x}
                y2={loc.y}
                stroke="rgba(250, 204, 21, 0.35)"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            );
          })}

          {/* Site Node Buttons */}
          {locations.map((loc) => {
            const isSelected = selectedLoc?.id === loc.id;
            return (
              <g
                key={loc.id}
                transform={`translate(${loc.x}, ${loc.y})`}
                onClick={() => setSelectedLoc(loc)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Pulsing Halo */}
                <circle 
                  r={isSelected ? "15" : "11"} 
                  fill={isSelected ? "#eab308" : "#d97706"} 
                  opacity={isSelected ? "0.35" : "0.2"} 
                  className="pulse-circle" 
                />
                
                {/* Core Node Circle */}
                <circle 
                  r="7" 
                  fill={isSelected ? "#fef08a" : "#facc15"} 
                  stroke={isSelected ? "#eab308" : "#fff"} 
                  strokeWidth="2" 
                />
                
                {/* Floating Node Label */}
                <text
                  y="-12"
                  textAnchor="middle"
                  fill={isSelected ? "#fef08a" : "#ffffff"}
                  fontSize="8.5"
                  fontWeight="bold"
                  style={{ 
                    textShadow: '0 2px 4px rgba(0,0,0,0.95)', 
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  {loc.icon} {loc.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* RIGHT COLUMN: Stylized Historical Site Drawer with Before-After Time Lens */}
      <div 
        style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          backgroundColor: 'rgba(25,20,15,0.4)', 
          overflowY: 'auto'
        }}
      >
        {selectedLoc ? (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Ancient Name Header */}
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#facc15', marginBottom: '2px' }}>
              📍 Địa Danh Lịch Sử
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1.25rem', margin: '0 0 2px 0' }}>
              {selectedLoc.icon} {selectedLoc.name}
            </h3>
            
            {/* Address */}
            <p style={{ fontSize: '0.75rem', color: '#93c5fd', margin: '0 0 8px 0' }}>
              🏡 <em>{selectedLoc.address}</em>
            </p>

            {/* 🖼️ Gương Thần Thời Không - Hardware Accelerated Pure CSS clip-path Slider */}
            <div 
              ref={sliderRef}
              style={{ position: 'relative', width: '100%', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(250,204,21,0.35)', marginBottom: '10px', userSelect: 'none' }}
            >
              
              {/* Underlay: Ancient Historical View */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img src={selectedLoc.ancientImg} alt={selectedLoc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 4, right: 8, background: 'rgba(0,0,0,0.65)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', color: '#fef08a', zIndex: 3 }}>
                    🚩 {selectedLoc.ancientLabel}
                  </div>
                </div>
              </div>

              {/* Overlay: Modern Scenery view (masked dynamically using CSS clip-path) */}
              <div 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  clipPath: `inset(0 ${100 - sliderVal}% 0 0)`, 
                  zIndex: 1 
                }}
              >
                <div style={{ width: `${sliderWidth}px`, height: '100%', position: 'relative' }}>
                  <img src={selectedLoc.modernImg} alt={selectedLoc.name} style={{ width: `${sliderWidth}px`, height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 4, left: 8, background: 'rgba(0,0,0,0.65)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', color: '#93c5fd', zIndex: 3 }}>
                    📷 {selectedLoc.modernLabel}
                  </div>
                </div>
              </div>

              {/* Gold Divider Line following the slider thumb */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${sliderVal}%`,
                  width: '2px',
                  background: '#facc15',
                  zIndex: 2,
                  pointerEvents: 'none',
                  boxShadow: '0 0 8px rgba(250,204,21,0.8)'
                }}
              />

              {/* Invisible range input spanning the whole container to handle drags */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderVal} 
                onChange={(e) => setSliderVal(Number(e.target.value))}
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  width: '100%', 
                  height: '100%', 
                  opacity: 0, 
                  cursor: 'ew-resize',
                  zIndex: 4
                }} 
              />
            </div>
            <div style={{ fontSize: '0.7rem', color: '#a8a29e', textAlign: 'center', marginBottom: '8px', fontStyle: 'italic' }}>
              ↔️ Kéo gạt trên ô để xem di tích xưa và nay!
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.45', margin: '0 0 12px 0', flex: 1 }}>
              {selectedLoc.desc}
            </p>

            {/* Action button */}
            <button
              className="btn-primary"
              style={{ 
                fontSize: '0.85rem', 
                padding: '8px 14px', 
                width: '100%', 
                background: 'linear-gradient(90deg, #d97706, #b45309)',
                fontWeight: 'bold'
              }}
              onClick={() => {
                const promptText = `Hãy kể cho ta nghe về lịch sử gắn liền với địa danh: ${selectedLoc.name} (${selectedLoc.address})`;
                onSelectLocationPrompt(promptText);
              }}
            >
              💬 Hỏi AI Về Địa Danh Này
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            Chọn một địa điểm trên bản đồ để xem chi tiết sử tích.
          </div>
        )}
      </div>

    </div>
  );
}
