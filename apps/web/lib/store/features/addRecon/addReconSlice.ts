import { createSlice } from "@reduxjs/toolkit";

const initial = {
    addReconState: false
}

const addReconSlice = createSlice({
    name: "addReconSlice",
    initialState: initial,
    reducers: {
        setAddReconReducer: (state) => {
            state.addReconState = !state.addReconState
        }
    }
});

export const { setAddReconReducer } = addReconSlice.actions;

export default addReconSlice.reducer;
