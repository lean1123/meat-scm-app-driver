import React from 'react';
import { Text, View } from 'react-native';

export default function ShipmentInfo({ shipment }: { shipment: any }) {
  return (
    <View className="mx-4 mt-[32px] bg-white rounded-2xl shadow p-4">
      <Text className="text-xs text-gray-400 mb-1">ID: {shipment.id}</Text>
      <Text className="text-base font-semibold text-dark mb-1">{shipment.shipmentName}</Text>
      <Text className="text-xs text-gray-500 mb-1">Người tạo: {shipment.createdBy}</Text>
      <Text className="text-xs text-gray-500 mb-1">Loại: {shipment.shipmentType}</Text>
      <Text className="text-xs text-gray-500 mb-1">
        Tài xế: {shipment.driverName} ({shipment.driverEnrollmentID})
      </Text>
      <Text className="text-xs text-gray-500 mb-1">Biển số xe: {shipment.vehiclePlate}</Text>
      <Text className="text-xs text-gray-500 mb-1">Địa chỉ giao: {shipment.deliveryAddress}</Text>
      <Text
        className={`text-sm font-bold mt-2 ${shipment.isDelivered ? 'text-green-600' : 'text-red-500'}`}
      >
        {shipment.isDelivered ? 'Đã giao' : 'Chưa giao'}
      </Text>
    </View>
  );
}
