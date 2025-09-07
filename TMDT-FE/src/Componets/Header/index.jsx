import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { Row, Col, List } from "antd";
import { Input } from "antd";
import { Avatar } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../Services/userService";
import * as ProductService from "../../Services/productService";
import { remoteUser } from "../../Redux/reducers/userReducer";
const { Search } = Input;

function Header() {
    const user = useSelector((state) => state.user);
    const [showSearchItem, setShowSearchItem] = useState(false);
    const [productSearch, setProductSearch] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const getProductSearch = async (val) => {
        const res = await ProductService.productSearch(val);
        setProductSearch(res.products);
    };

    const onSearchChange = (e) => {
        const val = e.target.value;
        setShowSearchItem(val.length > 0);
        getProductSearch(val);
    };

    // Bắt sự kiện click ngoài vùng searchRef
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowSearchItem(false); 
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNavigateLogin = () => {
        navigate("/login");
    };

    const handleNavigateRegister = () => {
        navigate("/register");
    };

    const handleLogout = async () => {
        await UserService.LogoutUser();
        localStorage.clear("token");
        dispatch(remoteUser());
        navigate("/")
    };

    const handleProfile = () => {
        navigate("/profile");
    };

    const handleNavigateCart = () => {
        navigate("/cart");
    };

    const handleNavigateProduct = (product_id) => {
        navigate(`/products/detail/${product_id}`);
        setShowSearchItem(false); 
    }

    return (
        <div className="header">
            <Row>
                <Col span={4} className="logo">
                    Luxury Jewelry
                </Col>
                <Col span={8} className="search-bar" ref={searchRef}>
                    <Search
                        placeholder="Tìm kiếm sản phẩm..."
                        onChange={onSearchChange}
                        enterButton
                    />
                    <List
                        className="search-item"
                        style={{ display: showSearchItem ? "flex" : "none" }}
                    >
                        {productSearch?.map((item) => {
                            return (
                                <div className="item" key={item._id} onClick={() => handleNavigateProduct(item._id)}>
                                    <img
                                        src={item.thumbnail}
                                        className="image-item"
                                    />
                                    <p className="title-item">{item.title}</p>
                                </div>
                            );
                        })}
                    </List>
                </Col>
                <Col span={12} className="nav-links">
                    <a href="/">Trang chủ</a>
                    <a href="/products">Sản phẩm</a>
                    <a href="/about">Về chúng tôi</a>
                    <a href="/refund">Hoàn trả</a>
                    <Avatar size="large" icon={<UserOutlined />} />
                    {user?.fullName ? (
                        <div className="account-logout">
                            <div onClick={handleProfile}>{user?.fullName}</div>
                            <span>|</span>
                            <div onClick={handleLogout}>Đăng xuất</div>
                        </div>
                    ) : (
                        <div className="login-register">
                            <div onClick={handleNavigateLogin}>Đăng nhập</div>
                            <span>|</span>
                            <div onClick={handleNavigateRegister}>Đăng ký</div>
                        </div>
                    )}

                    <div className="cart-icon">
                        <ShoppingCartOutlined
                            style={{ fontSize: "26px" }}
                            onClick={handleNavigateCart}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Header;
