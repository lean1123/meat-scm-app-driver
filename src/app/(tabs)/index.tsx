import AvailableRequests from '@/src/components/home/AvailableRequests';
import DirectionPrompt from '@/src/components/home/DirectionPrompt';
import HomeHeader from '@/src/components/home/HomeHeader';
import TodoSection, { TodoItem } from '@/src/components/home/TodoSection';
import { removeRequest } from '@/src/hooks/useShipmentRequestSlice';
import { RootState } from '@/src/store/store';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import '../../../global.css';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { requests } = useSelector((state: RootState) => state.shipmentRequest);
  const [hasVerifiedIdentity] = useState(false);
  const [hasVehicle] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const storedName = await SecureStore.getItemAsync('username');
      setUsername(storedName);
    };
    fetchUsername();
  }, []);

  const todos: TodoItem[] = useMemo(
    () => [
      {
        key: 'identity',
        title: 'Identity Verification',
        description:
          'Add your driving license, or any other means of driving identification used in your country',
        done: hasVerifiedIdentity,
        onPress: () => router.push('/profile'),
      },
      {
        key: 'vehicle',
        title: 'Add Vehicle',
        description:
          'Upload insurance and registration documents of the vehicle you intend to use.',
        done: hasVehicle,
        onPress: () => router.push('/vehicle-management'),
      },
    ],
    [hasVerifiedIdentity, hasVehicle, router],
  );

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <HomeHeader name={username || 'Bạn'} avatarUrl="https://picsum.photos/200" />

      {/* Content */}
      <ScrollView className="w-full" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <TodoSection items={todos} />

        {/* Direction prompt */}
        <DirectionPrompt onPress={() => router.push('/(tabs)/shipments')} />

        {/* Available Requests */}
        <AvailableRequests
          requests={requests}
          canShow={hasVerifiedIdentity && hasVehicle}
          onViewAll={() => router.push('/(tabs)/request')}
          onReject={(bidID) => dispatch(removeRequest({ bidID }))}
          onAccept={(bidID) => router.push(`/shipment-request/${bidID}`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
