export interface ItemInShipmentAPI {
  productID: string;
  quantity: number;
  unit: string;
}

export interface BidAssignment {
  driverID: string;
  vehicleID: string;
}

export interface BidStop {
  facilityID: string;
  action: 'PICKUP' | 'DELIVERY';
  items: ItemInShipmentAPI[];
}

export interface TransportBid {
  id: string;
  bidID: string;
  shipmentType: string;
  stops: BidStop[];
  status: 'BIDDING' | 'CONFIRMED' | 'COMPLETED' | 'EXPIRED';
  biddingAssignments: BidAssignment[];
  confirmedAssignment?: BidAssignment;
  createdAt: string;
  confirmedAt?: string;
  originalRequestIDs: string[];
  shipmentID?: string;
}
