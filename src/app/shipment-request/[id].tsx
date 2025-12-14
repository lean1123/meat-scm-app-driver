import { acceptBidTransport } from '@/src/api/bidApi';
import { removeRequest } from '@/src/hooks/useShipmentRequestSlice';
import { RootState } from '@/src/store/store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const ShipmentRequestDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const request = useSelector((state: RootState) =>
    state.shipmentRequest.requests.find((req) => req.bidID === id),
  );

  const handleAccept = async () => {
    if (!request) return;
    try {
      const res = await acceptBidTransport(request.bidID);
      console.log('Bid accepted:', res);
      if (res.status !== 200) {
        Alert.alert('Thất bại', 'Đã xảy ra lỗi khi chấp nhận chuyến hàng!');
        throw new Error('Failed to accept bid');
      }
      Alert.alert('Thành công', 'Bạn đã chấp nhận chuyến hàng!');
    } catch (error) {
      console.error('Error accepting bid:', error);
      // Vẫn loại bỏ yêu cầu khỏi danh sách ngay cả khi thất bại
      Alert.alert('Đã ghi nhận', 'Yêu cầu đã được xử lý cục bộ.');
    } finally {
      // Luôn xóa khỏi danh sách để UI cập nhật ngay lập tức
      dispatch(removeRequest({ bidID: request.bidID }));
      router.replace('/(tabs)/shipments');
    }
  };

  const handleReject = () => {
    if (!request) return;
    setTimeout(() => {
      Alert.alert('Thông báo', 'Bạn đã từ chối chuyến hàng.');
      dispatch(removeRequest({ bidID: request.bidID }));
      router.back();
    }, 500);
  };

  if (!request) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Không có yêu cầu nào hoặc yêu cầu đã được xử lý.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white p-4 rounded-lg shadow">
          <Text className="text-lg font-semibold">Mã chuyến: {request.shipmentID}</Text>
          <Text>Loại: {request.shipmentType}</Text>
          <Text>Điểm đi: {request.stops[0].facilityID}</Text>
          <Text>Điểm đến: {request.stops[request.stops.length - 1].facilityID}</Text>
        </View>
      </ScrollView>

      <View className="flex-row p-4 border-t border-gray-200 bg-white">
        <TouchableOpacity onPress={handleReject} className="flex-1 bg-red-500 p-4 rounded-lg mr-2">
          <Text className="text-white font-bold text-center">Từ chối</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAccept}
          className="flex-1 bg-green-500 p-4 rounded-lg ml-2"
        >
          <Text className="text-white font-bold text-center">Chấp nhận</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ShipmentRequestDetailScreen;
