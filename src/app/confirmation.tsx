import ShipmentInfo from '@/src/components/confirmation/ShipmentInfo';
import { shipments } from '@/src/data/Home';
import { ShipmentResponse, ShipmentStatus, ShipmentStop } from '@/src/types/shipment'; // <-- Thêm ShipmentStop
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DeliveryList from '../components/confirmation/delivery/DeliveryList';

export default function ConfirmationScreen() {
  const [shipmentData, setShipmentData] = useState<ShipmentResponse | null>(null);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchShipment = (id: string) => {
      const shipment = shipments.find((item) => item.id === id);
      if (shipment) {
        setShipmentData(shipment as ShipmentResponse);
      }
    };

    fetchShipment(id as string);
  }, [id]);

  const handleUpdateStop = (updatedStop: ShipmentStop) => {
    if (!shipmentData) return;

    const newStops = shipmentData.stops.map((s) =>
      s.facilityId === updatedStop.facilityId && s.action === updatedStop.action ? updatedStop : s,
    );

    setShipmentData({
      ...shipmentData,
      stops: newStops,
    });
  };

  const handleConfirm = () => {
    const isAllStopsVerified = shipmentData?.stops.every((stop) => stop.isVerified);

    if (!isAllStopsVerified) {
      alert('Vui lòng xác nhận tất cả các điểm giao hàng trước khi hoàn tất đơn hàng.');
      return;
    }

    if (shipmentData) {
      const matchedShipment = shipments.find((item) => item.id === shipmentData.id);
      if (matchedShipment) {
        matchedShipment.isDelivered = true;
        matchedShipment.shipmentStatus = ShipmentStatus.DELIVERIED;
      }
    }
    alert('Cảm ơn bạn đã xác nhận đơn hàng!');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, padding: 10, paddingBottom: 40 }}>
      <BottomSheetModalProvider>
        <ScrollView className="bg-gray-100" contentContainerStyle={{ paddingBottom: 80 }}>
          {shipmentData && <ShipmentInfo shipment={shipmentData} />}

          <DeliveryList deliveries={shipmentData?.stops} onUpdateStop={handleUpdateStop} />

          <TouchableOpacity
            className="w-full bg-orange-500 p-5 rounded-2xl"
            onPress={handleConfirm}
          >
            <Text className="text-white font-bold text-center text-base">Confirm</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
