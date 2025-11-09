import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setupResponseInterceptor } from '../api/axiosClient';
import { fetchUserProfile, logout } from '../hooks/authSlice';
import { AppDispatch } from '../store/store';

interface AuthContextType {
  login: (token: string) => Promise<void>;
  handleLogoutFromContext: () => Promise<void>;
  handleLogoutFromInvalidToken: () => Promise<void>;
  userToken: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Khi app khởi động, đọc token từ SecureStore
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setUserToken(token);
          // Fetch lại profile nếu có token
          await dispatch(fetchUserProfile());
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, [dispatch]);

  // ✅ Hàm login: lưu token, fetch profile, đảm bảo hoàn tất
  const login = async (token: string) => {
    try {
      setIsLoading(true);
      setUserToken(token);
      await SecureStore.setItemAsync('userToken', token);
      await dispatch(fetchUserProfile());
    } catch (err) {
      console.error('Error during login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Logout khi người dùng bấm "Đăng xuất"
  const handleLogoutFromContext = async () => {
    try {
      setUserToken(null);
      await dispatch(logout());
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userID');
      await SecureStore.deleteItemAsync('username');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // ✅ Logout khi token hết hạn hoặc API 401
  const handleLogoutFromInvalidToken = async () => {
    try {
      setUserToken(null);
      await SecureStore.deleteItemAsync('userToken');
    } catch (err) {
      console.error('Error handling invalid token:', err);
    }
  };

  // ✅ Cài interceptor để tự logout khi gặp lỗi token
  useEffect(() => {
    setupResponseInterceptor(handleLogoutFromInvalidToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        handleLogoutFromContext,
        handleLogoutFromInvalidToken,
        userToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
