import { Col, Row, Button, Flex, InputNumber, Rate, message } from "antd";
import {
    SafetyOutlined,
    TruckOutlined,
    SolutionOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductDetail.scss";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import * as cartService from "@/Services/cartService";
import * as ProductService from "../../Services/productService";
import * as ActionUserService from "../../Services/actionUserService";
import CommentProduct from "../../Componets/Comment";
import RecommendProducts from "../../Componets/RecommendProducts";
import { addOrder } from "../../Redux/reducers/orderReducer";
import { addCart } from "../../Redux/reducers/cartUserReducer";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState("");
    const [amount, setAmount] = useState(1);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    let user_id;
    if (user.token) {
        user_id = jwtDecode(user.token).id;
    }

    useEffect(() => {
        async function fetchProduct() {
            const res = await ProductService.productDetail(id);
            if (res) {
                const prod = res[0] || res;
                setProduct(prod);
                setImages(prod.images?.length > 0 ? prod.images : [prod.thumbnail]);
                setMainImage(prod.images?.length > 0 ? prod.images[0] : prod.thumbnail);
            }
        }
        fetchProduct();
    }, [id]);

    const onChangeNumber = (value) => setAmount(parseInt(value));

    const data = {
        user_id: user_id,
        product_id: [id],
        action_type: "add_to_cart",
    };

    const handleClickCart = async () => {
        await ActionUserService.UserAction(data);
        const orderItem = {
            name: product?.title,
            amount: amount,
            image: product?.thumbnail,
            price: product?.price,
            product_id: product?._id,
        };
        const cartItem = orderItem;
        if (!user_id) {
            dispatch(addOrder({ orderItem }));
        } else {
            await cartService.cartUpdate(user_id, orderItem);
            dispatch(addCart({ cartItem }));
        }
        message.success("Bạn đã thêm sản phẩm vào giỏ hàng thành công");
    };

    const handleClickBuy = async () => {
        await ActionUserService.UserAction(data);
        const orderItem = {
            name: product?.title,
            amount: amount,
            image: product?.thumbnail,
            price: product?.price,
            product_id: product?._id,
        };
        const cartItem = orderItem;
        if (!user_id) {
            dispatch(addOrder({ orderItem }));
            navigate("/cart");
        } else {
            await cartService.cartUpdate(user_id, orderItem);
            dispatch(addCart({ cartItem }));
            navigate("/cart");
        }
    };

    return (
        <div
            className="container-productdetail"
            style={{ background: "#fafafa", padding: "48px 0" }}
        >
            <Row justify="center">
                <Col xs={22} sm={20} md={18} lg={18} xl={18}>
                    <div
                        className="product-detail-card"
                        style={{
                            background: "#fff",
                            borderRadius: 20,
                            padding: "48px 56px",
                            marginBottom: 60,
                        }}
                    >
                        <Row gutter={[48, 48]} align="middle">
                            {/* ==== ẢNH SẢN PHẨM ==== */}
                            <Col xs={24} md={10} style={{ textAlign: "center" }}>
                                <img
                                    src={mainImage}
                                    alt={product.title}
                                    style={{
                                        width: 400,
                                        height: 400,
                                        objectFit: "cover",
                                        borderRadius: 12,
                                        border: "1px solid #eee",
                                        marginBottom: 24,
                                        transition: "transform 0.3s ease",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.transform = "scale(1.03)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform = "scale(1)")
                                    }
                                />
                                {images.length > 1 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            flexWrap: "wrap",
                                            gap: 12,
                                            marginTop: 10,
                                        }}
                                    >
                                        {images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`thumb-${idx}`}
                                                style={{
                                                    width: 68,
                                                    height: 68,
                                                    borderRadius: 8,
                                                    objectFit: "cover",
                                                    border:
                                                        mainImage === img
                                                            ? "2px solid #d7263d"
                                                            : "1px solid #ccc",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease",
                                                    opacity: mainImage === img ? 1 : 0.7,
                                                }}
                                                onClick={() => setMainImage(img)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </Col>

                            {/* ==== THÔNG TIN SẢN PHẨM ==== */}
                            <Col xs={24} md={14}>
                                <h2
                                    style={{
                                        fontWeight: 700,
                                        fontSize: 28,
                                        color: "#222",
                                        marginBottom: 10,
                                    }}
                                >
                                    {product.title}
                                </h2>
                                <Rate
                                    allowHalf
                                    disabled
                                    value={
                                        product?.rating ||
                                        product?.rate ||
                                        product?.rate_average ||
                                        product?.rate_total ||
                                        0
                                    }
                                    style={{
                                        color: "#fadb14",
                                        fontSize: "18px",
                                        marginBottom: 16,
                                    }}
                                />
                                <span style={{ marginLeft: 8, color: "#555" }}>
                                    {(
                                        product?.rating ||
                                        product?.rate ||
                                        product?.rate_average ||
                                        product?.rate_total ||
                                        0
                                    ).toFixed(1)} / 5
                                </span>

                                <p
                                    style={{
                                        fontSize: 26,
                                        fontWeight: 700,
                                        color: "#d7263d",
                                        margin: "20px 0 28px",
                                    }}
                                >
                                    {product.price && product.price.toLocaleString()} đ
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        marginBottom: 32,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            border: "1px solid #e1e1e1",
                                            borderRadius: 8,
                                            overflow: "hidden",
                                            background: "#fff",
                                            padding: "4px 10px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                fontSize: 15,
                                                color: "#333",
                                                marginRight: 8,
                                            }}
                                        >
                                            Số lượng:
                                        </span>

                                        {/* Nút trừ */}
                                        <Button
                                            onClick={() => amount > 1 && setAmount(amount - 1)}
                                            style={{
                                                border: "none",
                                                background: "transparent",
                                                color: "#222",
                                                fontSize: 18,
                                                width: 32,
                                                height: 32,
                                                lineHeight: "30px",
                                            }}
                                        >
                                            −
                                        </Button>

                                        {/* Ô nhập số lượng (cho phép xóa, không có mũi tên) */}
                                        <input
                                            type="text"
                                            value={amount}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Cho phép xóa hết hoặc chỉ nhập số
                                                if (val === "" || /^[0-9]+$/.test(val)) setAmount(val);
                                            }}
                                            onBlur={(e) => {
                                                // Khi rời ô nhập: nếu trống hoặc nhỏ hơn 1 => đặt lại 1
                                                if (e.target.value === "" || parseInt(e.target.value) < 1)
                                                    setAmount(1);
                                                else setAmount(parseInt(e.target.value));
                                            }}
                                            style={{
                                                width: 50,
                                                textAlign: "center",
                                                fontWeight: 600,
                                                fontSize: 16,
                                                border: "none",
                                                outline: "none",
                                                background: "transparent",
                                                appearance: "none",
                                                MozAppearance: "textfield",
                                            }}
                                        />

                                        {/* Nút cộng */}
                                        <Button
                                            onClick={() => setAmount((prev) => parseInt(prev || 0) + 1)}
                                            style={{
                                                border: "none",
                                                background: "transparent",
                                                color: "#222",
                                                fontSize: 18,
                                                width: 32,
                                                height: 32,
                                                lineHeight: "30px",
                                            }}
                                        >
                                            +
                                        </Button>
                                    </div>

                                    {/* Trạng thái hàng */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        <span
                                            style={{
                                                color: product.stock > 0 ? "#c41a1aff" : "#ff4d4f",
                                                fontWeight: 600,
                                                fontSize: 15,
                                            }}
                                        >
                                            {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                                        </span>
                                        {product.stock !== undefined && (
                                            <span
                                                style={{
                                                    color: "#666",
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Sản Phẩm có sẵn: {product.stock}
                                            </span>
                                        )}
                                    </div>
                                </div>


                                <Flex gap="large" wrap style={{ marginBottom: 36 }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        disabled={!product.stock || product.stock <= 0}
                                        style={{
                                            background: product.stock > 0 ? "#d7263d" : "#d9d9d9",
                                            borderColor: product.stock > 0 ? "#d7263d" : "#d9d9d9",
                                            borderRadius: 10,
                                            padding: "0 36px",
                                            fontWeight: 600,
                                            height: 48,
                                        }}
                                        onClick={handleClickBuy}
                                    >
                                        {product.stock > 0 ? "Mua ngay" : "Hết hàng"}
                                    </Button>
                                    <Button
                                        size="large"
                                        disabled={!product.stock || product.stock <= 0}
                                        style={{
                                            borderRadius: 10,
                                            borderColor: product.stock > 0 ? "#d7263d" : "#d9d9d9",
                                            color: product.stock > 0 ? "#d7263d" : "#999",
                                            padding: "0 36px",
                                            fontWeight: 600,
                                            height: 48,
                                        }}
                                        onClick={handleClickCart}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                </Flex>

                                {/* ==== DỊCH VỤ ==== */}
                                <div className="product-service" style={{ marginTop: 24 }}>
                                    <Row gutter={[24, 24]}>
                                        {[
                                            {
                                                icon: <SafetyOutlined />,
                                                text: "Bảo hành 12 tháng tận nơi",
                                            },
                                            {
                                                icon: <TruckOutlined />,
                                                text: "Free Ship toàn quốc từ 1.000k",
                                            },
                                            {
                                                icon: <SolutionOutlined />,
                                                text: "Hoàn trả nếu không hài lòng",
                                            },
                                            {
                                                icon: <InboxOutlined />,
                                                text: "Kiểm tra trước khi thanh toán",
                                            },
                                        ].map((item, idx) => (
                                            <Col xs={12} key={idx}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        textAlign: "center",
                                                        gap: 6,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: 38,
                                                            color: "#d7263d",
                                                            marginBottom: 4,
                                                        }}
                                                    >
                                                        {item.icon}
                                                    </div>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontWeight: 500,
                                                            color: "#333",
                                                        }}
                                                    >
                                                        {item.text}
                                                    </p>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* ==== MÔ TẢ SẢN PHẨM ==== */}
                    {product.description && (
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: 20,  
                                padding: "48px 56px",
                                marginBottom: 60,
                                textAlign: "left",
                                fontSize: 16,
                                lineHeight: 1.7,
                            }}
                        >
                            <div style={{ textAlign: "center", marginBottom: 28 }}>
                                <h3
                                    style={{
                                        fontWeight: 700,
                                        fontSize: 22,
                                        color: "#d7263d",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Mô tả sản phẩm
                                </h3>
                                <p
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 18,
                                        marginTop: 6,
                                        color: "#333",
                                    }}
                                >
                                    {product.title}
                                </p>
                            </div>
                            <div style={{ color: "#444", whiteSpace: "pre-line" }}>
                                {product.description}
                            </div>
                        </div>
                    )}

                    {/* ==== BÌNH LUẬN & GỢI Ý ==== */}
                    <CommentProduct id={id} product={product} />
                    <RecommendProducts product_id={id} />
                </Col>
            </Row>
        </div>
    );
}

export default ProductDetail;
