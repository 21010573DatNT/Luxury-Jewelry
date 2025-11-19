import React, { useEffect, useState } from "react";
import SliderComponets from "../../Componets/SliderComponets";
import Banner1 from "../../Assets/image/sliderHome/Banner1.jpg";
import Banner2 from "../../Assets/image/sliderHome/Banner2.jpg";
import CardProduct from "../../Componets/CardProduct";
import * as CartService from "../../Services/cartService";
import * as ProductService from "../../Services/productService";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
    updateCart,
    deleteAllCart,
} from "../../Redux/reducers/cartUserReducer";
import "./Home.css"; // Import CSS file

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [product, setProduct] = useState();
    const user = useSelector((state) => state.user);

    const ProductPopular = async () => {
        const res = await ProductService.productPopular();
        setProduct(res.productFeatured);
    };

    useEffect(() => {
        ProductPopular();
    }, []);

    useEffect(() => {
        if (user && user.token) {
            const user_id = jwtDecode(user.token).id;

            const CartGet = async () => {
                try {
                    const res = await CartService.cartGet(user_id);

                    dispatch(deleteAllCart());
                    res.cart.products.forEach((cartItem) => {
                        dispatch(updateCart({ cartItem }));
                    });
                } catch (error) {
                    console.error("Lỗi khi lấy giỏ hàng:", error);
                }
            };

            CartGet();
        }
    }, [user, dispatch]);

    const handleNavigate = () => {
        navigate("/products")
    }

    const handleProductDetail = (id) => {
        navigate(`products/detail/${id}`)
    }

    return (
        <div className="home">
            <SliderComponets arrSlider={[Banner1, Banner2]} />

            {/* Featured Products Section */}
            <section className="featured-products-section">
                <div className="container">
                    {/* Section Header */}
                    <div className="section-header">
                        <div className="header-content">
                            <span className="section-badge">Đặc biệt</span>
                            <h2 className="section-title">Sản phẩm nổi bật</h2>
                            <p className="section-subtitle">
                                Khám phá những sản phẩm được yêu thích nhất
                            </p>
                        </div>
                        <div className="header-decoration">
                            <div className="decoration-line"></div>
                            <div className="decoration-dot"></div>
                            <div className="decoration-line"></div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="products-grid">
                        {product?.map((item) => {
                            return (
                                <div className="product-popular" onClick={() => handleProductDetail(item._id)}>
                                    <CardProduct
                                        title={item.title}
                                        img={item.thumbnail}
                                        price={item.price}
                                        rate={item.rate_total}
                                        stock={item.stock}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {/* View More Button */}
                    <div className="view-more-section">
                        <button className="view-more-btn">
                            <span onClick={handleNavigate}>Xem thêm sản phẩm</span>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M5 12h14M12 5l7 7-7 7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h3>Miễn phí vận chuyển</h3>
                            <p>Cho đơn hàng trên 1.000.000đ</p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h3>Chất lượng đảm bảo</h3>
                            <p>Sản phẩm chính hãng 100%</p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h3>Hỗ trợ 24/7</h3>
                            <p>Tư vấn và chăm sóc khách hàng</p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <polyline
                                        points="22,6 12,13 2,6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h3>Đổi trả dễ dàng</h3>
                            <p>Trong vòng 30 ngày</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
