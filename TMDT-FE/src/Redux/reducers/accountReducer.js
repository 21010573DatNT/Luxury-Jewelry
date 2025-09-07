import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fullName: '',
    role_id: '',
    token: '',
    permissions: []
}

export const AccountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        updateAccount: (state, action) => {
            const {fullName, role_id, permissions, token} = action.payload
            state.fullName = fullName
            state.role_id = role_id
            state.token = token
            state.permissions = permissions
        },
        remoteAccount: (state) => {
            state.fullName = ""
            state.role_id = ""
            state.token = ""
            state.permissions = ""
        }
    }
})

export const {updateAccount, remoteAccount} = AccountSlice.actions

export default AccountSlice.reducer