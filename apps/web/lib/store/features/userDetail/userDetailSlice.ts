import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface initialStateTypes {
    userFullName: string,
    email: string
}

const initialState = {
    userFullName: "username",
    email: 'example@gmail.com'
}

const userDetailSlice = createSlice({
    name: "userDetailSlice",
    initialState: initialState,
    reducers: {
        setUserEmailAndUsername: (state, action: PayloadAction<initialStateTypes>) => {
            state.userFullName = action.payload.userFullName;
            state.email = action.payload.email
        }
    }
});

export const { setUserEmailAndUsername } = userDetailSlice.actions;
export default userDetailSlice.reducer 