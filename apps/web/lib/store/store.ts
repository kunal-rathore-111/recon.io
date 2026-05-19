import { configureStore } from '@reduxjs/toolkit';
import legalReducer from './features/legal/legalSlice';
import addReconReducer from './features/addRecon/addReconSlice';
import uiReducer from './features/ui/uiSlice';
import reconHistoryReducer from './features/reconHistory/reconHistorySlice';

export const store = configureStore({
  reducer: {
    legal: legalReducer,
    addRecon: addReconReducer,
    ui: uiReducer,
    history: reconHistoryReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;