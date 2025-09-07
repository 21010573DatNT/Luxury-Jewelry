import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND

export const  UserAction = async (data) => {
    const res = await axios.post(`${API}/client/user-action/`,data)
    return res.data
}