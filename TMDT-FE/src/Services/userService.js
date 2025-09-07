import axios from "axios";

export const axiosJWT = axios.create();
const API = process.env.REACT_APP_API_BACKEND

export const loginUser = async (data) => {
    const res = await axios.post(
        `${API}/client/user/login`,
        data, 
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
    );
    return res.data; 
};

export const RegisterUser = async (data) => {
    const res = await axios.post(
        `${API}/client/user/register`,
        data, 
        {
            withCredentials: true
        }
    );
    return res.data; 
};

export const UserSearch = async (keyword) => {
    const res = await axios.get(
        `${API}/client/user/search?keyword=${keyword}`
    );
    return res.data;
};

export const ProfileUser = async (id, token) => {
    const res = await axiosJWT.get(
        `${API}/client/user/profile/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }
    )
    return res.data
}

export const RefreshToken = async () => {
    const res = await axios.post(`${API}/client/user/refresh_token`,{},
        {
            withCredentials: true
        }
    )
    return res.data
}

export const LogoutUser = async() => {
    const res = await axios.post(`${API}/client/user/logout`)
    return res.data
}

export const updateUser = async(id,data) => {
    const res = await axios.patch(`${API}/client/user/update/${id}`,data)
    return res.data
}

export const UserGet = async() => {
    const res = await axios.get(`${API}/client/user/`)
    return res.data
}

export const UserDetail = async(user_id) => {
    const res = await axios.get(`${API}/client/user/detail/${user_id}`)
    return res.data
}

export const UserEdit = async(user_id,data) => {
    const res = await axios.patch(`${API}/client/user/edit/${user_id}`,data)
    return res.data
}

export const UserDelete = async(user_id) => {
    const res = await axios.delete(`${API}/client/user/delete/${user_id}`)
    return res.data
}

export const UserChangePassword = async(user_id,data) => {
    const res = await axios.post(`${API}/client/user/password/reset/${user_id}`,data)
    return res.data
}