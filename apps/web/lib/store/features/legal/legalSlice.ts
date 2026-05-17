import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LegalState {
  isOpen: boolean;
  content: 'terms' | 'privacy' | null;
}

const initialState: LegalState = {
  isOpen: false,
  content: null,
};

export const legalSlice = createSlice({
  name: 'legal',
  initialState,
  reducers: {
    openLegalModal: (state, action: PayloadAction<'terms' | 'privacy'>) => {
      state.isOpen = true;
      state.content = action.payload;
    },
    closeLegalModal: (state) => {
      state.isOpen = false;
      state.content = null;
    },
  },
});

export const { openLegalModal, closeLegalModal } = legalSlice.actions;

export default legalSlice.reducer;
