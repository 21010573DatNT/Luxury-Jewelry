import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND


export const AccountGet = async() => {
    const res = await axios.get(`${API}/admin/accounts/`)
    return res.data
}

export const AccountDetail = async(account_id) => {
    const res = await axios.get(`${API}/admin/accounts/detail/${account_id}`)
    return res.data
}

export const AccountCreate = async(data) => {
    const res = await axios.post(`${API}/admin/accounts/create`,data)
    return res.data
}


export const AccountEdit = async(account_id,data) => {
    const res = await axios.patch(`${API}/admin/accounts/edit/${account_id}`,data)
    return res.data
}

export const AccountDelete = async(account_id) => {
    const res = await axios.delete(`${API}/admin/accounts/delete/${account_id}`)
    return res.data
}

export const AccountLogin = async(data) => {
    const res = await axios.post(`${API}/admin/accounts/login`,data,
        {
            withCredentials: true
        }
    )
    return res.data
}
