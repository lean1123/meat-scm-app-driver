import { TransportBid } from '@/src/types/bid';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AvailableRequestsProps {
  requests: TransportBid[];
  canShow: boolean;
  onViewAll: () => void;
  onReject: (bidID: string) => void;
  onAccept: (bidID: string) => void;
}

const AvailableRequests: React.FC<AvailableRequestsProps> = ({
  requests,
  canShow,
  onViewAll,
  onReject,
  onAccept,
}) => {
  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-800 font-semibold">Available Requests</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text className="text-orange-500 font-semibold">View all</Text>
        </TouchableOpacity>
      </View>

      {!canShow ? (
        <View className="items-center justify-center py-10">
          <Feather name="users" size={28} color="#9CA3AF" />
          <Text className="text-gray-500 mt-2 text-center">
            Complete Onboarding to start taking requests
          </Text>
        </View>
      ) : (
        <View>
          {requests.slice(0, 2).map((req) => (
            <View
              key={req.bidID}
              className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm"
            >
              <Text className="text-base font-semibold text-gray-800 mb-1">
                {req.shipmentType || 'Shipment'}
              </Text>
              <Text className="text-xs text-gray-600 mb-3">
                Drop off: {req.stops[req.stops.length - 1]?.facilityID}
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => onReject(req.bidID)}
                  className="flex-1 mr-2 border border-gray-300 rounded-lg py-2 items-center"
                  activeOpacity={0.85}
                >
                  <Text className="text-gray-700 font-medium">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onAccept(req.bidID)}
                  className="flex-1 ml-2 bg-orange-500 rounded-lg py-2 items-center"
                  activeOpacity={0.85}
                >
                  <Text className="text-white font-semibold">Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {requests.length === 0 && (
            <View className="items-center justify-center py-10">
              <Feather name="inbox" size={28} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">No requests available now.</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default AvailableRequests;
