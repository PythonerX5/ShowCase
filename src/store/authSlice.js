import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false
};

const auhtSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        //Kullanıcı giriş yaptığında veya kayıt olduğunda çalışır
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        //çıkış yapıldığında çalışır
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },

    }
})

export const { setUser, logoutUser } = auhtSlice.actions;
export default auhtSlice.reducer;