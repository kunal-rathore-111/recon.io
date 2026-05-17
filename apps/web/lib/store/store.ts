import { configureStore } from '@reduxjs/toolkit';
import legalReducer from './features/legal/legalSlice';

export const store = configureStore({
  reducer: {
    legal: legalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>