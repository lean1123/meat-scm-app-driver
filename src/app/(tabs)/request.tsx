import { formatTimestamp } from '@/src/hellpers/formatter';
import { RootState } from '@/src/store/store';
import { TransportBid } from '@/src/types/bid';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

const RequestCard = ({ item, onPress }: { item: TransportBid; onPress: () => void }) => {
  const createdRaw = (item as any).createAt ?? item.createdAt ?? (item as any).createDate;
  const createdText = createdRaw ? formatTimestamp(createdRaw) : '—';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-lg shadow mb-4"
      activeOpacity={0.7}
    >
      <Text className="font-bold text-xl text-gray-900">{item.bidID}</Text>
      <Text className="text-base text-gray-700 mt-1">Loại: {item.shipmentType}</Text>
      <Text className="text-base text-gray-700">Số điểm dừng: {item.stops.length}</Text>
      <Text className="text-sm text-gray-600 mt-2">Ngày tạo: {createdText}</Text>
    </TouchableOpacity>
  );
};

const ShipmentRequestListScreen = () => {
  const router = useRouter();
  const { requests } = useSelector((state: RootState) => state.shipmentRequest);

  if (requests.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-500">Không có yêu cầu nào đang chờ.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 border-b border-gray-200 bg-white">
        <Text className="text-3xl font-extrabold text-gray-900 text-center">
          Yeu Cau Van Chuyen
        </Text>
      </View>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.bidID}
        renderItem={({ item }) => (
          <RequestCard item={item} onPress={() => router.push(`/shipment-request/${item.bidID}`)} />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

export default ShipmentRequestListScreen;
