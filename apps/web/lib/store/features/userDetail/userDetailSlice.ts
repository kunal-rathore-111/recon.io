import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface initialStateTypes {
    name: string,
    email: string,
    image: string,
}

const initialState = {
    name: "username",
    email: 'example@gmail.com',
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
}

const userDetailSlice = createSlice({
    name: "userDetailSlice",
    initialState: initialState,
    reducers: {
        setUserEmailAndUsername: (state, action: PayloadAction<initialStateTypes>) => {
            state.name = action.payload.name;
            state.email = action.payload.email
            state.image = action.payload.image
        }
    }
});

export const { setUserEmailAndUsername } = userDetailSlice.actions;
export default userDetailSlice.reducer 