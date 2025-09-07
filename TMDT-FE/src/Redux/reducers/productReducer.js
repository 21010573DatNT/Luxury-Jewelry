import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: []
}

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        updateProduct: (state, action) => {
            const data = action.payload
            state.data = data
        },
    }
})

export const {updateProduct} = productSlice.actions

export default productSlice.reducer