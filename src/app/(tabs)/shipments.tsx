import { getShipmentByDriverId } from '@/src/api/driverApi';
import { ShipmentResponse, ShipmentStatus } from '@/src/types/shipment';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import '../../../global.css';
import TripItem from '../../components/confirmation/TripItem';

const STATUS_TABS = [
  { key: 'IN_TRANSIT', label: 'Đang cần giao', value: ShipmentStatus.IN_TRANSIT },
  { key: 'COMPLETED', label: 'Đã hoàn thành', value: ShipmentStatus.COMPLETED },
  { key: 'PENDING', label: 'Đơn mới', value: ShipmentStatus.PENDING },
] as const;

type StatusKey = (typeof STATUS_TABS)[number]['key'];

export default function ShipmentsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [query, setQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<StatusKey>('PENDING');
  const [userID, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserID = async () => {
      const userID = await SecureStore.getItemAsync('userID');
      setUserId(userID);
    };
    fetchUserID();
  }, []);

  const fetchShipments = useCallback(
    async (opts?: { showLoading?: boolean }) => {
      if (!userID) {
        setShipments([]);
        if (opts?.showLoading) setLoading(false);
        setRefreshing(false);
        return;
      }
      try {
        if (opts?.showLoading) setLoading(true);
        const res = await getShipmentByDriverId(userID);
        const list = Array.isArray(res) ? res : (res?.data ?? res?.shipments ?? []);
        setShipments(list as ShipmentResponse[]);
      } catch (e) {
        console.error('fetchShipments error', e);
        setShipments([]);
      } finally {
        if (opts?.showLoading) setLoading(false);
        setRefreshing(false);
      }
    },
    [userID],
  );

  useEffect(() => {
    fetchShipments({ showLoading: true });
  }, [fetchShipments]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchShipments();
  }, [fetchShipments]);

  const filtered = useMemo(() => {
    const byStatus = shipments.filter(
      (s) => s.status === ShipmentStatus[activeStatus as keyof typeof ShipmentStatus],
    );
    const byQuery = query.trim()
      ? byStatus.filter((s) => s.shipmentID.toLowerCase().includes(query.trim().toLowerCase()))
      : byStatus;
    // Sort by createDate descending (newest first). Fallbacks cover API variants.
    const sorted = [...byQuery].sort((a, b) => {
      const aDate = (a as any).createDate ?? (a as any).createdAt ?? (a as any).createAt ?? '';
      const bDate = (b as any).createDate ?? (b as any).createdAt ?? (b as any).createAt ?? '';
      const aTime = aDate ? new Date(aDate).getTime() : 0;
      const bTime = bDate ? new Date(bDate).getTime() : 0;
      return bTime - aTime;
    });
    return sorted;
  }, [shipments, activeStatus, query]);

  // If the user is not logged in, show a login prompt instead of the list
  if (!userID) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Bạn chưa đăng nhập</Text>
        <Text className="text-gray-500 text-center mb-6">
          Vui lòng đăng nhập để xem danh sách lô hàng của bạn.
        </Text>
        <TouchableOpacity
          className="bg-orange-500 px-5 py-3 rounded-xl"
          onPress={() => router.push('/login')}
        >
          <Text className="text-white font-semibold">Đăng nhập</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with search */}
      <View className="px-4 pt-2 pb-3 border-b border-gray-100 bg-white">
        <Text className="text-xl font-bold text-gray-800 mb-3">Danh sách lô hàng</Text>
        <TextInput
          placeholder="Tìm theo Shipment ID..."
          value={query}
          onChangeText={setQuery}
          className="bg-gray-100 rounded-xl px-4 py-3 text-sm"
          placeholderTextColor="#9CA3AF"
        />
        {/* Status tabs */}
        <View className="flex-row mt-3">
          {STATUS_TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => setActiveStatus(t.key)}
              className={`px-4 py-2 mr-2 rounded-full ${
                activeStatus === t.key ? 'bg-orange-500' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`${activeStatus === t.key ? 'text-white' : 'text-gray-700'} text-sm font-medium`}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#f97316" size="large" />
          <Text className="mt-2 text-gray-500">Đang tải đơn hàng...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.shipmentID}
          renderItem={({ item, index }) => <TripItem item={item} index={index} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 100, flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#f97316']}
              tintColor="#f97316"
              title="Đang tải..."
              titleColor="#666"
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500">Không có lô hàng nào với bộ lọc hiện tại.</Text>
              <TouchableOpacity
                className="mt-4 px-4 py-2 rounded-lg bg-orange-500"
                onPress={() => fetchShipments({ showLoading: true })}
              >
                <Text className="text-white font-semibold">Thử lại</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
