import { ShipmentResponse, ShipmentStatus } from '@/src/types/shipment';

export const trips = [
  {
    id: '1',
    name: 'John Doe',
    address: '6391 Elgin St. Celina, Delaware 10299',
    product: 'Product - 02',
    price: '$52.01',
    distance: '14 mi',
    wo: 'WO# 04-1209',
  },
  {
    id: '2',
    name: 'John Doe',
    address: '6391 Elgin St. Celina, Delaware 10299',
    product: 'Product - 02',
    price: '$52.01',
    distance: '14 mi',
    wo: 'WO# 04-1209',
  },
  {
    id: '3',
    name: 'John Doe',
    address: '6391 Elgin St. Celina, Delaware 10299',
    product: 'Product - 02',
    price: '$52.01',
    distance: '14 mi',
    wo: 'WO# 04-1209',
  },
];

export const shipments = [
  {
    id: 'SHIP-001',
    shipmentName: 'Chở gia súc nông trại X',
    createdBy: 'admin-user',
    shipmentType: 'LIVE_ANIMALS',
    deliveryAddress: '123 Đường Nông Trại, Quận 1, TP.HCM',
    isDelivered: false,
    shipmentStatus: ShipmentStatus.PENDING,
    stops: [
      {
        facilityId: 'FARM-01',
        action: 'PICKUP',
        items: [
          {
            assetID: 'FARM-BATCH-010',
            quantity: { unit: 'con', value: 15 },
            images: [
              'https://example.com/images/pickup-batch-010-1.jpg',
              'https://example.com/images/pickup-batch-010-2.jpg',
            ],
          },
        ],
        isVerified: true,
      },
      {
        facilityId: 'MARKET-01',
        action: 'DELIVERY',
        items: [
          {
            assetID: 'FARM-BATCH-010',
            quantity: { unit: 'con', value: 15 },
            images: [],
          },
        ],
        isVerified: false,
      },
    ],
  },
  {
    id: 'SHIP-002',
    shipmentName: 'Giao thịt đông lạnh kho 02',
    createdBy: 'dispatcher-user',
    shipmentType: 'FROZEN_MEAT',
    deliveryAddress: '123 Đường Nông Trại, Quận 1, TP.HCM',
    isDelivered: false,
    shipmentStatus: ShipmentStatus.PENDING,
    stops: [
      {
        facilityId: 'WAREHOUSE-02',
        action: 'PICKUP',
        items: [
          {
            assetID: 'MEAT-BATCH-021',
            quantity: { unit: 'kg', value: 200 },
            images: ['https://example.com/images/pickup-batch-021-1.jpg'],
          },
        ],
        isVerified: true,
      },
      {
        facilityId: 'SUPERMARKET-05',
        action: 'DELIVERY',
        items: [
          {
            assetID: 'MEAT-BATCH-021',
            quantity: { unit: 'kg', value: 200 },
            images: ['https://example.com/images/delivery-batch-021-1.jpg'],
          },
        ],
        isVerified: true,
      },
    ],
  },
];

export const shippedItems: ShipmentResponse[] = [
  {
    id: 'SHIP-001',
    shipmentName: 'Chở gia súc nông trại X',
    createdBy: 'admin-user',
    shipmentType: 'LIVE_ANIMALS',
    driverEnrollmentID: 'worker-f05b3dfd',
    driverName: 'Tài xế A',
    vehiclePlate: '51A-11111',
    deliveryAddress: '123 Đường Nông Trại, Quận 1, TP.HCM',
    isDelivered: true,
    shipmentStatus: ShipmentStatus.DELIVERIED,
    stops: [
      {
        facilityId: 'FARM-01',
        action: 'PICKUP',
        items: [
          {
            assetID: 'FARM-BATCH-010',
            quantity: { unit: 'con', value: 15 },
            images: [
              'https://example.com/images/pickup-batch-010-1.jpg',
              'https://example.com/images/pickup-batch-010-2.jpg',
            ],
          },
        ],
        isVerified: true,
      },
      {
        facilityId: 'MARKET-01',
        action: 'DELIVERY',
        items: [
          {
            assetID: 'FARM-BATCH-010',
            quantity: { unit: 'con', value: 15 },
            images: [],
          },
        ],
        isVerified: false,
      },
    ],
  },
  {
    id: 'SHIP-002',
    shipmentName: 'Giao thịt đông lạnh kho 02',
    createdBy: 'dispatcher-user',
    shipmentType: 'FROZEN_MEAT',
    driverEnrollmentID: 'worker-f05b3dfd',
    driverName: 'Tài xế A',
    vehiclePlate: '51A-11111',
    deliveryAddress: '123 Đường Nông Trại, Quận 1, TP.HCM',
    isDelivered: true,
    shipmentStatus: ShipmentStatus.DELIVERIED,
    stops: [
      {
        facilityId: 'WAREHOUSE-02',
        action: 'PICKUP',
        items: [
          {
            assetID: 'MEAT-BATCH-021',
            quantity: { unit: 'kg', value: 200 },
            images: ['https://example.com/images/pickup-batch-021-1.jpg'],
          },
        ],
        isVerified: true,
      },
      {
        facilityId: 'SUPERMARKET-05',
        action: 'DELIVERY',
        items: [
          {
            assetID: 'MEAT-BATCH-021',
            quantity: { unit: 'kg', value: 200 },
            images: ['https://example.com/images/delivery-batch-021-1.jpg'],
          },
        ],
        isVerified: true,
      },
    ],
  },
];
