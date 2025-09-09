import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getShipmentInfo, uploadDeliveryProof, uploadPickupProof } from '../api/driverApi';
import { ShipmentResponse } from '../types/shipment';

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
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      console.log('Uploading proof with payload:', payload);

      let data;
      if (payload.step === 'pickup') {
        data = await uploadPickupProof(payload.shipmentID, payload.facilityID, payload.formData);
      } else {
        data = await uploadDeliveryProof(payload.shipmentID, payload.facilityID, payload.formData);
      }

      // data.facilityID = payload.facilityID;
      // data.shipmentID = payload.shipmentID;
      // data.type = payload.step === 'pickup' ? 'pickup_confirmed' : 'arrival';

      return data;
    } catch (error: any) {
      console.error('Error uploading proof:', error);
      return rejectWithValue(error.response?.data?.message || 'Cannot upload proof');
    }
  },
);

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
        if (state.selectedShipment?.timeline) {
          state.selectedShipment.timeline = [...state.selectedShipment.timeline, action.payload];
        }
      })
      .addCase(uploadProofThunk.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.uploadError = action.payload as string;
      });
  },
});

export const shipmentActions = shipmentSlice.actions;
export default shipmentSlice.reducer;
