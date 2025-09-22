export type VehicleType = 'TRUCK' | 'VAN' | 'MOTORBIKE';
export type VehicleStatus = 'AVAILABLE' | 'IN_TRIP' | 'MAINTENANCE';

export interface VehicleSpecs {
  type: VehicleType;
  refrigerated: boolean;
  payloadTonnes: number;
  volumeCBM: number;
}

export interface MediaPointer {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
}

export interface Vehicle {
  id: string;
  vehicleID: string;
  plateNumber: string;
  ownerDriverID: string;
  model: string;
  specs: VehicleSpecs;
  status: VehicleStatus;
  registrationDocs?: MediaPointer[];
  createdAt: string;
  updatedAt: string;
}
