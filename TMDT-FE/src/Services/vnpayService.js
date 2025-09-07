import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND


export const VnPayCreate = async(data) => {
    const res = await axios.post(`${API}/client/vnpay/create_payment_url`,data)
    return res.data
}