import { useRef, useCallback, useState, useEffect } from 'react';

export function useAudioStream() {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const queueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const [volume, setVolume] = useState(0);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  const playNextInQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const buffer = queueRef.current.shift();
    
    if (audioContextRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      source.onended = () => {
        playNextInQueue();
      };
      source.start();
    } else {
      isPlayingRef.current = false;
    }
  }, []);

  const playAudioChunk = useCallback(async (base64Chunk) => {
    initAudio();
    try {
      // Convert base64 to ArrayBuffer
      const binaryString = window.atob(base64Chunk);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
      queueRef.current.push(audioBuffer);
      
      if (!isPlayingRef.current) {
        playNextInQueue();
      }
    } catch (e) {
      console.error("Error decoding audio chunk", e);
      // It's a mock, we expect decoding to fail if the backend sends dummy bytes that aren't real WAVs.
    }
  }, [initAudio, playNextInQueue]);

  useEffect(() => {
    let animationFrameId;
    const updateVolume = () => {
      if (analyserRef.current && dataArrayRef.current && isPlayingRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        let sum = 0;
        for(let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        setVolume(sum / dataArrayRef.current.length);
      } else {
        setVolume(0);
      }
      animationFrameId = requestAnimationFrame(updateVolume);
    };
    updateVolume();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return { playAudioChunk, initAudio, volume };
}
