import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export type MenuItem = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  screen?: string;
  color?: string;
};

interface MenuListProps {
  items: MenuItem[];
  onItemPress: (item: MenuItem) => void;
}

const MenuList = ({ items, onItemPress }: MenuListProps) => (
  <View className="p-4">
    <View className="bg-white rounded-lg shadow-md">
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onItemPress(item)}
          className={`flex-row items-center p-4 ${
            index < items.length - 1 ? 'border-b border-gray-200' : ''
          }`}
          activeOpacity={0.7}
        >
          <Feather name={item.icon} size={22} color={item.color || '#4B5563'} />
          <Text className="text-base text-gray-800 ml-4 flex-1">{item.title}</Text>
          <Feather name="chevron-right" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default MenuList;
