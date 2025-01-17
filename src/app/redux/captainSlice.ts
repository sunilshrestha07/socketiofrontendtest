// CaptainSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CaptainState {
    loading: boolean;
    error: string | null;
    currentCaptain: Captain | null; // Update to use a specific Captain type
}

interface Captain {
    avatar: string;
    name:string,
    _id:string,
    email:string,
    role:string,
    location: {
        latitude: number;
        longitude: number;
      };
    vehicle:{
        color:string,
        plate:string,
        vehicleType:string
    }
}


const initialState: CaptainState = {
    loading: false,
    error: null,
    currentCaptain: null
};

const CaptainSlice = createSlice({
    name: 'Captain',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<Captain>) {
            state.loading = false;
            state.error = null;
            state.currentCaptain = action.payload;
        },
        loginFail(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.currentCaptain = null;
        },
        logout(state) {
            state.currentCaptain= null
        },
        updateSuccess(state, action: PayloadAction<Captain>) {
            state.loading = false;
            state.error = null;
            state.currentCaptain = action.payload;
        },
        deleteSuccess(state){
            state.currentCaptain= null
        }
    }
});

export const { loginSuccess, loginFail,logout ,updateSuccess,deleteSuccess} = CaptainSlice.actions;
export default CaptainSlice.reducer;
