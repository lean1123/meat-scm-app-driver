import axiosClient from './axiosClient';

export const driverAcceptShipment = async (data: {
  shipmentID: string;
  shipmentType: string;
  driverName: string;
  vehiclePlate: string;
  stops: any[];
}) => {
  const res = await axiosClient.post('/shipments', data);
  return res.data;
};

export const uploadPickupProof = async (
  shipmentID: string,
  facilityID: string,
  photoURL: string,
  photoHash: string,
) => {
  const res = await axiosClient.post(`/shipments/${shipmentID}/stops/${facilityID}/pickup-photo`, {
    photoURL,
    photoHash,
  });
  return res.data;
};

export const startDelivery = async (shipmentID: string) => {
  const res = await axiosClient.post(`/shipments/${shipmentID}/start`);
  return res.data;
};

export const uploadDeliveryProof = async (
  shipmentID: string,
  facilityID: string,
  photoURL: string,
  photoHash: string,
) => {
  const res = await axiosClient.post(
    `/shipments/${shipmentID}/stops/${facilityID}/delivery-photo`,
    { photoURL, photoHash },
  );
  return res.data;
};

export const getShipmentInfo = async (shipmentID: string) => {
  const res = await axiosClient.get(`/shipments/${shipmentID}`);
  return res.data;
};
