import { configureStore } from "@reduxjs/toolkit";
import uiSlice from './uiSlice'
import cartSlice from './cartSlice'



const store = configureStore({
    reducer: {cart: cartSlice.reducer, ui: uiSlice.reducer }
});

export default store;