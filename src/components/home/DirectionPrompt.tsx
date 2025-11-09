import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface DirectionPromptProps {
  onPress: () => void;
}

const DirectionPrompt: React.FC<DirectionPromptProps> = ({ onPress }) => {
  return (
    <View className="mt-4">
      <Text className="text-gray-700 font-semibold mb-2">
        Would you like to specify direction for deliveries?
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3"
        onPress={onPress}
      >
        <View className="w-3 h-3 rounded-full bg-green-500 mr-3" />
        <Text className="text-gray-400">Where to?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DirectionPrompt;
