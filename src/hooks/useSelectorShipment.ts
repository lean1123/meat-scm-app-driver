import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getShipmentInfo,
  startDelivery,
  uploadDeliveryProof,
  uploadPickupProof,
} from '../api/driverApi';
import { RootState } from '../store/store';
import { ShipmentResponse, ShipmentStatus, TimelineEvent } from '../types/shipment';

interface SelectedShipmentState {
  selectedShipment: ShipmentResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  uploadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  uploadError: string | null;
}

const initialState: SelectedShipmentState = {
  selectedShipment: null,
  status: 'idle',
  error: null,
  uploadStatus: 'idle',
  uploadError: null,
};

export const fetchShipmentById = createAsyncThunk(
  'shipment/fetchShipmentById',
  async (shipmentId: string, { rejectWithValue }) => {
    try {
      const data = await getShipmentInfo(shipmentId);
      return data;
    } catch (error: any) {
      console.error('Error fetching shipment by ID:', error);
      return rejectWithValue(error.response?.data?.message || 'Cannot fetch shipment by ID');
    }
  },
);

export const uploadProofThunk = createAsyncThunk(
  'shipment/uploadProof',
  async (
    payload: {
      step: 'pickup' | 'delivery';
      shipmentID: string;
      facilityID: string;
      formData: any;
      tempId: string;
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      let data;
      if (payload.step === 'pickup') {
        data = await uploadPickupProof(payload.shipmentID, payload.facilityID, payload.formData);
      } else {
        data = await uploadDeliveryProof(payload.shipmentID, payload.facilityID, payload.formData);
      }

      const timelineEntry = {
        type: payload.step === 'pickup' ? 'pickup_proof_added' : 'delivery_proof_added',
        timestamp: new Date().toISOString(),
        location: '',
        facilityID: '',
        proof: {
          facilityID: payload.facilityID,
          photoHash: data.photoHash,
          photoURL: data.photoURL,
          uploadedBy: 'driver-7fcc3acd',
        },
      };

      return timelineEntry;
    } catch (error: any) {
      console.error('Error uploading proof:', error);
      return rejectWithValue(error.response?.data?.message || 'Cannot upload proof');
    }
  },
);

export const startDeliveryThunk = createAsyncThunk(
  'shipment/startDelivery',
  async (shipmentID: string, { rejectWithValue }) => {
    try {
      await startDelivery(shipmentID);
      return shipmentID;
    } catch (error: any) {
      console.error('Error starting delivery:', error);
      return rejectWithValue(error.response?.data?.message || 'Cannot start delivery');
    }
  },
);

export const makeSelectStopByFacility = (facilityID: string) =>
  createSelector(
    (state: RootState) => state.selectedShipment?.selectedShipment?.stops || [],
    (stops) => stops.find((t) => t?.facilityID === facilityID),
  );

export const makeSelectStepByFacility = (facilityID: string) =>
  createSelector(makeSelectStopByFacility(facilityID), (stop) => {
    const pendingPickup = stop?.action === 'PICKUP' && stop?.status === ShipmentStatus.PENDING;
    const pendingDelivery = stop?.action === 'DELIVERY' && stop?.status === ShipmentStatus.PENDING;
    const hasDelivered = stop?.action === 'DELIVERY' && stop?.status === ShipmentStatus.UPLOADING;
    const hasPickuped = stop?.action === 'PICKUP' && stop?.status === ShipmentStatus.UPLOADING;
    const completedPickup = stop?.action === 'PICKUP' && stop?.status === ShipmentStatus.COMPLETED;

    if (pendingPickup) return 'waiting_pickup';
    if (pendingDelivery) return 'waiting_delivery';
    if (completedPickup) return 'ready_to_start_delivery';
    if (hasPickuped) return 'completed_pickup';
    if (hasDelivered) return 'completed_delivery';
    return 'waiting_pickup';
  });

const shipmentSlice = createSlice({
  name: 'selectedShipment',
  initialState,
  reducers: {
    stopCompleted: (state, action: PayloadAction<{ shipmentID: string; facilityID: string }>) => {
      const { shipmentID, facilityID } = action.payload;

      if (state.selectedShipment && state.selectedShipment.shipmentID === shipmentID) {
        const newStops = state.selectedShipment.stops.map((stop) => {
          if (stop.facilityID === facilityID) {
            return { ...stop, status: ShipmentStatus.COMPLETED };
          }
          return stop;
        });
        state.selectedShipment = {
          ...state.selectedShipment,
          stops: newStops,
        };
      }
    },
    shipmentCompleted: (state) => {
      if (state.selectedShipment) {
        state.selectedShipment.status = ShipmentStatus.COMPLETED;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipmentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action: PayloadAction<ShipmentResponse>) => {
        state.status = 'succeeded';
        state.selectedShipment = action.payload;
      })
      .addCase(fetchShipmentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(uploadProofThunk.pending, (state) => {
        state.uploadStatus = 'loading';
        state.uploadError = null;
      })
      .addCase(uploadProofThunk.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        const confirmedProof: TimelineEvent = action.payload;
        if (!state.selectedShipment) return;
        if (!state.selectedShipment.timeline) state.selectedShipment.timeline = [];

        state.selectedShipment.timeline = [...state.selectedShipment.timeline, confirmedProof];

        const facilityID = confirmedProof.proof.facilityID;
        if (!facilityID) return;

        const newStops = state.selectedShipment.stops.map((stop) => {
          if (stop.facilityID === facilityID) {
            return { ...stop, status: ShipmentStatus.UPLOADING };
          }
          return stop;
        });
        state.selectedShipment = {
          ...state.selectedShipment,
          stops: newStops,
        };
      })

      .addCase(uploadProofThunk.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.uploadError = action.payload as string;
      })
      .addCase(startDeliveryThunk.fulfilled, (state, action) => {
        const shipmentID = action.payload;
        if (state.selectedShipment && state.selectedShipment.shipmentID === shipmentID) {
          state.selectedShipment.status = ShipmentStatus.IN_TRANSIT;
        }
      })
      .addCase(startDeliveryThunk.rejected, (state, action) => {
        console.error('Failed to start delivery:', action.payload);
      });
  },
});

export const { stopCompleted } = shipmentSlice.actions;
export default shipmentSlice.reducer;
