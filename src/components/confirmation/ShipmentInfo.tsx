import { ShipmentResponse, ShipmentStatus } from '@/src/types/shipment';
import React from 'react';
import { Text, View } from 'react-native';

export default function ShipmentInfo({ shipment }: { shipment: ShipmentResponse }) {
  return (
    <View className="mx-4 mt-[32px] bg-white rounded-2xl shadow p-4">
      <Text className="text-base text-black mb-1 font-semibold">ID: {shipment.shipmentID}</Text>
      <Text className="text-sm text-black mb-1 font-semibold">Người tạo: VOR Admin</Text>
      <Text className="text-sm text-black mb-1 font-semibold">Loại: {shipment.shipmentType}</Text>
      <Text className="text-sm text-black mb-1 font-semibold">
        Tài xế: {shipment.driverName} ({shipment.driverEnrollmentID})
      </Text>
      <Text className="text-sm text-black mb-1 font-semibold">
        Biển số xe: {shipment.vehiclePlate}
      </Text>
      <Text
        className={`text-sm font-bold mt-2 ${shipment.status === ShipmentStatus.COMPLETED ? 'text-green-600' : 'text-red-500'}`}
      >
        {shipment.status === ShipmentStatus.COMPLETED ? 'Đã giao' : 'Chưa giao'}
      </Text>
    </View>
  );
}
