import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext'; // <-- Điều chỉnh đường dẫn nếu cần
import { loginUser } from '../hooks/authSlice';
import { AppDispatch, RootState } from '../store/store';

const LoginScreen = () => {
  const { login } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, token } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('driver.a@carrier.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (status === 'succeeded' && token) {
      login(token);
    }
    if (status === 'failed' && error) {
      Alert.alert('Đăng nhập thất bại', error);
    }
  }, [status, token, error, login]);

  const isLoading = status === 'loading';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center p-6">
          <Image
            source={{
              uri: 'https://res.cloudinary.com/lean1123/image/upload/v1756917105/vor-scm-driver-logo.896Z_lxxmlc.png',
            }}
            className="w-24 h-24 mb-8"
          />
          <Text className="text-3xl font-bold text-gray-800">Chào mừng trở lại!</Text>
          <Text className="text-base text-gray-500 mb-10">Đăng nhập để tiếp tục</Text>

          <View className="w-full">
            <TextInput
              className="bg-white border border-gray-300 text-gray-900 text-base rounded-lg p-4 w-full mb-4 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Email của bạn"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              className="bg-white border border-gray-300 text-gray-900 text-base rounded-lg p-4 w-full mb-6 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`w-full rounded-lg py-4 ${isLoading ? 'bg-orange-600' : 'bg-orange-500'}`}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">Đăng nhập</Text>
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between w-full mt-4">
            <TouchableOpacity>
              <Text className="text-orange-600 font-semibold">Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push('/register');
              }}
            >
              <Text className="text-orange-600 font-semibold">Tạo tài khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
