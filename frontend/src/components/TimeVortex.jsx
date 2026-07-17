import React, { useEffect, useRef } from 'react';

export default function TimeVortex({ character }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    const numStars = 800; // Số lượng vệt sáng
    const stars = [];
    const fov = canvas.width;
    
    // Tinh chỉnh màu sắc tinh tế hơn cho từng nhân vật
    // Bà Triệu: Cam hổ phách sáng
    // Lê Lợi: Vàng hoàng kim chói loà
    const r = character === 'batrieu' ? 255 : 255;
    const g = character === 'batrieu' ? 140 : 215;
    const b = character === 'batrieu' ? 20 : 0;
    
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 4000,
        y: (Math.random() - 0.5) * 4000,
        z: Math.random() * 2000 + 10,
        speed: Math.random() * 3 + 1
      });
    }
    
    let time = 0;
    let warpSpeedMultiplier = 0.5;

    const render = () => {
      // Hiệu ứng lưu ảnh motion blur (Trail effect)
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(2, 2, 5, 0.3)'; // Nền đen sâu thẳm
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Chế độ pha trộn màn hình (Screen) để màu sắc rực rỡ và phát sáng
      ctx.globalCompositeOperation = 'screen';
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      time += 0.02;
      
      // Gia tốc bùng nổ theo cấp số nhân (Hiệu ứng Hyperspace)
      warpSpeedMultiplier *= 1.05;
      if (warpSpeedMultiplier > 150) warpSpeedMultiplier = 150;
      
      stars.forEach(s => {
        const pz = s.z;
        s.z -= s.speed * warpSpeedMultiplier;
        
        // Reset ngôi sao khi bay vượt qua màn hình
        if (s.z <= 0) {
          s.z = 2000;
          s.x = (Math.random() - 0.5) * 4000;
          s.y = (Math.random() - 0.5) * 4000;
          s.speed = Math.random() * 3 + 1;
        }
        
        // Chiếu hệ toạ độ 3D sang 2D (Perspective Projection)
        const px = cx + (s.x / s.z) * fov;
        const py = cy + (s.y / s.z) * fov;
        
        const ppx = cx + (s.x / pz) * fov;
        const ppy = cy + (s.y / pz) * fov;
        
        ctx.beginPath();
        ctx.moveTo(ppx, ppy);
        ctx.lineTo(px, py);
        
        // Càng gần màn hình thì vệt sáng càng to và rõ
        const depth = 1 - (s.z / 2000);
        ctx.lineWidth = Math.max(0.1, depth * 6);
        ctx.lineCap = 'round';
        
        // Lõi vệt sáng màu trắng, viền ngoài màu của nhân vật
        const currentR = Math.floor(r + (255 - r) * depth * 0.5);
        const currentG = Math.floor(g + (255 - g) * depth * 0.5);
        const currentB = Math.floor(b + (255 - b) * depth * 0.5);
        
        ctx.strokeStyle = `rgba(${currentR}, ${currentG}, ${currentB}, ${depth})`;
        ctx.stroke();
      });
      
      // Trả lại composite để vẽ tâm hố đen thời gian
      ctx.globalCompositeOperation = 'source-over';
      const coreSize = Math.min(150, time * 30);
      
      // Hào quang toả ra từ tâm
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize * 2);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.1, `rgba(${r}, ${g}, ${b}, 1)`);
      gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.3)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(cx, cy, coreSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Tâm hố đen hư vô
      ctx.beginPath();
      ctx.arc(cx, cy, coreSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.9)';
      ctx.fill();

      // Sóng xung kích (Shockwaves)
      if (warpSpeedMultiplier > 10 && warpSpeedMultiplier < 140) {
         ctx.beginPath();
         const waveRadius = coreSize + (warpSpeedMultiplier * 10);
         ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
         ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.5 - warpSpeedMultiplier/300})`;
         ctx.lineWidth = 5;
         ctx.stroke();
      }
      
      // Chớp loé trắng xoá (White Flash Out) khi kết thúc chuyển cảnh
      if (warpSpeedMultiplier > 120) {
        const flashAlpha = Math.min(1, (warpSpeedMultiplier - 120) / 30);
        ctx.fillStyle = `rgba(255,255,255, ${flashAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [character]);
  
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      zIndex: 9999, background: 'black',
      animation: 'vortexLife 2.1s ease-in forwards' 
    }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <style>{`
        @keyframes vortexLife {
          0% { opacity: 0; }
          15% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes textGlowInward {
          0% { 
            text-shadow: 0 0 10px rgba(255,255,255,0); 
            letter-spacing: -10px; 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.5); 
          }
          30% { 
            text-shadow: 0 0 30px rgba(255,255,255,0.8); 
            letter-spacing: 15px; 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1); 
          }
          80% { 
            text-shadow: 0 0 60px rgba(255,255,255,1), 0 0 100px rgba(250,204,21,1); 
            letter-spacing: 40px; 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.5); 
          }
          100% { 
            text-shadow: 0 0 150px rgba(255,255,255,1); 
            letter-spacing: 80px; 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(3); 
          }
        }
      `}</style>
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        color: 'white', fontFamily: '"Playfair Display", serif', fontSize: '3rem', 
        fontWeight: '900', textAlign: 'center', pointerEvents: 'none',
        animation: 'textGlowInward 2.1s cubic-bezier(0.1, 0, 0.3, 1) forwards',
        whiteSpace: 'nowrap', textTransform: 'uppercase'
      }}>
        Du Hành Quá Khứ
      </div>
    </div>
  );
}
