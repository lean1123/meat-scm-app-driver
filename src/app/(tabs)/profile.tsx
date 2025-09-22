import LogoutButton from '@/src/components/profile/LogoutButton';
import MenuList, { MenuItem } from '@/src/components/profile/MenuList';
import ProfileHeader from '@/src/components/profile/ProfileHeader';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView } from 'react-native';

const menuItems: MenuItem[] = [
  { icon: 'edit', title: 'Chỉnh sửa hồ sơ', screen: '/(tabs)/profile/edit' },
  { icon: 'settings', title: 'Cài đặt', screen: '/(tabs)/settings' },
  { icon: 'truck', title: 'Quản lý phương tiện', screen: '/vehicle-management' },
];

const userData = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@driver.com',
};

const ProfileScreen = () => {
  const { handleLogoutFromContext } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'OK', onPress: handleLogoutFromContext },
    ]);
  };

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.screen) {
      router.push(item.screen as `http${string}`);
    } else {
      Alert.alert('Thông báo', `Chức năng "${item.title}" đang được phát triển.`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <ProfileHeader
          name={userData.name}
          email={userData.email}
          avatarUrl={`https://i.pravatar.cc/150?u=${userData.email}`}
        />
        <MenuList items={menuItems} onItemPress={handleMenuItemPress} />
        <LogoutButton onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
