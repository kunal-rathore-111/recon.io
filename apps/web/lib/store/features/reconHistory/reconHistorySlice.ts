import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface initialStateInterface {
    reconHistoryState: string | null;
}
const initialState: initialStateInterface = { reconHistoryState: null };

export const reconHistorySlice = createSlice({
    name: "reconHistorySlice",
    initialState,
    reducers: {
        setReconHistory: (state, action: PayloadAction<string | null>) => {
            state.reconHistoryState = action.payload
        }
    }
})

export const { setReconHistory } = reconHistorySlice.actions;

export default reconHistorySlice.reducer;
