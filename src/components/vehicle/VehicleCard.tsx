import { Vehicle } from '@/src/types/vehicle';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface VehicleCardProps {
  vehicle: Vehicle;
  onUpdate: (vehicleId: string) => void;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | number;
}) => (
  <View className="flex-row items-center mb-2">
    <Feather name={icon} size={16} color="#6B7280" />
    <Text className="text-sm text-gray-600 ml-3 w-24">{label}:</Text>
    <Text className="text-sm font-semibold text-gray-800 flex-1">{value}</Text>
  </View>
);

// Component nhỏ để hiển thị trạng thái
const StatusBadge = ({ status }: { status: Vehicle['status'] }) => {
  const statusStyles = {
    AVAILABLE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Sẵn sàng' },
    IN_TRIP: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đang trong chuyến' },
    MAINTENANCE: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Bảo trì' },
  };
  const style = statusStyles[status] || statusStyles.AVAILABLE;

  return (
    <View className={`px-3 py-1 rounded-full self-start ${style.bg}`}>
      <Text className={`text-xs font-bold ${style.text}`}>{style.label}</Text>
    </View>
  );
};

const VehicleCard = ({ vehicle, onUpdate }: VehicleCardProps) => {
  return (
    <View className="bg-white rounded-2xl shadow-md p-5 mb-4 mx-4">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{vehicle.plateNumber}</Text>
          <Text className="text-sm text-gray-500">{vehicle.model}</Text>
        </View>
        <StatusBadge status={vehicle.status} />
      </View>

      <View className="border-t border-gray-200 pt-3">
        <Text className="text-base font-semibold text-gray-700 mb-2">Thông số kỹ thuật</Text>
        <InfoRow icon="truck" label="Loại xe" value={vehicle.specs.type} />
        <InfoRow
          icon="thermometer"
          label="Đông lạnh"
          value={vehicle.specs.refrigerated ? 'Có' : 'Không'}
        />
        <InfoRow icon="archive" label="Tải trọng" value={`${vehicle.specs.payloadTonnes} tấn`} />
        <InfoRow icon="box" label="Thể tích" value={`${vehicle.specs.volumeCBM} m³`} />
      </View>

      <TouchableOpacity
        onPress={() => onUpdate(vehicle.vehicleID)}
        className="flex-row items-center justify-center bg-gray-100 mt-4 p-3 rounded-lg"
        activeOpacity={0.7}
      >
        <Feather name="edit" size={16} color="#4B5563" />
        <Text className="text-gray-800 font-bold text-sm ml-2">Cập nhật thông tin</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VehicleCard;
