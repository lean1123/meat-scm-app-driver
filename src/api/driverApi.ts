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

export const uploadPickupProof = async (shipmentID: string, facilityID: string, formData: any) => {
  const res = await axiosClient.post(
    `/shipments/${shipmentID}/stops/${facilityID}/pickup-photo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res.data;
};

export const startDelivery = async (shipmentID: string) => {
  const res = await axiosClient.post(`/shipments/${shipmentID}/start`);
  return res.data;
};

export const uploadDeliveryProof = async (
  shipmentID: string,
  facilityID: string,
  formData: any,
) => {
  const res = await axiosClient.post(
    `/shipments/${shipmentID}/stops/${facilityID}/delivery-photo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res.data;
};

export const getShipmentInfo = async (shipmentID: string) => {
  const res = await axiosClient.get(`/shipments/${shipmentID}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getShipmentByDriverId = async (driverID: string) => {
  const res = await axiosClient.get(`/drivers/${driverID}/shipments`);
  return res.data;
};
