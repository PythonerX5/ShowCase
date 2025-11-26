import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import seriesReducer from './SeriesSlice'

export const store = configureStore({
    reducer: {
        auth : authReducer,
        series: seriesReducer
    }
})