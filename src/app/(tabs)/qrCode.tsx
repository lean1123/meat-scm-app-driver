import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function QRCode() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-center text-base mb-4">
          Vui lòng cấp quyền truy cập camera để quét mã QR.
        </Text>
        <Button onPress={requestPermission} title="Cấp quyền" />
      </View>
    );
  }

  // Hàm xử lý khi quét được mã
  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (!scanned) {
      setScanned(true);
      setScannedData(data);
      Alert.alert('Quét thành công!', `Dữ liệu: ${data}`);
      router.push(`/confirmation?data=${encodeURIComponent(data)}`);
    }
  };

  // Hàm để quét lại
  const handleScanAgain = () => {
    setScanned(false);
    setScannedData(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Camera background */}
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        facing="back"
      />

      {/* Overlay */}
      <View className="absolute inset-0 justify-between items-center">
        {/* Header */}
        <View className="w-full items-center bg-black/60 pt-5">
          <Text className="text-2xl font-bold text-white p-4">Quét mã QR</Text>
        </View>

        {/* Viewfinder */}
        <View className="w-[250px] h-[250px] justify-center items-center">
          <View className="absolute top-0 left-0 w-10 h-10 border-t-[5px] border-l-[5px] border-white" />
          <View className="absolute top-0 right-0 w-10 h-10 border-t-[5px] border-r-[5px] border-white" />
          <View className="absolute bottom-0 left-0 w-10 h-10 border-b-[5px] border-l-[5px] border-white" />
          <View className="absolute bottom-0 right-0 w-10 h-10 border-b-[5px] border-r-[5px] border-white" />
        </View>

        {/* Footer */}
        <View className="w-full items-center bg-black/60 pb-10">
          {scanned ? (
            <>
              <Text className="text-white text-base text-center p-5 font-bold">
                Dữ liệu: {scannedData}
              </Text>
              <TouchableOpacity
                className="bg-blue-500 py-3 px-8 rounded-lg"
                onPress={handleScanAgain}
              >
                <Text className="text-white text-lg font-bold">Quét lại</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text className="text-white text-base text-center p-5">
              Di chuyển camera đến gần mã QR để quét
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
