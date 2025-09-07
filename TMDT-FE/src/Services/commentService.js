import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND

export const CommentPost = async (product_id,data) => {
    const res = await axios.post(
        `${API}/admin/products/comment/${product_id}`, data
    );
    return res.data;
};


