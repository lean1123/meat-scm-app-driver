import { EXPO_PUBLIC_WEBSOCKET_URL } from '@env';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { shipmentActions } from '../hooks/useSelectorShipment';
import { useWebSocket } from '../hooks/useSocket';
import { AppDispatch } from '../store/store';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const SocketConnectionManager = ({
  token,
  setConnected,
  showToast,
}: {
  token: string;
  setConnected: (status: boolean) => void;
  showToast: (msg: string) => void;
}) => {
  const WEBSOCKET_URL = EXPO_PUBLIC_WEBSOCKET_URL || 'wss://c300774879d3.ngrok-free.app/api/v1/ws';
  const socketUrl = `${WEBSOCKET_URL}?token=${encodeURIComponent(token)}`;
  const dispatch = useDispatch<AppDispatch>();

  const handleOpen = useCallback(() => {
    setConnected(true);
    showToast('🔌 Kết nối thành công');
  }, [setConnected, showToast]);

  const handleClose = useCallback(() => {
    setConnected(false);
    showToast('❌ Đã ngắt kết nối');
  }, [setConnected, showToast]);

  const handleError = useCallback(() => {
    setConnected(false);
    showToast('⚠️ Lỗi kết nối');
  }, [setConnected, showToast]);

  const handleMessage = useCallback(
    (data: any) => {
      if (data && data.event) {
        switch (data.event) {
          case 'delivery_confirmed':
            console.log('Received delivery_confirmed event:', data.payload);
            dispatch(shipmentActions.stopCompleted(data.payload));
            break;
          default:
            break;
        }
      }
    },
    [dispatch],
  );

  useWebSocket({
    url: socketUrl,
    onOpen: handleOpen,
    onClose: handleClose,
    onError: handleError,
    onMessage: handleMessage,
    heartbeatIntervalMs: 20000,
    maxReconnectAttempts: 5,
  });

  return null;
};

export const useSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { userToken } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToastMessage(msg);
    timeoutRef.current = setTimeout(() => setToastMessage(null), 2000);
  }, []);

  const value = {
    isConnected,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {userToken && (
        <SocketConnectionManager
          token={userToken}
          setConnected={setIsConnected}
          showToast={showToast}
        />
      )}
      {children}
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </WebSocketContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  toastText: { color: '#fff', fontSize: 14 },
});
