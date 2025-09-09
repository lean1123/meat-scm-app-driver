import { ShipmentResponse, ShipmentStatus } from '../types/shipment';

export const shipments: ShipmentResponse[] = [
  {
    docType: 'ShipmentAsset',
    shipmentID: 'SHIP-LIVE-ANIMAL-01',
    shipmentType: 'LIVE_ANIMAL',
    driverEnrollmentID: 'driver-213da980',
    driverName: 'Tài xế A',
    vehiclePlate: '51A-11111',
    status: ShipmentStatus.PENDING,
    stops: [
      {
        facilityID: 'farm-a',
        facilityName: 'Nông trại sạch A',
        facilityAddress: {
          fullText: 'Ngã tư Vũng Tàu, Quốc lộ 51, Phường An Hòa, TP. Biên Hòa, Đồng Nai',
          latitude: 10.936,
          longitude: 106.8735,
        },
        action: 'PICKUP',
        status: ShipmentStatus.PENDING,
        items: [
          {
            assetID: 'FARM-BATCH-101',
            quantity: {
              unit: 'con',
              value: 20,
            },
          },
        ],
      },
      {
        facilityID: 'processor-b',
        facilityName: 'Nhà máy chế biến B',
        facilityAddress: {
          fullText: 'Khu công nghiệp Amata, Long Bình, TP. Biên Hòa, Đồng Nai',
          latitude: 10.9446,
          longitude: 106.8902,
        },
        action: 'DELIVERY',
        status: ShipmentStatus.PENDING,
        items: [
          {
            assetID: 'FARM-BATCH-101',
            quantity: {
              unit: 'con',
              value: 20,
            },
          },
        ],
      },
    ],
    timeline: [
      // {
      //   type: 'pickup_confirmed',
      //   timestamp: '2025-09-02T06:56:47Z',
      //   location: 'Ngã tư Vũng Tàu, Quốc lộ 51, Phường An Hòa, TP. Biên Hòa, Đồng Nai',
      //   proof: {
      //     photoHash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
      //     photoURL: 'https://your-s3-bucket.s3.amazonaws.com/proofs/SHP-TEST-001-farm-a.jpg',
      //     uploadedBy: 'driver-213da980',
      //   },
      //   facilityID: 'farm-a',
      // },
      // {
      //   type: 'departure',
      //   timestamp: '2025-09-02T06:58:08Z',
      //   location: 'Ngã tư Vũng Tàu, Quốc lộ 51, Phường An Hòa, TP. Biên Hòa, Đồng Nai',
      //   proof: {},
      //   facilityID: 'farm-a',
      // },
      // {
      //   type: 'arrival',
      //   timestamp: '2025-09-02T06:58:56Z',
      //   location: 'Khu công nghiệp Amata, Long Bình, TP. Biên Hòa, Đồng Nai',
      //   proof: {
      //     photoHash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3dee5f6a1b2c3dfdfe5f6a1b2',
      //     photoURL: 'https://your-s3-bucket.s3.amazonaws.com/proofs/SHP-TEST-003-farm-a.jpg',
      //     uploadedBy: 'driver-213da980',
      //   },
      //   facilityID: 'processor-b',
      // },
    ],
    history: [
      {
        type: 'SHIPMENT_CREATED',
        actorMSP: 'MeatSupplyOrgMSP',
        actorID: 'driver-213da980',
        timestamp: '2025-09-02T06:53:47Z',
        txID: '1814f9141aafd3910162b1db99d55eb024a9706acc06ca5961b3a0808c0d4ef3',
        details: 'Shipment created and pending.',
      },
    ],
  },
];
