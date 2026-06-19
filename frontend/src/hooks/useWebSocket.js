import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocket(url, onAudioChunk) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isReceiving, setIsReceiving] = useState(false);
  const wsRef = useRef(null);
  const currentBotMessageRef = useRef("");

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    wsRef.current.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      setIsReceiving(false);
      // Optional: implement retry logic here
    };

    wsRef.current.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        if (payload.type === 'text') {
          currentBotMessageRef.current += payload.data;
          setMessages(prev => {
            const newMessages = [...prev];
            // If the last message is from the bot, update it
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].sender === 'bot') {
              newMessages[newMessages.length - 1].text = currentBotMessageRef.current;
            } else {
              // Otherwise add a new bot message
              newMessages.push({ id: Date.now(), sender: 'bot', text: currentBotMessageRef.current });
            }
            return newMessages;
          });
        } else if (payload.type === 'audio') {
          if (onAudioChunk) {
            onAudioChunk(payload.data);
          }
        } else if (payload.type === 'done') {
          setIsReceiving(false);
        }
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };
  }, [url, onAudioChunk]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((text) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Add user message to UI
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
      // Clear current bot message builder
      currentBotMessageRef.current = "";
      setIsReceiving(true);
      // Send to server
      wsRef.current.send(text);
    } else {
      console.error("WebSocket is not connected");
    }
  }, []);

  return { isConnected, messages, sendMessage, isReceiving };
}
