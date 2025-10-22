import { getShipmentByDriverId } from '@/src/api/driverApi';
import { useAuth } from '@/src/context/AuthContext';
import { ShipmentResponse } from '@/src/types/shipment';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import '../../../global.css';
import TripItem from '../../components/confirmation/TripItem';

export default function HomeScreen() {
  const [tab, setTab] = useState('Đang cần giao');
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userID } = useAuth();

  const fetchShipmentsByDriverId = useCallback(async () => {
    try {
      const res = await getShipmentByDriverId(userID || '');
      setShipments(res);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  }, [userID]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchShipmentsByDriverId();
    setRefreshing(false);
  }, [fetchShipmentsByDriverId]);

  useEffect(() => {
    fetchShipmentsByDriverId();
  }, [fetchShipmentsByDriverId]);

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <View className="w-full h-36 bg-orange-500 top-0 rounded-b-2xl shadow-md">
        <TouchableOpacity className="flex-row items-center absolute top-10 left-5 bg-white p-2 rounded-full shadow-md">
          <Image src="https://picsum.photos/200" className="w-10 h-10 rounded-full mr-2" />
          <Text className="font-semibold">Xin chào! Thanh An</Text>
        </TouchableOpacity>
        <View className="flex-row w-full justify-center items-center mt-28">
          {['Đang cần giao', 'Đã hoàn thành', 'Đơn mới'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              className={`px-8 ${tab === t ? 'border-b-2 border-white' : ''}`}
            >
              <Text className={`${tab === t ? 'text-white' : 'text-white'} pb-1 font-medium`}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={shipments}
        keyExtractor={(item) => item.shipmentID}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        className="w-full"
        renderItem={({ item, index }) => <TripItem item={item} index={index} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f97316']} // Màu cam matching với header
            tintColor="#f97316"
            title="Đang tải..."
            titleColor="#666"
          />
        }
      />
    </SafeAreaView>
  );
}
