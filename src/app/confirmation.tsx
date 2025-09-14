import ShipmentInfo from '@/src/components/confirmation/ShipmentInfo';
import { shipments } from '@/src/data/Home';
import { ShipmentStatus, ShipmentStop } from '@/src/types/shipment';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import DeliveryList from '../components/confirmation/delivery/DeliveryList';
import { fetchShipmentById } from '../hooks/useSelectorShipment';
import { AppDispatch, RootState } from '../store/store';

export default function ConfirmationScreen() {
  const { selectedShipment } = useSelector((state: RootState) => state.selectedShipment);
  const { id = 'SHIP-LIVE-ANIMAL-01' } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.selectedShipment.status);

  useEffect(() => {
    if (id) {
      dispatch(fetchShipmentById(id as string));
    }
  }, [id, dispatch]);

  const handleConfirm = () => {
    const isAllStopsVerified = selectedShipment?.stops.every(
      (stop: ShipmentStop) => stop.status === ShipmentStatus.COMPLETED,
    );

    if (!isAllStopsVerified) {
      alert('Vui lòng xác nhận tất cả các điểm giao hàng trước khi hoàn tất đơn hàng.');
      return;
    }

    if (selectedShipment) {
      const matchedShipment = shipments.find(
        (item) => item.shipmentID === selectedShipment.shipmentID,
      );
      if (matchedShipment) {
        matchedShipment.status = ShipmentStatus.COMPLETED;
      }
    }
    alert('Cảm ơn bạn đã xác nhận đơn hàng!');
  };

  if (!selectedShipment || status === 'loading') {
    return <Text className="">Loading...</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, padding: 10, paddingBottom: 40 }}>
      <BottomSheetModalProvider>
        <ScrollView className="bg-gray-100" contentContainerStyle={{ paddingBottom: 80 }}>
          {selectedShipment && <ShipmentInfo shipment={selectedShipment} />}

          <DeliveryList
            deliveries={selectedShipment?.stops}
            timeline={selectedShipment?.timeline || []}
          />

          <TouchableOpacity
            className="w-full bg-orange-500 p-5 rounded-2xl mt-4"
            onPress={handleConfirm}
          >
            <Text className="text-white font-bold text-center text-base">Xác nhận đơn</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
