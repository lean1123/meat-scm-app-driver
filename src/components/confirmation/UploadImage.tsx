import { AppDispatch } from '@/src/store/store';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { uploadProofThunk } from '../../hooks/useSelectorShipment';

import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';

type Props = {
  onImagesChange?: (images: string[]) => void;
  onSend: (images: string[]) => void;
  shipmentID?: string;
  facilityID?: string;
  step?: 'pickup' | 'delivery';
};

const UploadImageComponent: React.FC<Props> = ({
  onImagesChange,
  onSend,
  facilityID,
  step,
  shipmentID,
}: Props) => {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images, result.assets[0].uri];
      setImages(newImages);
      if (onImagesChange) {
        onImagesChange(newImages);
      }
    }
  };

  const handleImageUpload = async () => {
    if (!images || images.length === 0) return;

    setUploading(true);
    try {
      const uploadedLinks: string[] = [];

      for (let uri of images) {
        const formData = new FormData();
        const tempId = Date.now().toString();
        formData.append('photo', {
          uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);
        if (shipmentID && facilityID && step) {
          const cloudUrl = await dispatch(
            uploadProofThunk({
              step,
              shipmentID: shipmentID || '',
              facilityID: facilityID || '',
              formData,
              tempId,
            }),
          ).unwrap();
          uploadedLinks.push(cloudUrl);
        } else {
          throw new Error('Missing shipmentID, facilityID, or step in UploadImageComponent');
        }
      }

      setConfirmModal(false);
      onSend(uploadedLinks);
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Lỗi upload ảnh!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
        {[...images.slice(0, 3), ...(images.length > 3 ? [null] : [])].map((uri, index) =>
          uri ? (
            <View
              key={index}
              className="mr-2 mb-2 rounded overflow-hidden w-20 h-20 border border-orange-500 relative"
            >
              <TouchableOpacity
                style={{ width: '100%', height: '100%' }}
                onPress={() => setModalVisible(true)}
              >
                <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
              </TouchableOpacity>
              <TouchableOpacity
                className="absolute top-2 right-2 bg-white/80 rounded-full"
                onPress={() => {
                  const newImages = [...images];
                  newImages.splice(index, 1);
                  setImages(newImages);
                }}
              >
                <Ionicons name="close" size={16} color="#f97316" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              key={'more'}
              onPress={() => setModalVisible(true)}
              className="w-20 h-20 mr-2 mb-2 rounded border border-gray-300 bg-gray-200 justify-center items-center"
            >
              <Text style={{ fontSize: 18, fontWeight: '600' }}>+{images.length - 3}</Text>
            </TouchableOpacity>
          ),
        )}
        {images.length > 3 && <View style={{ width: '100%' }} />}
        <TouchableOpacity
          onPress={pickImage}
          className="w-20 h-20 rounded bg-orange-100 justify-center items-center border border-orange-500 mb-2"
        >
          <Ionicons name="camera" size={28} color="#f97316" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className="mt-4 bg-orange-500 p-4 rounded-2xl"
        onPress={() => setConfirmModal(true)}
      >
        <Text className="text-white font-medium text-base text-center">Gửi</Text>
      </TouchableOpacity>

      {/* Modal xác nhận gửi hình */}
      <Modal visible={confirmModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white p-6 rounded-2xl w-80">
            <Text className="text-xl font-bold mb-4">Xác nhận gửi hình</Text>
            <Text className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn gửi {images.length} hình này?
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-300 py-2 px-4 rounded-lg"
                onPress={() => setConfirmModal(false)}
              >
                <Text className="font-bold">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-orange-500 py-2 px-4 rounded-lg"
                disabled={uploading}
                onPress={handleImageUpload}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold">Xác nhận</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <FlatList
            data={images}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: '100%', height: 300, marginBottom: 10 }}
                resizeMode="contain"
              />
            )}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="absolute top-10 right-5 bg-white/80 rounded-full p-2"
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default UploadImageComponent;
