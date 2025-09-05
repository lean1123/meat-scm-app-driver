import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { store } from '../store/store';

const InitialLayout = () => {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (isLoading || !loaded) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (!userToken && inTabsGroup) {
      router.replace('/login');
    } else if (userToken && !inTabsGroup) {
      const inAuthRoutes = segments.includes('login') || segments.includes('register');
      if (inAuthRoutes) {
        router.replace('/(tabs)');
      }
    }
  }, [userToken, isLoading, loaded, segments]);

  // Hiển thị màn hình chờ trong khi auth hoặc font đang được tải
  if (isLoading || !loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Khi đã sẵn sàng, hiển thị Stack Navigator của bạn
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="confirmation"
          options={{
            title: 'Xác nhận giao hàng',
          }}
        />
        {/* Thêm các màn hình công khai ở đây để chúng không bị ẩn */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

// Component RootLayout gốc giờ đây chỉ làm nhiệm vụ cung cấp Context
export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </Provider>
  );
}
