import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fullName: '',
    address: '',
    phone: '',
    email: '',
    token: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {fullName,address, phone, email, token} = action.payload
            state.fullName = fullName
            state.address = address
            state.phone = phone
            state.email = email
            state.token = token
        },
        remoteUser: (state) => {
            state.fullName = ""
            state.email = ""
            state.token = ""
            state.address = ""
            state.phone = ""
        }
    }
})

export const {updateUser, remoteUser} = userSlice.actions

export default userSlice.reducer