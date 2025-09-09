import { shipments } from '@/src/data/Home';
import { ShipmentResponse, ShipmentStatus } from '@/src/types/shipment';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { getStatusRendering } from './helperFunc/statusRendering';

interface TripItemProps {
  item: ShipmentResponse;
  index: number;
}

export default function TripItem({ item, index }: TripItemProps) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);

  const ongoingShipment = shipments.find(
    (shipment) => shipment.status === ShipmentStatus.DELIVERING,
  );

  // const isDeliveringShipment = ongoingShipment?.shipmentID === item.shipmentID;
  const isDeliveringShipment = true;

  const validateAcceptNewShipment = () => {
    if (isDeliveringShipment) {
      return true;
    }

    return !ongoingShipment;
  };

  const handleClickNewShipment = () => {
    if (isDeliveringShipment || item.status === ShipmentStatus.COMPLETED) {
      router.push({ pathname: '/confirmation', params: { id: item.shipmentID } });
      return;
    }

    if (validateAcceptNewShipment()) {
      setModalVisible(true);
    } else {
      alert('Bạn chỉ có thể nhận một đơn vận chuyển tại một thời điểm.');
    }
  };

  const handleAcceptShipment = () => {
    setModalVisible(false);
    shipments.filter((item) => item.shipmentID === item.shipmentID)[0].status =
      ShipmentStatus.DELIVERING;
    router.push({ pathname: '/confirmation', params: { id: item.shipmentID } });
  };

  return (
    <>
      <TouchableOpacity
        className="bg-orange-50 rounded-2xl p-4 mb-4 shadow-xl"
        onPress={handleClickNewShipment}
      >
        <Text className="text-xs text-black mb-1 font-semibold">ID: {item.shipmentID}</Text>
        <Text className="text-xs text-black mb-1 font-semibold">Loại: {item.shipmentType}</Text>
        <View className="flex-row justify-between items-center mt-3">
          <Text
            className={'text-sm font-bold'}
            style={{ color: getStatusRendering(item.status)?.color }}
          >
            {getStatusRendering(item.status)?.label}
          </Text>
          <Text className="text-xs text-black font-semibold">
            #{String(index + 1).padStart(2, '0')}
          </Text>
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
