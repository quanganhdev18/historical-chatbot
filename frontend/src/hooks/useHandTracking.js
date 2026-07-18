import { useState, useEffect, useRef } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export function useHandTracking({ onWaveLeft, onWaveRight, onPinchRelease, cooldownMs = 2000 }) {
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const lastWaveTimeRef = useRef(0);
  const isPinchingRef = useRef(false);
  const pinchStartTimeRef = useRef(0);
  const currentZoneRef = useRef('center');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        if (active) {
          landmarkerRef.current = handLandmarker;
          setIsReady(true);
        }
      } catch (error) {
        console.error("Error initializing MediaPipe HandLandmarker:", error);
      }
    };
    init();
    return () => { active = false; };
  }, []);

  // 2. Start Camera immediately (so the browser asks for permission right away)
  useEffect(() => {
    let stream = null;
    let active = true;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Trình duyệt chặn Camera (Cần HTTPS hoặc localhost)");
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (active && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error("Video play error:", e));
        }
      } catch (err) {
        console.error("Camera error:", err);
        setErrorMsg(err.message || "Lỗi khởi động Camera");
      }
    };
    
    startCamera();

    return () => {
      active = false;
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  // 3. Start prediction loop when both camera is playing and AI is ready
  useEffect(() => {
    if (!isReady || !videoRef.current) return;

    let animationId;
    let lastVideoTime = -1;
    let active = true;

    const predict = () => {
      if (!active) return;
      
      if (videoRef.current && videoRef.current.readyState >= 2) { // Ensure video has data
        if (videoRef.current.currentTime !== lastVideoTime) {
          lastVideoTime = videoRef.current.currentTime;
          try {
            const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
            
            if (results.landmarks && results.landmarks.length > 0) {
              const landmarks = results.landmarks[0];
              const wristX = landmarks[0].x; 
              
              // Tính Palm Size (từ cổ tay đến khớp gốc ngón giữa) làm đơn vị chuẩn để scale (chống nhiễu khi tay ở xa)
              const palmSize = Math.sqrt(
                Math.pow(landmarks[0].x - landmarks[9].x, 2) + 
                Math.pow(landmarks[0].y - landmarks[9].y, 2) +
                Math.pow(landmarks[0].z - landmarks[9].z, 2)
              ) || 0.001;

              // Tính khoảng cách 3D giữa đầu ngón cái (4) và đầu ngón trỏ (8)
              const thumbTip = landmarks[4];
              const indexTip = landmarks[8];
              const pinchDist = Math.sqrt(
                Math.pow(thumbTip.x - indexTip.x, 2) + 
                Math.pow(thumbTip.y - indexTip.y, 2) +
                Math.pow(thumbTip.z - indexTip.z, 2)
              );
              
              const relativePinchDist = pinchDist / palmSize;
              const isCurrentlyPinching = relativePinchDist < 0.3; // Ngưỡng chụm tay tương đối
              const now = Date.now();
              
              // Cập nhật Zone hiện tại với Hysteresis (ngưỡng trễ) chống nhiễu
              let currentZone = currentZoneRef.current;
              
              if (currentZone === 'center') {
                 if (wristX > 0.65) currentZone = 'left';  // Dễ vươn tay sang trái hơn (trước là 0.75)
                 else if (wristX < 0.35) currentZone = 'right'; // Dễ vươn tay sang phải hơn (trước là 0.25)
              } else if (currentZone === 'left') {
                 if (wristX < 0.55) currentZone = 'center'; // Rút tay về gần giữa (0.55) để thoát Left
              } else if (currentZone === 'right') {
                 if (wristX > 0.45) currentZone = 'center'; // Rút tay về gần giữa (0.45) để thoát Right
              }

              const previousZone = currentZoneRef.current;
              currentZoneRef.current = currentZone;
              
              // Chống nhiễu: Phải giữ chụm tay ít nhất 150ms mới tính là Pinch thực sự
              if (isCurrentlyPinching) {
                 if (pinchStartTimeRef.current === 0) pinchStartTimeRef.current = now;
              } else {
                 pinchStartTimeRef.current = 0;
              }
              
              const isSolidPinch = isCurrentlyPinching && (now - pinchStartTimeRef.current > 250);
              
              if (now - lastWaveTimeRef.current > cooldownMs) {
                // Nhận diện hành động chụm rồi THẢ RA (Pinch Release) - Ưu tiên vùng GIỮA khung hình
                if (currentZone === 'center') {
                  if (isPinchingRef.current && !isCurrentlyPinching && relativePinchDist > 0.6) {
                     if (onPinchRelease) onPinchRelease();
                     lastWaveTimeRef.current = now;
                     isPinchingRef.current = false;
                  } else if (isSolidPinch) {
                     isPinchingRef.current = true;
                  }
                } else {
                  isPinchingRef.current = false;
                  pinchStartTimeRef.current = 0;
                }
                
                // Nhận diện ĐƯA TAY sang 2 bên (Edge Triggered - Chỉ kích hoạt khi vừa bước vào vùng)
                if (!isCurrentlyPinching) {
                  if (currentZone === 'left' && previousZone !== 'left') {
                     if (onWaveLeft) onWaveLeft();
                     lastWaveTimeRef.current = now;
                     isPinchingRef.current = false;
                  } 
                  else if (currentZone === 'right' && previousZone !== 'right') {
                     if (onWaveRight) onWaveRight();
                     lastWaveTimeRef.current = now;
                     isPinchingRef.current = false;
                  }
                }
              }
            }
          } catch (e) {
            console.error("Prediction error:", e);
          }
        }
      }
      animationId = requestAnimationFrame(predict);
    };
    
    predict();
    
    return () => {
       active = false;
       cancelAnimationFrame(animationId);
    };
  }, [isReady, onWaveLeft, onWaveRight, onPinchRelease, cooldownMs]);

  return { videoRef, isReady, errorMsg };
}
