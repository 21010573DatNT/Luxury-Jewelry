import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND;

export const cartGet = async (userId) => {
    const res = await axios.get(`${API}/client/cart/${userId}`);
    return res.data;
};

export const cartUpdate = async (userId, product) => {
    const res = await axios.patch(`${API}/client/cart/update/${userId}`, {
        product,
    });
    return res.data;
};

export const cartUpdateQuantity = async (user_id, keyword, product_id) => {
    const res = await axios.patch(
        `${API}/client/cart/update_quantity/${user_id}?keyword=${keyword}`,
        {product_id}
    );
    return res.data;
};

export const cartDelete = async (userId, productId) => {
    const res = await axios.delete(`${API}/client/cart/delete/${userId}`, {
        data: { productId },
    });
    return res.data;
};

export const cartDeleteItem = async (userId) => {
    const res = await axios.delete(`${API}/client/cart/delete/item_cart/${userId}`);
    return res.data;
};
