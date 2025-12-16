import { getMyTransportBids } from '@/src/api/bidApi';
import { formatTimestamp } from '@/src/hellpers/formatter';
import { RootState } from '@/src/store/store';
import { TransportBid } from '@/src/types/bid';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

// --- Helper tính toán thời gian ---
const calculateTimeLeft = (expiresAt: string | undefined) => {
  if (!expiresAt) return { text: null, isExpired: false, isUrgent: false };

  const expTime = new Date(expiresAt).getTime();
  if (isNaN(expTime)) return { text: null, isExpired: false, isUrgent: false };

  const now = Date.now();
  const diff = expTime - now;

  if (diff <= 0) {
    return { text: 'Đã hết hạn', isExpired: true, isUrgent: false };
  }

  // Quy đổi ra đơn vị
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  let text = '';
  let isUrgent = false;

  if (days > 0) {
    text = `${days} ngày ${hours} giờ`;
  } else if (hours > 0) {
    text = `${hours} giờ ${mins} phút`;
    isUrgent = hours < 2; // Gấp nếu dưới 2 tiếng
  } else {
    // Nếu còn dưới 1 tiếng, hiện phút và giây
    text = `${mins} phút ${secs} giây`;
    isUrgent = true;
  }

  return { text: `${text} còn lại`, isExpired: false, isUrgent };
};

const RequestCard = ({ item, onPress }: { item: TransportBid; onPress: () => void }) => {
  const createdRaw = (item as any).createAt ?? item.createdAt ?? (item as any).createDate;
  const createdText = createdRaw ? formatTimestamp(createdRaw) : '—';

  const stops = Array.isArray(item.stops) ? item.stops : [];
  const origin = stops[0]?.facilityID ?? 'Unknown';
  const destination = stops[stops.length - 1]?.facilityID ?? 'Unknown';
  const status = (item as any).status ?? 'Pending';

  // State cho thời gian đếm ngược
  const [timerDisplay, setTimerDisplay] = useState(calculateTimeLeft((item as any).expiresAt));

  // Effect để cập nhật thời gian mỗi giây
  useEffect(() => {
    const expiresAt = (item as any).expiresAt;
    if (!expiresAt) return;

    // Tính toán ngay lập tức
    setTimerDisplay(calculateTimeLeft(expiresAt));

    const interval = setInterval(() => {
      const result = calculateTimeLeft(expiresAt);
      setTimerDisplay(result);

      // Nếu đã hết hạn thì dừng timer để tiết kiệm hiệu năng
      if (result.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [(item as any).expiresAt]);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-bold text-lg text-gray-900">
          ID: {item.bidID || (item as any).id}
        </Text>
        <View
          className={`px-2 py-1 rounded-full border ${
            timerDisplay.isExpired
              ? 'bg-gray-100 border-gray-300'
              : 'bg-orange-50 border-orange-200'
          }`}
        >
          <Text
            className={`text-[11px] font-semibold ${
              timerDisplay.isExpired ? 'text-gray-500' : 'text-orange-600'
            }`}
          >
            {status}
          </Text>
        </View>
      </View>

      <View className="mb-2">
        <Text className="text-base text-gray-800 font-medium">
          Loại: {item.shipmentType ?? 'Standard'}
        </Text>
      </View>

      <View className="bg-gray-50 p-2 rounded mb-2">
        <Text className="text-sm text-gray-700">📍 Đi: {origin}</Text>
        <Text className="text-sm text-gray-700 mt-1">🏁 Đến: {destination}</Text>
      </View>

      <View className="flex-row justify-between mt-1 items-center">
        <Text className="text-xs text-gray-500">📅 Tạo: {createdText}</Text>

        {timerDisplay.text && (
          <View className="flex-row items-center">
            <Feather
              name="clock"
              size={12}
              color={
                timerDisplay.isExpired ? '#6B7280' : timerDisplay.isUrgent ? '#EF4444' : '#10B981'
              }
              style={{ marginRight: 4 }}
            />
            <Text
              className={`text-xs font-bold ${
                timerDisplay.isExpired
                  ? 'text-gray-500'
                  : timerDisplay.isUrgent
                    ? 'text-red-500' // Màu đỏ nếu gấp
                    : 'text-green-600'
              }`}
            >
              {timerDisplay.text}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ShipmentRequestListScreen = () => {
  const router = useRouter();
  const { requests } = useSelector((state: RootState) => state.shipmentRequest);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bids, setBids] = useState<TransportBid[]>([]);

  const fetchBids = useCallback(async (opts?: { showLoading?: boolean }) => {
    try {
      if (opts?.showLoading) setLoading(true);
      const res = await getMyTransportBids();
      const raw = (res as any)?.data ?? res;
      const data: any[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.items)
            ? raw.items
            : Array.isArray(raw?.results)
              ? raw.results
              : [];

      // Sort: Những cái mới tạo lên đầu
      const sorted = [...data].sort((a: any, b: any) => {
        const aTime = new Date(a.createdAt || a.createAt || 0).getTime();
        const bTime = new Date(b.createdAt || b.createAt || 0).getTime();
        return bTime - aTime;
      });

      setBids(sorted as TransportBid[]);
    } catch (e) {
      console.error('fetch bids error', e);
      setBids([]);
    } finally {
      if (opts?.showLoading) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBids({ showLoading: true });
  }, [fetchBids]);

  const validMerged = useMemo(() => {
    const map = new Map<string, TransportBid>();
    [...requests, ...bids].forEach((r: any) => {
      const key = r.bidID || r.id || r._id;
      if (key) map.set(String(key), r);
    });

    // Lọc bỏ những cái status đã EXPIRED từ server (nếu muốn)
    // Nhưng vẫn giữ lại cái local expired để hiển thị text "Đã hết hạn"
    return Array.from(map.values());
  }, [requests, bids]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBids();
  }, [fetchBids]);

  if (!loading && validMerged.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Feather name="inbox" size={50} color="#9CA3AF" />
        <Text className="text-gray-500 mt-4 text-lg">Không có yêu cầu vận chuyển.</Text>
        <TouchableOpacity
          onPress={() => fetchBids({ showLoading: true })}
          className="mt-4 bg-orange-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 py-3 bg-white shadow-sm z-10 flex-row justify-between items-center">
        <Text className="text-2xl font-extrabold text-gray-800">
          Yêu Cầu ({validMerged.length})
        </Text>
        <TouchableOpacity
          onPress={() => fetchBids({ showLoading: true })}
          disabled={loading}
          className="p-2 bg-gray-50 rounded-full"
        >
          <Feather name="refresh-ccw" size={20} color={loading ? '#9CA3AF' : '#f97316'} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#f97316" size="large" />
          <Text className="mt-2 text-gray-500">Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={validMerged}
          keyExtractor={(item: any) => String(item.bidID || item.id || Math.random())}
          renderItem={({ item }) => (
            <RequestCard
              item={item}
              onPress={() =>
                router.push(`/shipment-request/${(item as any).bidID || (item as any).id}`)
              }
            />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ShipmentRequestListScreen;
