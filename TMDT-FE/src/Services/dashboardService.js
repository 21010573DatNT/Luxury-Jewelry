import axios from "axios";

const API_URL = process.env.REACT_APP_API_BACKEND || "http://localhost:3000/api/v1";

console.log("Dashboard Service - API_URL:", API_URL);

// Lấy thống kê tổng quan
export const getStats = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_URL}/admin/dashboard/stats${queryString ? `?${queryString}` : ''}`;
        console.log("Calling getStats:", url);
        const res = await axios.get(url);
        console.log("getStats response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching stats:", error.response?.data || error.message);
        throw error;
    }
};

// Lấy dữ liệu biểu đồ doanh thu
export const getRevenueChart = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_URL}/admin/dashboard/revenue-chart${queryString ? `?${queryString}` : ''}`;
        console.log("Calling getRevenueChart:", url);
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Error fetching revenue chart:", error.response?.data || error.message);
        throw error;
    }
};

// Lấy danh sách sản phẩm top
export const getTopProducts = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_URL}/admin/dashboard/top-products${queryString ? `?${queryString}` : ''}`;
        console.log("Calling getTopProducts:", url);
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Error fetching top products:", error.response?.data || error.message);
        throw error;
    }
};

// Lấy thống kê tồn kho
export const getInventory = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_URL}/admin/dashboard/inventory${queryString ? `?${queryString}` : ''}`;
        console.log("Calling getInventory:", url);
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Error fetching inventory:", error.response?.data || error.message);
        throw error;
    }
};

// Lấy thống kê khách hàng
export const getCustomerStats = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_URL}/admin/dashboard/customers${queryString ? `?${queryString}` : ''}`;
        console.log("Calling getCustomerStats:", url);
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Error fetching customer stats:", error.response?.data || error.message);
        throw error;
    }
};

// Lấy thống kê tài chính
export const getFinancialStats = async () => {
    try {
        const url = `${API_URL}/admin/dashboard/financial`;
        console.log("Calling getFinancialStats:", url);
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Error fetching financial stats:", error.response?.data || error.message);
        throw error;
    }
};

// Lấy thống kê đánh giá
export const getReviewStats = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_URL}/admin/dashboard/reviews${queryString ? `?${queryString}` : ''}`;
        console.log("Calling getReviewStats:", url);
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Error fetching review stats:", error.response?.data || error.message);
        throw error;
    }
};

// Lấy thống kê theo danh mục sản phẩm
export const getProductCategoryStats = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_URL}/admin/dashboard/product-category-stats${queryString ? `?${queryString}` : ''}`;
        console.log("Calling getProductCategoryStats:", url);
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Error fetching product category stats:", error.response?.data || error.message);
        throw error;
    }
};

// Lấy đơn hàng gần đây
export const getRecentOrders = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_URL}/admin/dashboard/recent-orders${queryString ? `?${queryString}` : ''}`;
        console.log("Calling getRecentOrders:", url);
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Error fetching recent orders:", error.response?.data || error.message);
        throw error;
    }
};
