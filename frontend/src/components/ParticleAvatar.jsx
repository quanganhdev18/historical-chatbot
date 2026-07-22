import React, { useRef, useEffect } from 'react';

export default function ParticleAvatar({ character, ecoMode = false }) {
  const canvasRef = useRef(null);

  const glowColor = character === 'batrieu' ? 'rgba(217, 119, 6, 0.4)' : 'rgba(250, 204, 21, 0.4)';

  useEffect(() => {
    if (ecoMode) return; // Skip animation calculations in Eco Mode
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Kích thước canvas
    const width = 45;
    const height = 45;
    canvas.width = width;
    canvas.height = height;

    // Cài đặt quả cầu
    const radius = 16;
    const particles = [];
    const numParticles = 60; // Số lượng điểm

    // Sử dụng thuật toán Fibonacci Sphere để phân bố đều các điểm trên mặt cầu
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numParticles; i++) {
      const y = 1 - (i / (numParticles - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      particles.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
      });
    }

    let rotationX = 0;
    let rotationY = 0;
    let isHovered = false;

    // Màu sắc theo nhân vật
    const colorRGB = character === 'batrieu' ? { r: 217, g: 119, b: 6 } : { r: 250, g: 204, b: 21 };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Xoay tự động, tăng tốc khi di chuột vào
      rotationY += isHovered ? 0.08 : 0.02;
      rotationX += isHovered ? 0.04 : 0.01;

      // Project 3D sang 2D
      const projected = [];

      particles.forEach(p => {
        // Xoay trục X
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;

        // Xoay trục Y
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        let x2 = p.x * cosY + z1 * sinY;
        let z2 = -p.x * sinY + z1 * cosY;

        // Phối cảnh (Perspective)
        const focalLength = 35;
        const scale = focalLength / (focalLength + z2);
        const px = cx + x2 * scale;
        const py = cy + y1 * scale;

        projected.push({ px, py, z2, scale });
      });

      // Sắp xếp theo trục Z để vẽ điểm xa trước, gần sau (Z-buffer thủ công)
      projected.sort((a, b) => b.z2 - a.z2);

      // Vẽ lưới (Lines) giữa các điểm gần nhau để tạo cảm giác lưới không gian
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = dx * dx + dy * dy;
          if (dist < 80) { // Vẽ vạch nếu khoảng cách gần
            const alpha = Math.max(0, 1 - dist / 80) * 0.5;
            ctx.strokeStyle = `rgba(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Vẽ các điểm (Dots)
      projected.forEach(p => {
        ctx.beginPath();
        // Điểm ở gần thì rõ hơn, ở xa mờ hơn
        const alpha = Math.max(0.1, (p.z2 + radius) / (radius * 2));
        ctx.arc(p.px, p.py, 1.2 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, ${alpha})`;
        ctx.fill();
        
        // Thêm hiệu ứng glow cho điểm ở gần
        if (p.z2 < 0) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = `rgb(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b})`;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseEnter = () => isHovered = true;
    const handleMouseLeave = () => isHovered = false;

    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [character, ecoMode]);

  if (ecoMode) {
    const symbol = character === 'batrieu' ? '🐘' : '👑';
    return (
      <div style={{ 
        width: '45px', 
        height: '45px', 
        borderRadius: '50%', 
        background: 'rgba(0,0,0,0.6)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        boxShadow: `0 0 15px ${glowColor}`,
        flexShrink: 0,
        fontSize: '1.4rem'
      }}>
        {symbol}
      </div>
    );
  }

  return (
    <div style={{ 
      width: '45px', 
      height: '45px', 
      borderRadius: '50%', 
      background: 'rgba(0,0,0,0.6)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      boxShadow: `0 0 15px ${glowColor}`,
      flexShrink: 0
    }}>
      <canvas ref={canvasRef} style={{ cursor: 'pointer', display: 'block' }} />
    </div>
  );
}
