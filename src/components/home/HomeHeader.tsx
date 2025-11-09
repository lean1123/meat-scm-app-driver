import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface HomeHeaderProps {
  name: string;
  avatarUrl: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ name, avatarUrl }) => {
  const route = useRouter();
  return (
    <View className="w-full h-36 bg-orange-500 top-0 rounded-b-2xl shadow-md">
      <TouchableOpacity
        className="flex-row items-center absolute top-10 left-5 bg-white p-2 rounded-full shadow-md"
        onPress={() => route.push('/profile')}
      >
        <Image src={avatarUrl} className="w-10 h-10 rounded-full mr-2" />
        <Text className="font-semibold">Xin chào! {name}</Text>
      </TouchableOpacity>
      <View className="mt-28" />
    </View>
  );
};

export default HomeHeader;
