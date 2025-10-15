import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AuthApi } from '../api/authApi';
import { setupResponseInterceptor } from '../api/axiosClient';
import { logout } from '../hooks/authSlice';
import { AppDispatch } from '../store/store';

interface AuthContextType {
  login: (token: string) => void;
  handleLogoutFromContext: () => void;
  userToken: string | null;
  userID: string | null;
  isLoading: boolean;
  handleLogoutFromInvalidToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');

        setUserToken(token);

        if (token) {
          const id = await AuthApi.profile();
          setUserID(id.fabricEnrollmentID);
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (token: string) => {
    setUserToken(token);
    await SecureStore.setItemAsync('userToken', token);
  };

  const handleLogoutFromContext = async () => {
    setUserToken(null);
    await dispatch(logout());
  };

  const handleLogoutFromInvalidToken = async () => {
    setUserToken(null);
    await SecureStore.deleteItemAsync('userToken');
  };

  useEffect(() => {
    setupResponseInterceptor(handleLogoutFromInvalidToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        handleLogoutFromContext,
        userToken,
        userID,
        isLoading,
        handleLogoutFromInvalidToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
