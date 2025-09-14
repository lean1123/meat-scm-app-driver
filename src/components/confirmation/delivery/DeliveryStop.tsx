import { RootState } from '@/src/store/store';
import { ShipmentStatus, ShipmentStop, TimelineEvent } from '@/src/types/shipment';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import UploadImageComponent from '../UploadImage';
import DeliveryActions from './DeliveryAction';

interface DeliveryStopProps {
  stop: ShipmentStop;
  timeline: TimelineEvent[];
}

interface DeliveryStopProps {
  stop: ShipmentStop;
}

export default function DeliveryStop({ stop }: DeliveryStopProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [uploadStep, setUploadStep] = useState<'pickup' | 'delivery' | null>(null);

  const { selectedShipment } = useSelector((state: RootState) => state.selectedShipment);
  const shipmentID = selectedShipment?.shipmentID || '';

  const handlePresentModalPress = useCallback((step: 'pickup' | 'delivery') => {
    setUploadStep(step);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleImagesUploaded = () => {
    bottomSheetModalRef.current?.close();
  };

  return (
    <View className="bg-white rounded-2xl shadow p-4 mb-3">
      <Text className="font-bold text-base mb-1">Cơ sở: {stop.facilityName}</Text>
      <Text className="text-xs text-black mb-2">Hành động: {stop.action}</Text>

      <Text
        className={`text-sm font-bold ${
          stop.status === ShipmentStatus.COMPLETED ? 'text-green-600' : 'text-orange-500'
        }`}
      >
        {stop.status === ShipmentStatus.COMPLETED ? (
          <Text>
            <AntDesign name="checkcircleo" size={16} color="green" /> Đã xác nhận
          </Text>
        ) : (
          <Text>
            <AntDesign name="clockcircleo" size={16} color="orange" /> Chờ xác nhận
          </Text>
        )}
      </Text>

      <DeliveryActions
        facilityID={stop.facilityID}
        shipmentID={shipmentID}
        stopStatus={stop.status}
        onOpenUpload={handlePresentModalPress}
      />

      <BottomSheetModal ref={bottomSheetModalRef} snapPoints={['60%']}>
        <BottomSheetView style={{ flex: 1, padding: 10 }}>
          <Text className="text-start font-semibold text-lg">
            {uploadStep === 'pickup' ? 'Tải ảnh lúc nhận hàng' : 'Tải ảnh lúc giao hàng'}
          </Text>
          <UploadImageComponent
            onSend={handleImagesUploaded}
            shipmentID={shipmentID}
            facilityID={stop.facilityID}
            step={uploadStep || undefined}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
