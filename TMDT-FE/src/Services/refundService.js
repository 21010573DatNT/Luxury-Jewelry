import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND;

export const RefundGet = async () => {
    const res = await axios.get(
        `${API}/client/refund`
    );
    return res.data;
};

export const RefundPost = async (formData) => {
    const res = await axios.post(`${API}/client/refund/create`,formData,{
        headers: {
            "Content-Type": "multipart/form-data", 
        },
    });
    return res.data;
};

export const RefundSendMail = async (email) => {
    const res = await axios.post(`${API}/client/refund/send-mail`,
        {
            to: email,
            subject: "Thông báo cập nhật hoàn trả",
            text: "Yêu cầu hoàn trả của bạn đã được cập nhật thành công!",
        },
        {
            headers: { "Content-Type": "application/json" }
        }
    );
    return res.data;
};

export const RefundDetail = async (refund_id) => {
    const res = await axios.get(
        `${API}/client/refund/detail/${refund_id}`
    );
    return res.data;
};


export const RefundEdit = async (refund_id,data) => {
    const res = await axios.patch(
        `${API}/client/refund/edit/${refund_id}`,data
    );
    return res.data;
};

export const RefundDelete = async (refund_id) => {
    const res = await axios.delete(
        `${API}/client/refund/delete/${refund_id}`
    );
    return res.data;
};