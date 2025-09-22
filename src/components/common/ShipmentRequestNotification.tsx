import { dismissNotification } from '@/src/hooks/useShipmentRequestSlice';
import { RootState } from '@/src/store/store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

const ShipmentRequestNotification = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(-150);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const { requests, isNotificationVisible } = useSelector(
    (state: RootState) => state.shipmentRequest,
  );

  const latestRequest = requests.length > 0 ? requests[0] : null;

  const handlePress = () => {
    dispatch(dismissNotification());
    router.push('/shipment-request/' + latestRequest?.bidID);
  };

  useEffect(() => {
    if (isNotificationVisible) {
      translateY.value = withSpring(insets.top, { damping: 15, stiffness: 100 });
      const timeout = setTimeout(() => {
        dispatch(dismissNotification());
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      translateY.value = withTiming(-150);
    }
  }, [isNotificationVisible, insets.top, translateY, dispatch]);

  if (!latestRequest) return null;

  return (
    <Animated.View
      style={[{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999 }, animatedStyle]}
    >
      <TouchableOpacity
        onPress={handlePress}
        className="bg-white rounded-b-2xl shadow-lg p-4 mx-4 border border-t-0 border-gray-200"
        activeOpacity={0.9}
      >
        <View className="flex-row items-center">
          <Feather name="truck" size={24} color="#f97316" />
          <View className="ml-4 flex-1">
            <Text className="font-bold text-base text-gray-800">Yêu cầu vận chuyển mới!</Text>
            <Text className="text-sm text-gray-600">Từ: {latestRequest.stops[0].facilityID}</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ShipmentRequestNotification;
