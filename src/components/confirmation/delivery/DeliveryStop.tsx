import { RootState } from '@/src/store/store';
import { ShipmentStatus, ShipmentStop, TimelineEvent } from '@/src/types/shipment';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import UploadImageComponent from '../UploadImage';

interface DeliveryStopProps {
  stop: ShipmentStop;
  timeline: TimelineEvent[];
}

export default function DeliveryStop({ stop }: DeliveryStopProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [uploadStep, setUploadStep] = useState<'pickup' | 'delivery' | null>(null);
  const { selectedShipment } = useSelector((state: any) => state.selectedShipment);

  const shipmentID = selectedShipment?.shipmentID || '';
  const timeline = useSelector(
    (state: RootState) => state.selectedShipment?.selectedShipment?.timeline,
  );

  const handlePresentModalPress = useCallback((step: 'pickup' | 'delivery') => {
    setUploadStep(step);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleImagesUploaded = (images: string[]) => {
    if (!uploadStep) return;

    bottomSheetModalRef.current?.close();
  };

  const hasPickupProof = useMemo(
    () =>
      timeline?.some(
        (t: TimelineEvent) =>
          t.type === 'pickup_confirmed' && t?.photoURL && t.facilityID === stop.facilityID,
      ),
    [timeline, stop.facilityID],
  );

  const hasDeliveryProof = useMemo(
    () =>
      timeline?.some(
        (t: TimelineEvent) =>
          t.type === 'arrival' && t.photoURL && t.facilityID === stop.facilityID,
      ),
    [timeline, stop.facilityID],
  );

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

      {stop.status !== ShipmentStatus.COMPLETED && (
        <View className="mt-2 pt-3 border-t border-gray-200">
          {!hasPickupProof && (
            <>
              <Text className="text-sm text-gray-600 mb-2">Bước 1: Chụp ảnh lúc nhận hàng.</Text>
              <TouchableOpacity
                className="bg-orange-500 rounded-lg p-3 items-center"
                onPress={() => handlePresentModalPress('pickup')}
              >
                <Text className="text-white font-bold text-sm">Chụp ảnh khi nhận</Text>
              </TouchableOpacity>
            </>
          )}

          {hasPickupProof && !hasDeliveryProof && (
            <>
              <Text className="text-sm text-gray-600 mb-2">Bước 2: Chụp ảnh lúc giao hàng.</Text>
              <TouchableOpacity
                className="bg-blue-500 rounded-lg p-3 items-center"
                onPress={() => handlePresentModalPress('delivery')}
              >
                <Text className="text-white font-bold text-sm">Chụp ảnh khi giao</Text>
              </TouchableOpacity>
            </>
          )}

          {hasPickupProof && hasDeliveryProof && (
            <>
              <Text className="text-sm text-gray-600 mb-2">
                Bước 3: Quét mã QR để hoàn tất giao dịch.
              </Text>
              <View className="items-center bg-gray-50 p-4 rounded-lg">
                <QRCode
                  value={JSON.stringify({
                    shipmentID: shipmentID,
                    facilityID: stop.facilityID,
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
                <Text className="text-xs text-gray-500 mt-2">Facility: {stop.facilityID}</Text>
              </View>
            </>
          )}
        </View>
      )}

      <BottomSheetModal ref={bottomSheetModalRef} snapPoints={['60%']}>
        <BottomSheetView style={{ flex: 1, padding: 10 }}>
          <Text className="text-start font-semibold text-lg">
            {uploadStep === 'pickup' ? 'Tải ảnh lúc nhận hàng' : 'Tải ảnh lúc giao hàng'}
          </Text>
          <UploadImageComponent
            onSend={handleImagesUploaded}
            shipmentID={shipmentID}
            facilityID={stop?.facilityID}
            step={uploadStep || undefined}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
