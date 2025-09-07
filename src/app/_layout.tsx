import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
  }, [userToken, isLoading, loaded, segments, router]);

  if (isLoading || !loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
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
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
