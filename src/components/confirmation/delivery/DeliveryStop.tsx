import { makeSelectStepByFacility, startDeliveryThunk } from '@/src/hooks/useSelectorShipment';
import { AppDispatch, RootState } from '@/src/store/store';
import { ShipmentStatus, ShipmentStop } from '@/src/types/shipment';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import UploadImageComponent from '../UploadImage';
import DeliveryActions from './DeliveryAction';

interface DeliveryStopProps {
  stop: ShipmentStop;
}

interface DeliveryStopProps {
  stop: ShipmentStop;
}

export default function DeliveryStop({ stop }: DeliveryStopProps) {
  const [uploadStep, setUploadStep] = useState<'pickup' | 'delivery' | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { selectedShipment } = useSelector((state: RootState) => state.selectedShipment);
  const step = useSelector(makeSelectStepByFacility(stop.facilityID));

  const shipmentID = selectedShipment?.shipmentID || '';
  const shipmentStatus = selectedShipment?.status || '';

  const isIntransited =
    shipmentStatus === ShipmentStatus.IN_TRANSIT || shipmentStatus === ShipmentStatus.COMPLETED;

  const handlePresentModalPress = useCallback((step: 'pickup' | 'delivery') => {
    setUploadStep(step);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleImagesUploaded = () => {
    bottomSheetModalRef.current?.close();
  };

  const handleStartDelivery = () => {
    dispatch(startDeliveryThunk(shipmentID));
    Alert.alert('Thành công', 'Bạn đã bắt đầu giao hàng.', [{ text: 'OK' }]);
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

      {stop.status !== ShipmentStatus.COMPLETED && (
        <DeliveryActions
          facilityID={stop.facilityID}
          shipmentID={shipmentID}
          item={stop?.items[0]}
          action={stop.action}
          onOpenUpload={handlePresentModalPress}
          isStartDeliverying={isIntransited}
        />
      )}

      {step === 'ready_to_start_delivery' && (
        <>
          {isIntransited ? (
            <Text className="text-green-600 font-bold text-start my-2">Đã bắt đầu giao hàng</Text>
          ) : (
            <TouchableOpacity
              className={`${!isIntransited ? 'bg-green-500' : 'bg-green-400'} rounded-lg p-3 items-center`}
              onPress={handleStartDelivery}
              disabled={isIntransited}
            >
              <Text className="text-white font-bold text-sm">Bắt đầu giao hàng</Text>
            </TouchableOpacity>
          )}
        </>
      )}

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
