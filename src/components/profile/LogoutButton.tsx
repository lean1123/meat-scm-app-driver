import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface LogoutButtonProps {
  onPress: () => void;
}

const LogoutButton = ({ onPress }: LogoutButtonProps) => (
  <View className="p-4">
    <View className="bg-white rounded-lg shadow-md">
      <TouchableOpacity onPress={onPress} className="flex-row items-center p-4" activeOpacity={0.7}>
        <Feather name="log-out" size={22} color="#EF4444" />
        <Text className="text-base text-red-500 ml-4 font-semibold">Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default LogoutButton;
