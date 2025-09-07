import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderItems : [],
    paymentMethod:'',
    itemsPrice: 0,
    amount:0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        deleteAllOrder: (state, action) => {
            state.orderItems = [];
        },

        addOrder: (state, action) => {
            const {orderItem} = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product_id === orderItem.product_id)
            if(itemOrder){
                itemOrder.amount += parseInt(orderItem?.amount)
            } else {
                state.orderItems.push(orderItem)
            }
        },

        increaseAmount: (state, action) => {
            const {orderItem} = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product_id === orderItem.product_id)
            if (itemOrder) {
                itemOrder.amount += 1
            }
        },

        decreaseAmount: (state, action) => {
            const {orderItem} = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product_id === orderItem.product_id)
            if (itemOrder && itemOrder.amount > 1) {
                itemOrder.amount -= 1
            }
        },

        removeOrder: (state, action) => {
            const {orderItem} = action.payload
            state.orderItems = state.orderItems.filter(item => item.product_id !== orderItem.product_id);
        },
    }
})

export const {deleteAllOrder, addOrder, increaseAmount, decreaseAmount, removeOrder} = orderSlice.actions

export default orderSlice.reducer