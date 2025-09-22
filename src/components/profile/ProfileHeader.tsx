import React from 'react';
import { Image, Text, View } from 'react-native';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl: string;
}

const ProfileHeader = ({ name, email, avatarUrl }: ProfileHeaderProps) => (
  <View className="items-center p-6 bg-orange-500">
    <Image
      source={{ uri: avatarUrl }}
      className="w-28 h-28 rounded-full border-4 border-white mb-4 mt-6"
    />
    <Text className="text-2xl font-bold text-white">{name}</Text>
    <Text className="text-base text-indigo-200">{email}</Text>
  </View>
);

export default ProfileHeader;
