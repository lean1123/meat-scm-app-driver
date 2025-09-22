import { Vehicle } from '@/src/types/vehicle';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import EmptyState from '../components/vehicle/EmptyState';
import VehicleCard from '../components/vehicle/VehicleCard';

const FAKE_VEHICLES: Vehicle[] = [
  {
    id: '60d0fe4f5311236168a109ca',
    vehicleID: 'VEH-HYU-001',
    plateNumber: '51C-123.45',
    ownerDriverID: 'driver-7fcc3acd',
    model: 'Hyundai Porter H150',
    specs: {
      type: 'TRUCK',
      refrigerated: true,
      payloadTonnes: 1.5,
      volumeCBM: 10,
    },
    status: 'AVAILABLE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '60d0fe4f5311236168a109cb',
    vehicleID: 'VEH-HON-002',
    plateNumber: '59-T1 987.65',
    ownerDriverID: 'driver-7fcc3acd',
    model: 'Honda Wave Alpha',
    specs: {
      type: 'MOTORBIKE',
      refrigerated: false,
      payloadTonnes: 0.15,
      volumeCBM: 0.5,
    },
    status: 'IN_TRIP',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const VehicleManagementScreen = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVehicles(FAKE_VEHICLES);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddVehicle = () => {
    Alert.alert('Thông báo', 'Điều hướng đến màn hình Thêm phương tiện.');
  };

  const handleUpdateVehicle = (vehicleId: string) => {
    Alert.alert('Thông báo', `Điều hướng đến màn hình Cập nhật phương tiện ID: ${vehicleId}`);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {vehicles.length === 0 ? (
          <EmptyState onAddVehicle={handleAddVehicle} />
        ) : (
          <View className="pt-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.vehicleID}
                vehicle={vehicle}
                onUpdate={handleUpdateVehicle}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VehicleManagementScreen;
