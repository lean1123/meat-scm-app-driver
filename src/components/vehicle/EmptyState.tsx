import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface EmptyStateProps {
  onAddVehicle: () => void;
}

const EmptyState = ({ onAddVehicle }: EmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center p-8 mt-20">
      <Feather name="truck" size={64} color="#9CA3AF" />
      <Text className="text-xl font-bold text-gray-700 mt-6 text-center">
        Bạn chưa có phương tiện nào
      </Text>
      <Text className="text-base text-gray-500 mt-2 text-center mb-8">
        Hãy thêm phương tiện đầu tiên để bắt đầu nhận các chuyến hàng.
      </Text>
      <TouchableOpacity
        onPress={onAddVehicle}
        className="flex-row items-center bg-orange-500 px-6 py-3 rounded-full shadow-lg"
        activeOpacity={0.8}
      >
        <Feather name="plus-circle" size={20} color="white" />
        <Text className="text-white font-bold text-base ml-2">Thêm phương tiện</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyState;
