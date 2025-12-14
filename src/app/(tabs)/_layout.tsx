import { RootState } from '@/src/store/store';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const TabBarIconWithBadge = ({
  name,
  color,
  size,
}: {
  name: keyof typeof Feather.glyphMap;
  color: string;
  size: number;
}) => {
  const requestCount = useSelector((state: RootState) => state.shipmentRequest.requests.length);

  return (
    <View>
      <Feather name={name} size={size} color={color} />
      {requestCount > 0 && (
        <View className="absolute -right-2 -top-1 bg-red-500 rounded-full w-4 h-4 justify-center items-center">
          <Text className="text-white text-xs font-bold">{requestCount}</Text>
        </View>
      )}
    </View>
  );
};

export default function TabLayout() {
  // const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size }) => <Ionicons name="home" size={size} color="white" />,
        }}
      />

      <Tabs.Screen
        name="shipments"
        options={{
          tabBarIcon: ({ size }) => <Feather name="truck" size={size} color="white" />,
        }}
      />

      <Tabs.Screen
        name="request"
        options={{
          title: 'Yeu Cau Van Chuyen',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TabBarIconWithBadge name="bell" color={'#fff'} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size }) => <Ionicons name="person" size={size} color="white" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'relative',
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: '#f97316',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  qrContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
});
