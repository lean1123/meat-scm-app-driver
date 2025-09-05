// DeliveryList.tsx

import { ShipmentStop } from '@/src/types/shipment';
import React from 'react';
import { Text, View } from 'react-native';
import DeliveryStop from './DeliveryStop';

type DeliveryListProps = {
  deliveries?: ShipmentStop[];
  onUpdateStop: (updatedStop: ShipmentStop) => void;
};

export default function DeliveryList({ deliveries, onUpdateStop }: DeliveryListProps) {
  return (
    <View className="mx-4 mt-4">
      <Text className="font-bold text-base mb-2">Delivery Requests ({deliveries?.length})</Text>
      {deliveries?.map((stop: ShipmentStop) => (
        <DeliveryStop key={stop.facilityId + stop.action} stop={stop} onUpdateStop={onUpdateStop} />
      ))}
    </View>
  );
}
