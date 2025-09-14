import { makeSelectStepByFacility } from '@/src/hooks/useSelectorShipment';
import { ShipmentStatus } from '@/src/types/shipment';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';

const DeliveryActions = React.memo(function DeliveryActions({
  facilityID,
  shipmentID,
  stopStatus,
  onOpenUpload,
}: {
  facilityID: string;
  shipmentID: string;
  stopStatus: ShipmentStatus;
  onOpenUpload: (step: 'pickup' | 'delivery') => void;
}) {
  const step = useSelector(makeSelectStepByFacility(facilityID));
  if (stopStatus === ShipmentStatus.COMPLETED) return null;

  return (
    <View className="mt-2 pt-3 border-t border-gray-200">
      {step === 'waiting_pickup' && (
        <>
          <Text className="text-sm text-gray-600 mb-2">Bước 1: Chụp ảnh lúc nhận hàng.</Text>
          <TouchableOpacity
            className="bg-orange-500 rounded-lg p-3 items-center"
            onPress={() => onOpenUpload('pickup')}
          >
            <Text className="text-white font-bold text-sm">Chụp ảnh khi nhận</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'waiting_delivery' && (
        <>
          <Text className="text-sm text-gray-600 mb-2">Bước 2: Chụp ảnh lúc giao hàng.</Text>
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-3 items-center"
            onPress={() => onOpenUpload('delivery')}
          >
            <Text className="text-white font-bold text-sm">Chụp ảnh khi giao</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'completed' && (
        <>
          <Text className="text-sm text-gray-600 mb-2">
            Bước 3: Quét mã QR để hoàn tất giao dịch.
          </Text>
          <View className="items-center bg-gray-50 p-4 rounded-lg">
            <QRCode
              value={JSON.stringify({
                shipmentID,
                facilityID,
                action: 'PICKUP',
                items: [
                  {
                    assetID: 'FARM-BATCH-101',
                    quantity: { unit: 'con', value: 20 },
                  },
                ],
              })}
              size={120}
            />
            <Text className="text-xs text-gray-500 mt-2">Facility: {facilityID}</Text>
          </View>
        </>
      )}
    </View>
  );
});

export default DeliveryActions;
