import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../hooks/authSlice';
import shipmentReducer from '../hooks/useSelectorShipment';
import shipmentRequestReducer from '../hooks/useShipmentRequestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    selectedShipment: shipmentReducer,
    shipmentRequest: shipmentRequestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
