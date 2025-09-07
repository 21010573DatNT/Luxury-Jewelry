import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND

export const Recommend = async (user_id,product_id) => {
    const res = await axios.get(
        `${API}/admin/products/recommend/?userId=${user_id}&currentProductId=${product_id}`
    );
    return res.data;
};


