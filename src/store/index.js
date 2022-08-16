import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn : localStorage.getItem("access_token") && localStorage.getItem("access_token").length ? true : false,
        accessToken: localStorage.getItem("access_token"),
        user_id: localStorage.getItem("user_id"),
        user_name: localStorage.getItem("user_name")
    },
    reducers: {
        login: (state, {payload}) => {
            state.isLoggedIn = true;
            localStorage.setItem("access_token", payload.access_token);
            localStorage.setItem("user_id", payload.user.id);
            localStorage.setItem("user_name", payload.user.name);
            state.accessToken = localStorage.getItem("access_token");
            state.user_id = localStorage.getItem("user_id");
            state.user_name = localStorage.getItem("user_name");
        },
        logout: (state) => {
            state.isLoggedIn = false;
            localStorage.setItem("access_token", '');
            localStorage.setItem("user_id", '');
            localStorage.setItem("user_name", '');
            state.accessToken = localStorage.getItem("access_token");
            state.user_id = localStorage.getItem("user_id");
            state.user_name = localStorage.getItem("user_name");
        },
    }
});

////////////////////////

export const authActions = authSlice.actions

export const store = configureStore({
    reducer: authSlice.reducer
});