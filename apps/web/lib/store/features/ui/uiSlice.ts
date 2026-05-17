import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { reconDataResponseType } from "@/app/actions/getRecons";

export interface UiState {
    longSelectedCard: reconDataResponseType | null;
}

const initialState: UiState = {
    longSelectedCard: null
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setLongSelectedCard: (state, action: PayloadAction<reconDataResponseType | null>) => {
            state.longSelectedCard = action.payload;
        }
    }
});

export const { setLongSelectedCard } = uiSlice.actions;
export default uiSlice.reducer;
