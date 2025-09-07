import { ShipmentStatus, ShipmentStop } from '@/src/types/shipment';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import UploadImageComponent from '../UploadImage';

interface DeliveryStopProps {
  stop: ShipmentStop;
  onUpdateStop: (updatedStop: ShipmentStop) => void;
}

export default function DeliveryStop({ stop, onUpdateStop }: DeliveryStopProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleImagesUploaded = (images: string[]) => {
    console.log('Images uploaded debug:', images);
    const updatedStop: ShipmentStop = {
      ...stop,
      items: stop.items.map((item) => ({
        ...item,
        images,
      })),
    };
    onUpdateStop(updatedStop);
    bottomSheetModalRef.current?.close();
  };

  const hasImages = true;
  return (
    <View className="bg-white rounded-2xl shadow p-4 mb-3">
      <Text className="font-bold text-base mb-1">Cơ sở: {stop.facilityID}</Text>
      <Text className="text-xs text-gray-500 mb-2">Hành động: {stop.action}</Text>
      <Text
        className={`text-sm font-bold ${stop.status === ShipmentStatus.COMPLETED ? 'text-green-600' : 'text-orange-500'}`}
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
      {stop.items.map((item, i) => (
        <View key={i} className="my-2 p-2 rounded-xl bg-gray-50 border border-gray-200">
          <Text className="text-xs text-gray-700">Mã lô: {item.assetID}</Text>
        </View>
      ))}

      {stop.status !== ShipmentStatus.COMPLETED && (
        <View className="mt-2 pt-3 border-t border-gray-200">
          {!hasImages && (
            <>
              <Text className="text-sm text-gray-600 mb-2">Bước 1: Tải ảnh xác nhận lô hàng.</Text>
              <TouchableOpacity
                className="bg-orange-500 rounded-lg p-3 items-center"
                onPress={handlePresentModalPress}
              >
                <Text className="text-white font-bold text-sm">Chụp ảnh để xác nhận</Text>
              </TouchableOpacity>
            </>
          )}

          {hasImages && (
            <>
              <Text className="text-sm text-gray-600 mb-2">
                Bước 2: Quét mã QR trên đơn hàng để hoàn tất.
              </Text>
              <View className="items-center bg-gray-50 p-4 rounded-lg">
                <QRCode value={stop.items[0]?.assetID || 'no-asset-id'} size={120} />
                <Text className="text-xs text-gray-500 mt-2">
                  Mã đơn hàng: {stop.items[0]?.assetID}
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      <BottomSheetModal ref={bottomSheetModalRef} snapPoints={['60%']}>
        <BottomSheetView style={{ flex: 1, padding: 10 }}>
          <Text className="text-start font-semibold text-lg">Tải ảnh xác nhận</Text>
          <UploadImageComponent onSend={handleImagesUploaded} />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
