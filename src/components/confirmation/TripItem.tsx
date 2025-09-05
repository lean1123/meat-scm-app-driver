import { shipments } from '@/src/data/Home';
import { ShipmentStatus } from '@/src/types/shipment';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { getStatusRendering } from './helperFunc/statusRendering';

interface TripItemProps {
  item: {
    id: string;
    shipmentName: string;
    createdBy: string;
    shipmentType: string;
    deliveryAddress: string;
    isDelivered: boolean;
    shipmentStatus: ShipmentStatus;
  };
  index: number;
}

export default function TripItem({ item, index }: TripItemProps) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);

  const ongoingShipment = shipments.find(
    (shipment) => shipment.shipmentStatus === ShipmentStatus.DELIVERING,
  );

  const isDeliveringShipment = ongoingShipment?.id === item.id;

  // Ham kiem tra xem co the nhan don moi khong ?
  const validateAcceptNewShipment = () => {
    if (isDeliveringShipment) {
      return true;
    }

    return !ongoingShipment;
  };

  const handleClickNewShipment = () => {
    if (isDeliveringShipment || item.shipmentStatus === ShipmentStatus.DELIVERIED) {
      router.push({ pathname: '/confirmation', params: { id: item.id } });
      return;
    }

    if (validateAcceptNewShipment()) {
      setModalVisible(true);
    } else {
      alert('Bạn chỉ có thể nhận một đơn vận chuyển tại một thời điểm.');
    }
  };

  // Xử lý khi xác nhận nhận đơn
  const handleAcceptShipment = () => {
    setModalVisible(false);
    shipments.filter((item) => item.id === item.id)[0].shipmentStatus = ShipmentStatus.DELIVERING;
    router.push({ pathname: '/confirmation', params: { id: item.id } });
  };

  return (
    <>
      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-4 shadow"
        onPress={handleClickNewShipment}
      >
        <Text className="text-xs text-gray-400 mb-1">ID: {item.id}</Text>
        <Text className="text-base font-semibold text-dark mb-1">{item.shipmentName}</Text>
        <Text className="text-xs text-gray-500 mb-1">Người tạo: {item.createdBy}</Text>
        <Text className="text-xs text-gray-500 mb-1">Loại: {item.shipmentType}</Text>
        <Text className="text-xs text-gray-500 mb-1">Địa chỉ giao: {item.deliveryAddress}</Text>
        <View className="flex-row justify-between items-center mt-3">
          <Text
            className={'text-sm font-bold'}
            style={{ color: getStatusRendering(item.shipmentStatus)?.color }}
          >
            {getStatusRendering(item.shipmentStatus)?.label}
          </Text>
          <Text className="text-xs text-gray-400">#{String(index + 1).padStart(2, '0')}</Text>
        </View>
      </TouchableOpacity>
      <View>
        <Modal visible={modalVisible} transparent animationType="fade">
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white p-6 rounded-2xl w-80">
              <Text className="text-xl font-bold mb-4">Xác nhận nhận đơn</Text>
              <Text className="text-gray-700 mb-6">Bạn có muốn nhận đơn vận chuyển này không?</Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-gray-300 py-2 px-4 rounded-lg"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="font-bold">Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-blue-700 py-2 px-4 rounded-lg"
                  onPress={handleAcceptShipment}
                >
                  <Text className="text-white font-bold">Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
