// DeliveryList.tsx

import { ShipmentStop, TimelineEvent } from '@/src/types/shipment';
import React from 'react';
import { Text, View } from 'react-native';
import DeliveryStop from './DeliveryStop';

type DeliveryListProps = {
  deliveries?: ShipmentStop[];
  timeline: TimelineEvent[];
};

export default function DeliveryList({ deliveries, timeline }: DeliveryListProps) {
  return (
    <View className="mx-4 mt-4">
      <Text className="font-bold text-base mb-2">Delivery Requests ({deliveries?.length})</Text>
      {deliveries?.map((stop: ShipmentStop) => (
        <DeliveryStop key={stop.facilityID} stop={stop} timeline={timeline} />
      ))}
    </View>
  );
}
