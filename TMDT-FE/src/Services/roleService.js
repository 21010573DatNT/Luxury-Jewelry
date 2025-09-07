import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND;

export const RoleGet = async () => {
    const res = await axios.get(`${API}/admin/roles/`);
    return res.data;
};

export const RoleDetail = async (role_id) => {
    const res = await axios.get(`${API}/admin/roles/detail/${role_id}`);
    return res.data;
};

export const RoleCreate = async (data) => {
    const res = await axios.post(`${API}/admin/roles/create`, data);
    return res.data;
};

export const RoleEdit = async (role_id, data) => {
    const res = await axios.patch(`${API}/admin/roles/edit/${role_id}`, data);
    return res.data;
};

export const RoleDelete = async (role_id) => {
    const res = await axios.delete(`${API}/admin/roles/delete/${role_id}`);
    return res.data;
};
