import { ShipmentResponse, ShipmentStatus } from '../types/shipment';

export const FAKE_SHIPMENT_REQUEST: ShipmentResponse = {
  docType: 'ShipmentAsset',
  shipmentID: 'SHIP-REQ-DEMO-001',
  shipmentType: 'Hàng tươi sống',
  driverEnrollmentID: '',
  driverName: '',
  vehiclePlate: '',
  status: ShipmentStatus.PENDING,
  stops: [
    {
      facilityID: 'FARM-01',
      facilityName: 'Nông trại Đà Lạt',
      action: 'PICKUP',
      status: ShipmentStatus.PENDING,
      items: [{ assetID: 'STRAWBERRY-BATCH-01', quantity: { unit: 'kg', value: 100 } }],
      facilityAddress: {
        fullText: 'Nông trại Đà Lạt, Lâm Đồng, Việt Nam',
        latitude: 11009,
        longitude: 10824,
      },
    },
    {
      facilityID: 'WAREHOUSE-01',
      facilityName: 'Kho lạnh Thủ Đức',
      action: 'PICKUP',
      status: ShipmentStatus.PENDING,
      items: [{ assetID: 'STRAWBERRY-BATCH-01', quantity: { unit: 'kg', value: 100 } }],
      facilityAddress: {
        fullText: 'Nông trại Đà Lạt, Lâm Đồng, Việt Nam',
        latitude: 11009,
        longitude: 10824,
      },
    },
  ],
  timeline: [],
};
