import { configureStore } from '@reduxjs/toolkit';
import legalReducer from './features/legal/legalSlice';
import addReconReducer from './features/addRecon/addReconSlice';
import uiReducer from './features/ui/uiSlice';
import reconHistoryReducer from './features/reconHistory/reconHistorySlice';
import userDetailsReducer from './features/userDetail/userDetailSlice';

export const store = configureStore({
  reducer: {
    legal: legalReducer,
    addRecon: addReconReducer,
    ui: uiReducer,
    history: reconHistoryReducer,
    userDetails: userDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;