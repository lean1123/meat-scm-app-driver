import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getShipmentInfo, uploadDeliveryProof, uploadPickupProof } from '../api/driverApi';
import { RootState } from '../store/store';
import { ShipmentResponse, TimelineEvent } from '../types/shipment';

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
          uploadedBy: 'driver-7fcc3acd', // có thể lấy từ state.auth.userID
        },
      };

      return timelineEntry;
    } catch (error: any) {
      console.error('Error uploading proof:', error);
      return rejectWithValue(error.response?.data?.message || 'Cannot upload proof');
    }
  },
);

export const makeSelectTimelineByFacility = (facilityID: string) =>
  createSelector(
    (state: RootState) => state.selectedShipment?.selectedShipment?.timeline || [],
    (timeline) => timeline.filter((t) => t?.proof?.facilityID === facilityID),
  );

export const makeSelectStepByFacility = (facilityID: string) =>
  createSelector(makeSelectTimelineByFacility(facilityID), (timeline) => {
    const hasDelivery = timeline.some(
      (t) => t.type === 'delivery_proof_added' || t.type === 'arrival',
    );
    const hasPickup = timeline.some(
      (t) => t.type === 'pickup_proof_added' || t.type === 'pickup_confirmed',
    );

    if (hasDelivery) return 'completed';
    if (hasPickup) return 'waiting_delivery';
    return 'waiting_pickup';
  });

const shipmentSlice = createSlice({
  name: 'selectedShipment',
  initialState,
  reducers: {},
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
      })

      .addCase(uploadProofThunk.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.uploadError = action.payload as string;
      });
  },
});

export const shipmentActions = shipmentSlice.actions;
export default shipmentSlice.reducer;
