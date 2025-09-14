export type Quantity = {
  unit: string;
  value: number;
};

export type ShipmentItem = {
  assetID: string;
  quantity: Quantity;
};

export type FacilityAddress = {
  fullText: string;
  latitude: number;
  longitude: number;
};

export type ShipmentStop = {
  facilityID: string;
  facilityName: string;
  facilityAddress: FacilityAddress;
  action: 'PICKUP' | 'DELIVERY';
  status: ShipmentStatus;
  items: ShipmentItem[];
};

export type Proof = {
  photoHash?: string;
  photoURL?: string;
  uploadedBy?: string;
  facilityID?: string;
};

export type TimelineEvent = {
  type:
    | 'pickup_confirmed'
    | 'departure'
    | 'arrival'
    | 'pickup_proof_added'
    | 'delivery_proof_added'
    | string;
  timestamp: string;
  location: string;
  proof: Proof;
};

export type HistoryRecord = {
  type: string;
  actorMSP: string;
  actorID: string;
  timestamp: string;
  txID: string;
  details: string;
};

export enum ShipmentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  DELIVERING = 'DELIVERING',
  CANCELLED = 'CANCELLED',
}

export type ShipmentResponse = {
  docType: 'ShipmentAsset';
  shipmentID: string;
  shipmentType: string;
  driverEnrollmentID?: string;
  driverName?: string;
  vehiclePlate?: string;
  status: ShipmentStatus;
  stops: ShipmentStop[];
  timeline?: TimelineEvent[];
  history?: HistoryRecord[];
};
