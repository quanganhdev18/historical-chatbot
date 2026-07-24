import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocket(url) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isReceiving, setIsReceiving] = useState(false);
  const wsRef = useRef(null);
  const currentBotMessageRef = useRef("");
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    wsRef.current.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      setIsReceiving(false);
      
      const delay = Math.min(1000 * (1.5 ** reconnectAttempts.current), 30000);
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log(`Reconnecting WebSocket... Attempt ${reconnectAttempts.current + 1}`);
        reconnectAttempts.current += 1;
        connect();
      }, delay);
    };

    wsRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        if (payload.type === 'text') {
          currentBotMessageRef.current += payload.data;
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].sender === 'bot') {
              newMessages[newMessages.length - 1].text = currentBotMessageRef.current;
            } else {
              newMessages.push({ id: Date.now(), sender: 'bot', text: currentBotMessageRef.current, sources: [] });
            }
            return newMessages;
          });
        } else if (payload.type === 'sources') {
          // Attach sources to the currently streaming bot message
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].sender === 'bot') {
              newMessages[newMessages.length - 1].sources = payload.sources || [];
            }
            return newMessages;
          });
        } else if (payload.type === 'done') {
          setIsReceiving(false);
        }
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        // Prevent reconnect on intentional unmount
        wsRef.current.onclose = null;
        if (wsRef.current.readyState === 1) { // OPEN
          wsRef.current.close();
        } else if (wsRef.current.readyState === 0) { // CONNECTING
          // Wait for it to open before closing to avoid console errors in Strict Mode
          wsRef.current.onopen = () => wsRef.current.close();
        }
      }
    };
  }, [connect]);

  const sendMessage = useCallback((text, extraPayload = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
      currentBotMessageRef.current = "";
      setIsReceiving(true);
      
      const payload = {
        text,
        ...extraPayload
      };
      wsRef.current.send(JSON.stringify(payload));
    } else {
      console.error("WebSocket is not connected");
    }
  }, []);

  return { isConnected, messages, sendMessage, isReceiving };
}
