import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface initialStateTypes {
    name: string,
    email: string
}

const initialState = {
    name: "username",
    email: 'example@gmail.com'
}

const userDetailSlice = createSlice({
    name: "userDetailSlice",
    initialState: initialState,
    reducers: {
        setUserEmailAndUsername: (state, action: PayloadAction<initialStateTypes>) => {
            state.name = action.payload.name;
            state.email = action.payload.email
        }
    }
});

export const { setUserEmailAndUsername } = userDetailSlice.actions;
export default userDetailSlice.reducer 