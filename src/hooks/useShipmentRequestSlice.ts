import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransportBid } from '../types/bid';

interface RequestState {
  requests: TransportBid[];
  isNotificationVisible: boolean;
}

const initialState: RequestState = {
  requests: [],
  isNotificationVisible: false,
};

const shipmentRequestSlice = createSlice({
  name: 'shipmentRequest',
  initialState,
  reducers: {
    addRequest: (state, action: PayloadAction<TransportBid>) => {
      if (!state.requests.find((req) => req.bidID === action.payload.bidID)) {
        state.requests.unshift(action.payload);
        state.isNotificationVisible = true;
      }
    },
    removeRequest: (state, action: PayloadAction<{ bidID: string }>) => {
      state.requests = state.requests.filter((req) => req.bidID !== action.payload.bidID);
    },
    dismissNotification: (state) => {
      state.isNotificationVisible = false;
    },
  },
});

export const { addRequest, removeRequest, dismissNotification } = shipmentRequestSlice.actions;
export default shipmentRequestSlice.reducer;
