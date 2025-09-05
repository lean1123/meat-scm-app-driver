import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FormInput from '../components/FormInput';

// Kiểu dữ liệu cho các lỗi form
type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const RegisterScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = 'Họ và tên không được để trống.';
    if (!email.trim()) {
      newErrors.email = 'Email không được để trống.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ.';
    }
    if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    setErrors(newErrors);
    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return; // Dừng lại nếu form không hợp lệ
    }

    setIsLoading(true);

    // Giả lập một cuộc gọi API đăng ký mất 1.5 giây
    setTimeout(() => {
      console.log('Đăng ký với thông tin:', { name, email, password });

      setIsLoading(false);

      // Hiển thị thông báo thành công và điều hướng
      Alert.alert('Thành công', 'Tài khoản của bạn đã được tạo thành công!', [
        {
          text: 'OK',
          onPress: () => router.replace('/login'), // Dùng replace để người dùng không back lại trang đăng ký
        },
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center p-6">
            {/* Logo hoặc hình ảnh */}
            <Image
              source={{
                uri: 'https://res.cloudinary.com/lean1123/image/upload/v1756917105/vor-scm-driver-logo.896Z_lxxmlc.png',
              }} // Thay bằng logo của bạn
              className="w-20 h-20 mb-6"
            />

            {/* Tiêu đề */}
            <Text className="text-3xl font-bold text-gray-800">Tạo tài khoản mới</Text>
            <Text className="text-base text-gray-500 mb-8">Bắt đầu hành trình của bạn</Text>

            {/* Form đăng ký */}
            <View className="w-full">
              <FormInput
                className={`bg-white border text-gray-900 text-base rounded-lg p-4 w-full ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Họ và tên"
                value={name}
                onChangeText={setName}
                error={errors.name}
              />
              <FormInput
                className={`bg-white border text-gray-900 text-base rounded-lg p-4 w-full mt-4 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Email của bạn"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                keyboardType="email-address"
              />
              <FormInput
                className={`bg-white border text-gray-900 text-base rounded-lg p-4 w-full mt-4 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
              />
              <FormInput
                className={`bg-white border text-gray-900 text-base rounded-lg p-4 w-full mt-4 mb-6 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
                secureTextEntry
              />

              {/* Nút Đăng ký */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading}
                className={`w-full rounded-lg py-4 ${isLoading ? 'bg-orange-400' : 'bg-orange-600'}`}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-bold text-lg">Đăng ký</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Liên kết quay lại Đăng nhập */}
            <View className="flex-row justify-center w-full mt-6">
              <Text className="text-gray-500">Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-orange-600 font-semibold">Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
