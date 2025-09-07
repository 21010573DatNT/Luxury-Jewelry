import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND;

export const categoryCreate = async (data) => {
    const res = await axios.post(`${API}/admin/product-category/create`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const categorySearch = async (keyword) => {
    const res = await axios.get(
        `${API}/admin/product-category/search?keyword=${keyword}`
    );
    return res.data;
};

export const categoryUpdate = async (id, data) => {
    console.log(data)
    const res = await axios.patch(
        `${API}/admin/product-category/edit/${id}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res.data;
};

export const categoryDelete = async (id) => {
    const res = await axios.delete(
        `${API}/admin/product-category/delete/${id}`
    );
    return res.data;
};
