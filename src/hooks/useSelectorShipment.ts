import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { getShipmentInfo, uploadDeliveryProof, uploadPickupProof } from '../api/driverApi';
import { RootState } from '../store/store';
import { ShipmentResponse } from '../types/shipment';

interface SelectedShipmentState {
  selectedShipment: ShipmentResponse | null;
  localShipmentChanges: Partial<ShipmentResponse> | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  uploadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  uploadError: string | null;
}

const initialState: SelectedShipmentState = {
  selectedShipment: null,
  localShipmentChanges: null,
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

      data.facilityID = payload.facilityID;
      data.shipmentID = payload.shipmentID;
      data.type = payload.step === 'pickup' ? 'pickup_confirmed' : 'arrival';
      data.tempId = payload.tempId;

      return data;
    } catch (error: any) {
      console.error('Error uploading proof:', error);
      return rejectWithValue(error.response?.data?.message || 'Cannot upload proof');
    }
  },
);

export const useSelectedShipment = () => {
  return useSelector((state: RootState) => {
    const { selectedShipment, localShipmentChanges } = state.selectedShipment;

    if (!selectedShipment) return null;
    console.log('Local Timeline Change: ', localShipmentChanges?.timeline);

    return {
      ...selectedShipment,
      ...localShipmentChanges,
      timeline: [...(selectedShipment.timeline || []), ...(localShipmentChanges?.timeline || [])],
    };
  });
};

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
      // .addCase(uploadProofThunk.fulfilled, (state, action) => {
      //   // state.uploadStatus = 'succeeded';
      //   // if (state.selectedShipment?.timeline) {
      //   //   state.selectedShipment.timeline = [...state.selectedShipment.timeline, action.payload];
      //   // }
      //   // if (state.localShipmentChanges) {
      //   //   state.localShipmentChanges = state.selectedShipment;
      //   // }

      //   state.uploadStatus = 'succeeded';

      //   const confirmedProof = action.payload;

      //   if (state.localShipmentChanges?.timeline) {
      //     state.localShipmentChanges.timeline = state.localShipmentChanges.timeline.filter(
      //       (item) => item.tempId !== confirmedProof.tempId,
      //     );
      //   }

      //   if (state.selectedShipment?.timeline) {
      //     state.selectedShipment.timeline = [...state.selectedShipment.timeline, confirmedProof];
      //   }
      // })
      .addCase(uploadProofThunk.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        const confirmedProof = action.payload;
        if (!state.localShipmentChanges) {
          state.localShipmentChanges = {};
        }
        if (!state.localShipmentChanges.timeline) {
          state.localShipmentChanges.timeline = [];
          state.localShipmentChanges.timeline.push(confirmedProof);
        }

        if (state.selectedShipment?.timeline) {
          state.selectedShipment.timeline = [...state.selectedShipment.timeline, confirmedProof];
        }

        if (state.localShipmentChanges?.timeline) {
          state.localShipmentChanges.timeline = [
            ...state.localShipmentChanges.timeline,
            confirmedProof,
          ];
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
