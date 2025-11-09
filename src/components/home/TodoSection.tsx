import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export type TodoItem = {
  key: string;
  title: string;
  description: string;
  done: boolean;
  onPress: () => void;
};

interface TodoSectionProps {
  items: TodoItem[];
}

const TodoSection: React.FC<TodoSectionProps> = ({ items }) => {
  return (
    <View>
      <Text className="text-base text-gray-800 font-semibold mb-3">Todo</Text>
      {items.map((t) => {
        const bgClass = t.done ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
        const iconName = t.done ? 'check-circle' : 'alert-triangle';
        const iconColor = t.done ? '#16a34a' : '#dc2626';
        const titleColor = t.done ? 'text-green-800' : 'text-red-800';
        const descColor = t.done ? 'text-green-700' : 'text-red-700';
        return (
          <TouchableOpacity
            key={t.key}
            onPress={t.onPress}
            className={`relative border rounded-2xl p-4 mb-3 ${bgClass}`}
            activeOpacity={0.85}
          >
            <View className="flex-row items-start pr-8">
              <Feather name={iconName as any} size={20} color={iconColor} />
              <View className="ml-2 flex-1">
                <Text className={`text-base font-semibold ${titleColor}`}>{t.title}</Text>
                <Text className={`text-sm mt-1 ${descColor}`}>{t.description}</Text>
              </View>
            </View>
            <View className="absolute right-3 top-4">
              <Feather name="chevron-right" size={20} color={iconColor} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TodoSection;
