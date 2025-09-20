import { useCallback, useEffect, useRef, useState } from 'react';

export type WebSocketReadyState = 0 | 1 | 2 | 3;

export interface UseWebSocketOptions {
  url: string | null;
  protocols?: string | string[];
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: (code?: number, reason?: string) => void;
  onError?: (error: Event) => void;
  maxReconnectAttempts?: number;
  reconnectIntervalMs?: number;
  onReconnectFailed?: () => void;
  heartbeatIntervalMs?: number; // Thêm lại để sử dụng
}

export function useWebSocket(options: UseWebSocketOptions) {
  const {
    url,
    protocols,
    maxReconnectAttempts = 5,
    reconnectIntervalMs = 3000,
    heartbeatIntervalMs = 20000, // Lấy giá trị heartbeat
  } = options;

  const savedOptions = useRef(options);
  useEffect(() => {
    savedOptions.current = options;
  }, [options]);

  const [readyState, setReadyState] = useState<WebSocketReadyState>(WebSocket.CLOSED);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref cho heartbeat

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (heartbeatTimeoutRef.current) clearTimeout(heartbeatTimeoutRef.current); // Dọn dẹp heartbeat
    if (wsRef.current) {
      setReadyState(WebSocket.CLOSING);
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!url) return;
    disconnect();

    setReadyState(WebSocket.CONNECTING);
    try {
      wsRef.current = protocols ? new WebSocket(url, protocols) : new WebSocket(url);

      wsRef.current.onopen = () => {
        reconnectAttemptsRef.current = 0;
        setReadyState(WebSocket.OPEN);
        savedOptions.current.onOpen?.();

        // THÊM LẠI: Bắt đầu gửi heartbeat khi kết nối mở
        heartbeatTimeoutRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            // Gửi một tin nhắn văn bản đơn giản mà server có thể hiểu
            wsRef.current.send('"ping"');
          }
        }, heartbeatIntervalMs);
      };

      wsRef.current.onmessage = (event) => {
        if (event.data === '"pong"') return; // Bỏ qua tin nhắn pong nếu có
        let payload: any = event.data;
        try {
          payload = JSON.parse(event.data);
        } catch (e) {
          /* Ignore */
        }
        savedOptions.current.onMessage?.(payload);
      };

      wsRef.current.onclose = (event) => {
        setReadyState(WebSocket.CLOSED);
        if (heartbeatTimeoutRef.current) clearInterval(heartbeatTimeoutRef.current); // Dừng heartbeat
        savedOptions.current.onClose?.(event.code, event.reason);

        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const timeout = Math.min(
            30000,
            reconnectIntervalMs * Math.pow(2, reconnectAttemptsRef.current),
          );
          reconnectTimeoutRef.current = setTimeout(connect, timeout);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          savedOptions.current.onReconnectFailed?.();
        }
      };

      wsRef.current.onerror = (error) => {
        savedOptions.current.onError?.(error);
      };
    } catch (error) {
      savedOptions.current.onError?.(error as Event);
    }
  }, [url, protocols, maxReconnectAttempts, reconnectIntervalMs, heartbeatIntervalMs, disconnect]);

  const send = useCallback((data: any): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload = typeof data === 'string' ? data : JSON.stringify(data);
      wsRef.current.send(payload);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (url) connect();
    return () => disconnect();
  }, [url, connect, disconnect]);

  return {
    send,
    connect,
    disconnect,
    readyState,
  } as const;
}
