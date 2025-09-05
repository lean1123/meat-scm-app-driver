import { ShipmentStop } from '@/src/types/shipment';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { CameraView } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import UploadImageComponent from './UploadImage';

interface DeliveryStopProps {
  stop: ShipmentStop;
  onUpdateStop: (updatedStop: ShipmentStop) => void;
}

export default function DeliveryStop({ stop, onUpdateStop }: DeliveryStopProps) {
  const [isScannerVisible, setIsScannerVisible] = useState(false);

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

  const handleBarCodeScanned = (scanningResult: { data: string; type: string }) => {
    setIsScannerVisible(false);
    const { data } = scanningResult;
    const expectedQRCodeData = stop.items[0]?.assetID;

    if (data === expectedQRCodeData) {
      const verifiedStop: ShipmentStop = {
        ...stop,
        isVerified: true,
      };
      onUpdateStop(verifiedStop);
      Alert.alert('Thành công!', 'Đơn hàng đã được xác nhận thành công.');
    } else {
      Alert.alert(
        'Thất bại',
        `Mã QR không hợp lệ. Mã quét được: ${data}, Mã mong đợi: ${expectedQRCodeData}`,
      );
    }
  };

  const hasImages = stop.items.some((item) => item.images && item.images.length > 0);

  return (
    <View className="bg-white rounded-2xl shadow p-4 mb-3">
      <Text className="font-bold text-base mb-1">Cơ sở: {stop.facilityId}</Text>
      <Text className="text-xs text-gray-500 mb-2">Hành động: {stop.action}</Text>
      <Text
        className={`text-sm font-bold ${stop.isVerified ? 'text-green-600' : 'text-orange-500'}`}
      >
        {stop.isVerified ? '✅ Đã xác nhận' : '⏳ Chờ xác nhận'}
      </Text>
      {stop.items.map((item, i) => (
        <View key={i} className="my-2 p-2 rounded-xl bg-gray-50 border border-gray-200">
          <Text className="text-xs text-gray-700">Mã lô: {item.assetID}</Text>
        </View>
      ))}

      {!stop.isVerified && (
        <View className="mt-2 pt-3 border-t border-gray-200">
          {!hasImages && (
            <>
              <Text className="text-sm text-gray-600 mb-2">Bước 1: Tải ảnh xác nhận lô hàng.</Text>
              <TouchableOpacity
                className="bg-blue-500 rounded-lg p-3 items-center"
                onPress={handlePresentModalPress}
              >
                <Text className="text-white font-bold text-sm">Tải ảnh lên</Text>
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

      <Modal visible={isScannerVisible} animationType="slide">
        <View style={styles.scannerContainer}>
          <CameraView
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'], // Chỉ quét mã QR để tối ưu
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.scannerOverlay}>
            <Text style={styles.scannerText}>Di chuyển camera đến mã QR</Text>
            <Button title="Đóng" onPress={() => setIsScannerVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  scannerText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
