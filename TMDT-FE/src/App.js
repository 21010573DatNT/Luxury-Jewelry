import "./App.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { updateUser } from "./Redux/reducers/userReducer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Layout from "./Layouts";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import ProductDetail from "./Pages/ProductDetail";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import * as UserService from "./Services/userService";
import Profile from "./Pages/Profile";
import ProductCategory from "./Pages/ProductCategory";
import Cart from "./Pages/Cart";
import InfoOrder from "./Pages/InfoOrder";
import AboutPage from "./Pages/About";
import Admin from "./Pages/Admin/Layout_Admin";
import ProductAdmin from "./Pages/Admin/Product_Admin/Main";
import Product_Detail from "./Pages/Admin/Product_Admin/Detail";
import Product_Edit from "./Pages/Admin/Product_Admin/Edit";
import Product_Create from "./Pages/Admin/Product_Admin/Create";
import CategoryAdmin from "./Pages/Admin/Category_Admin/Main";
import Category_Detail from "./Pages/Admin/Category_Admin/Detail";
import Category_Create from "./Pages/Admin/Category_Admin/Create";
import Category_Edit from "./Pages/Admin/Category_Admin/Edit";
import OrderAdmin from "./Pages/Admin/Order_Admin/Main";
import Order_Detail from "./Pages/Admin/Order_Admin/Detail";
import Order_Edit from "./Pages/Admin/Order_Admin/Edit";
import UserAdmin from "./Pages/Admin/User_Admin/Main";
import User_Detail from "./Pages/Admin/User_Admin/Detail";
import AccountAdmin from "./Pages/Admin/Account_Admin/Main";
import Account_Detail from "./Pages/Admin/Account_Admin/Detail";
import Account_Edit from "./Pages/Admin/Account_Admin/Edit";
import Account_Create from "./Pages/Admin/Account_Admin/Create";
import RoleAdmin from "./Pages/Admin/Role_Admin/Main";
import Role_Detail from "./Pages/Admin/Role_Admin/Detail";
import Role_Edit from "./Pages/Admin/Role_Admin/Edit";
import Role_Create from "./Pages/Admin/Role_Admin/Create";
import Login_Admin from "./Pages/Admin/Login_Admin";
import Cookies from "js-cookie";
import AdminDashboard from "./Pages/Admin/Dashboard";
import ReturnProductPage from "./Pages/Refund";
import RefundAdmin from "./Pages/Admin/Refund_Admin/Main";
import Refund_Detail from "./Pages/Admin/Refund_Admin/Detail";
import Refund_Edit from "./Pages/Admin/Refund_Admin/Edit";
import SuccessOrder from "./Pages/SuccessOrder";
import OrderUser from "./Pages/Profile/OrderUser";
import UserProfile from "./Pages/Profile/User";
import ChangePassword from "./Pages/Profile/ChangePassword";
import ProtectedRoute from "./Componets/ProtectedRoute";
import ProductTest from "./Pages/ProductTest";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token_admin = Cookies.get("token");

    useEffect(() => {
        const isOnAdminRoute = window.location.pathname.startsWith("/admin");

        if (
            !token_admin &&
            isOnAdminRoute &&
            window.location.pathname !== "/admin/login"
        ) {
            navigate("/admin/login");
        }
    }, [token_admin, navigate]);

    useEffect(() => {
        let storageData = localStorage.getItem("token");

        if (storageData) {
            storageData = JSON.parse(storageData);
            const decode = jwtDecode(storageData);
            if (decode?.id) {
                handleGetDetailUser(decode?.id, storageData);
            }
        }
    }, []);

    // Axios Interceptor để xử lý hết hạn token và làm mới token
    UserService.axiosJWT.interceptors.request.use(
        async (config) => {
            // Lấy thời gian hiện tại
            const currentTime = new Date();

            // Giải mã token để lấy thông tin về thời gian hết hạn
            let storageData = localStorage.getItem("token");
            storageData = JSON.parse(storageData);
            const decode = jwtDecode(storageData);

            // Kiểm tra xem token có hết hạn không
            if (decode.exp < currentTime.getTime() / 1000) {
                // Nếu token hết hạn, làm mới token
                const data = await UserService.RefreshToken();

                // Cập nhật header của yêu cầu với token mới
                config.headers["Authorization"] = `Bearer ${data?.token}`;
            }

            // Trả về config đã cập nhật
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.ProfileUser(id, token);
        dispatch(updateUser({ ...res, token: token }));
    };

    return (
        <>
            <Routes>
                {/*---------- Router Page ---------- */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Product />} />
                    <Route path="products/test" element={<ProductTest />} />
                    <Route
                        path="products/detail/:id"
                        element={<ProductDetail />}
                    />
                    <Route
                        path="products/:slug"
                        element={<ProductCategory />}
                    />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="refund" element={<ReturnProductPage />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="order_user" element={<OrderUser />} />
                        <Route
                            path="change_pasword"
                            element={<ChangePassword />}
                        />
                        <Route index element={<UserProfile />} />{" "}
                    </Route>
                    <Route path="cart" element={<Cart />} />
                    <Route path="info_order" element={<InfoOrder />} />
                    <Route path="success-order" element={<SuccessOrder />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/*---------- Router Admin ---------- */}
                <Route
                    path="/admin"
                    element={
                        token_admin ? (
                            <Admin />
                        ) : (
                            <Navigate to="/admin/login" replace />
                        )
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="product" element={<ProductAdmin />} />
                    <Route
                        path="product/detail/:product_id"
                        element={<Product_Detail />}
                    />
                    <Route
                        path="product/edit/:product_id"
                        element={<Product_Edit />}
                    />
                    <Route path="product/create" element={<Product_Create />} />
                    <Route path="category" element={<CategoryAdmin />} />
                    <Route
                        path="category/detail/:category_id"
                        element={<Category_Detail />}
                    />
                    <Route path="category/create" element={<Category_Create />} />
                    <Route
                        path="category/edit/:category_id"
                        element={<Category_Edit />}
                    />
                    <Route path="order" element={<OrderAdmin />} />
                    <Route
                        path="order/detail/:order_id"
                        element={<Order_Detail />}
                    />
                    <Route path="order/edit/:order_id" element={<Order_Edit />} />
                    <Route path="customer" element={<UserAdmin />} />
                    <Route
                        path="customer/detail/:user_id"
                        element={<User_Detail />}
                    />
                    <Route path="account" element={<AccountAdmin />} />
                    <Route
                        path="account/detail/:account_id"
                        element={<Account_Detail />}
                    />
                    <Route
                        path="account/edit/:account_id"
                        element={<Account_Edit />}
                    />
                    <Route path="account/create" element={<Account_Create />} />
                    <Route path="role" element={<RoleAdmin />} />
                    <Route path="role/detail/:role_id" element={<Role_Detail />} />
                    <Route path="role/edit/:role_id" element={<Role_Edit />} />
                    <Route path="role/create" element={<Role_Create />} />
                    <Route path="refund" element={<RefundAdmin />} />
                    <Route
                        path="refund/detail/:refund_id"
                        element={<Refund_Detail />}
                    />
                    <Route path="refund/edit/:refund_id" element={<Refund_Edit />} />
                </Route>

                <Route path="/admin/login" element={<Login_Admin />} />
            </Routes>
            <PayPalScriptProvider
                options={{
                    "client-id":
                        "AXcxRtCTNBAhaQdlmnuaZXwi-iybebir8vEfFwuh4793SZRoWFVmV365W173xNyEVog0ArOK8HJN1EUR",
                }}
            />
        </>
    );
}

export default App;
