import { configureStore } from '@reduxjs/toolkit';
import legalReducer from './features/legal/legalSlice';
import addReconReducer from './features/addRecon/addReconSlice';
import uiReducer from './features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    legal: legalReducer,
    addRecon: addReconReducer,
    ui: uiReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;