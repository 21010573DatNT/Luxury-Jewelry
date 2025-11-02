import "./InfoOrder.scss";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Input, Radio } from "antd";
import { Form, message } from "antd";
import { useEffect, useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
// import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { deleteAllCart } from "../../Redux/reducers/cartUserReducer";
import { deleteAllOrder } from "../../Redux/reducers/orderReducer";
import * as CartService from "../../Services/cartService";
import * as OrderService from "../../Services/orderService";
import * as ProductService from "../../Services/productService";
import * as ActionUserService from "../../Services/actionUserService";
import * as VnpayService from "../../Services/vnpayService";
const { TextArea } = Input;

const InfoOrder = () => {
    const order = useSelector((state) => state.order);
    const cartUser = useSelector((state) => state.cartUser);
    const user = useSelector((state) => state.user);
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const [payment, setPayment] = useState();
    const [itemOrder, setItemOrder] = useState([]);
    const [userId, setUserId] = useState(""); // Sử dụng state để quản lý userId
    const [isLoading, setIsLoading] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (user.token) {
            setUserId(jwtDecode(user.token).id);
            setItemOrder(cartUser.cartItems);
        } else {
            setUserId("");
            setItemOrder(order.orderItems);
        }
    }, [user.token, cartUser.cartItems, order.orderItems]); // Thêm dependencies

    const totalPrice =
        itemOrder?.reduce(
            (total, item) => total + item.price * item.amount,
            0
        ) || 0;


    const recomputeSubmitState = (nextPayment) => {
        const values = form.getFieldsValue();
        const requiredOK = Boolean(values?.name && values?.address && values?.phone && values?.email);
        const noErrors = form.getFieldsError().every((f) => f.errors.length === 0);
        const chosenInput = typeof nextPayment === "string" ? nextPayment : undefined;
        const chosen = chosenInput !== undefined ? chosenInput : payment;
        setCanSubmit(Boolean(requiredOK && noErrors && chosen));
    };

    const handlePayment = (e) => {
        const next = e.target.value;
        setPayment(next);
        // cập nhật trạng thái nút ngay bằng giá trị vừa chọn, tránh phụ thuộc timing setState
        recomputeSubmitState(next);
    };

    // Nếu người dùng điền thông tin trước rồi mới chọn phương thức, hoặc ngược lại, luôn tính lại
    useEffect(() => {
        recomputeSubmitState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payment]);

    const data = {
        user_id: userId,
        product_id: itemOrder,
        action_type: "purchase",
    };

    // Xử lý VNPay sẽ được gọi khi người dùng nhấn "Đặt hàng ngay" thay vì khi chọn radio
    const handleVnpay = async () => {
        const infoUser = form.getFieldsValue();
        const paymentMethod = "Vnpay";
        const data = {
            userId,
            infoUser,
            product: itemOrder,
            totalPrice,
            payment: paymentMethod,
            status: "waiting",
        };

        const res = await VnpayService.VnPayCreate(data);
        if (res.code === 200) {
            await ActionUserService.UserAction(data);
            await ProductService.updateStock(itemOrder);
            if (userId) {
                dispatch(deleteAllCart());
            } else {
                dispatch(deleteAllOrder());
            }
            window.location.href = res.vnpUrl;
        }
    };


    const hanldeSubmit = async () => {
        // Kiểm tra hợp lệ form trước khi xử lý
        try {
            await form.validateFields();
        } catch (err) {
            message.error("Vui lòng nhập đầy đủ và đúng thông tin thanh toán");
            return;
        }

        const infoUser = form.getFieldsValue();
        if (!payment) {
            message.error("Vui lòng chọn phương thức thanh toán");
            return;
        }

        setIsLoading(true);
        try {
            if (payment === "cash-on-delivery") {
                const paymentMethod = "Cash-on-delivery";
                const data = {
                    userId,
                    infoUser,
                    product: itemOrder,
                    totalPrice,
                    payment: paymentMethod,
                    status: "waiting",
                };
                const res = await OrderService.CashOnDelivery(data);
                if (res.code === 200) {
                    await ActionUserService.UserAction(data);
                    await ProductService.updateStock(itemOrder);
                    if (userId) {
                        dispatch(deleteAllCart());
                    } else {
                        dispatch(deleteAllOrder());
                    }
                    window.location.href = "/success-order";
                }
            } else if (payment === "vnpay") {
                await handleVnpay();
            } else {
                message.error("Phương thức thanh toán không hợp lệ");
            }
        } catch (error) {
            console.error("Order submission failed:", error);
            message.error("Vui lòng nhập đủ thông tin");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigateSuccessOrder = async () => {
        setIsLoading(true);
        try {
            await ActionUserService.UserAction(data);
            if (user.fullName) {
                await CartService.cartDeleteItem(userId);
                dispatch(deleteAllCart());
            } else {
                dispatch(deleteAllOrder());
            }
            window.location.href = "/success-order"
        } catch (error) {
            console.error("Navigation failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="order-info-wrapper">
            <Row gutter={[24, 24]}>
                {/* Payment Information Section */}
                <Col xs={24} lg={13}>
                    <div
                        className={`payment-details-section ${isLoading ? "order-loading-state" : ""
                            }`}
                    >
                        <h2 className="payment-section-heading">
                            Thông tin thanh toán
                        </h2>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={hanldeSubmit}
                            onValuesChange={() => recomputeSubmitState()}
                            autoComplete="off"
                        >
                            <div className="order-form-group">
                                <Form.Item
                                    label="Họ và Tên *"
                                    name="name"
                                    initialValue={user.fullName}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập họ và tên",
                                        },
                                    ]}
                                >
                                    <Input
                                        className="order-form-input"
                                        placeholder="Nhập họ và tên của bạn..."
                                        size="large"
                                    />
                                </Form.Item>
                            </div>

                            <div className="order-form-group">
                                <Form.Item
                                    label="Địa chỉ giao hàng *"
                                    name="address"
                                    initialValue={user.address}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập địa chỉ giao hàng",
                                        },
                                    ]}
                                >
                                    <Input
                                        className="order-form-input"
                                        placeholder="Nhập địa chỉ chi tiết..."
                                        size="large"
                                    />
                                </Form.Item>
                            </div>

                            <div className="order-form-group">
                                <Form.Item
                                    label="Số điện thoại *"
                                    name="phone"
                                    initialValue={user.phone}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập số điện thoại",
                                        },
                                        {
                                            pattern: /^[0-9]{9,11}$/,
                                            message:
                                                "Số điện thoại không hợp lệ (9–11 chữ số)",
                                        },
                                    ]}
                                >
                                    <Input
                                        className="order-form-input"
                                        placeholder="Nhập số điện thoại..."
                                        size="large"
                                    />
                                </Form.Item>
                            </div>

                            <div className="order-form-group">
                                <Form.Item
                                    label="Email *"
                                    name="email"
                                    initialValue={user.email}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập email",
                                        },
                                        {
                                            type: "email",
                                            message: "Email không hợp lệ",
                                        },
                                    ]}
                                >
                                    <Input
                                        className="order-form-input"
                                        placeholder="Nhập địa chỉ email..."
                                        size="large"
                                    />
                                </Form.Item>
                            </div>

                            <div className="order-form-group">
                                <Form.Item label="Ghi chú đơn hàng (không bắt buộc)" name="note">
                                    <TextArea
                                        className="order-form-textarea"
                                        placeholder="Ghi chú thêm... (không bắt buộc)"
                                        autoSize={{ minRows: 4, maxRows: 6 }}
                                    />
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </Col>

                {/* Order Summary Section */}
                <Col xs={24} lg={11}>
                    <div
                        className={`order-summary-panel ${isLoading ? "order-loading-state" : ""
                            }`}
                    >
                        <h3 className="order-summary-heading">Đơn hàng của bạn</h3>

                        {/* Order Header */}
                        <div className="order-items-header">
                            <span className="product-column-header">
                                Sản phẩm
                            </span>
                            <span className="subtotal-column-header">
                                Tạm tính
                            </span>
                        </div>

                        {/* Order Items */}
                        <div className="order-items-list">
                            {itemOrder.map((item, index) => (
                                <div key={index} className="order-item-row">
                                    <div className="item-details">
                                        {item.name} × {item.amount}
                                    </div>
                                    <div className="item-subtotal">
                                        {(
                                            item.price * item.amount
                                        ).toLocaleString()}{" "}
                                        đ
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="order-total-section">
                            <span className="total-label-text">
                                Tổng cộng
                            </span>
                            <span className="total-amount-display">
                                {totalPrice.toLocaleString()} đ
                            </span>
                        </div>

                        {/* Payment Methods */}
                        <div className="payment-methods-section">
                            <h4 className="payment-methods-heading">
                                Phương thức thanh toán
                            </h4>
                            <Radio.Group
                                className="payment-options-container"
                                onChange={handlePayment}
                                value={payment}
                                style={{ width: "100%" }}
                            >
                                <div
                                    className={`payment-option-item ${payment === "cash-on-delivery"
                                        ? "selected"
                                        : ""
                                        }`}
                                >
                                    <Radio value="cash-on-delivery">
                                        <span>
                                            💰 Thanh toán khi nhận hàng (COD)
                                        </span>
                                    </Radio>
                                </div>
                                <div
                                    className={`payment-option-item ${payment === "paypal" ? "selected" : ""
                                        }`}
                                >
                                    <Radio value="paypal">
                                        <span>💳 Thanh toán qua PayPal</span>
                                    </Radio>
                                </div>
                                <div
                                    className={`payment-option-item ${payment === "vnpay" ? "selected" : ""
                                        }`}
                                >
                                    <Radio value="vnpay">
                                        <span>🏦 Thanh toán qua VNPay</span>
                                    </Radio>
                                </div>
                            </Radio.Group>
                        </div>

                        {/* Payment Button or PayPal */}
                        {payment === "paypal" ? (
                            <div className="paypal-button-wrapper">
                                <PayPalButton
                                    amount={(totalPrice / 25000).toFixed(2)} // Quy đổi sang USD
                                    shippingPreference="NO_SHIPPING"
                                    options={{
                                        clientId: "YOUR_PAYPAL_CLIENT_ID", // Thay bằng clientId thực tế
                                        currency: "USD",
                                    }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: (
                                                            totalPrice / 25000
                                                        ).toFixed(2),
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order
                                            .capture()
                                            .then((details) => {
                                                const infoUser = form.getFieldsValue();

                                                return fetch(
                                                    "http://localhost:3000/api/v1/client/order/paypal-transaction-complete",
                                                    {
                                                        method: "post",
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                        },
                                                        body: JSON.stringify({
                                                            orderID:
                                                                data.orderID,
                                                            userId,
                                                            infoUser,
                                                            product: itemOrder,
                                                            totalPrice,
                                                            payment,
                                                            status: "waiting",
                                                        }),
                                                    }
                                                )
                                                    .then((response) =>
                                                        response.json()
                                                    )
                                                    .then((data) => {
                                                        if (data.code === 200) {
                                                            handleNavigateSuccessOrder();
                                                        } else {
                                                            console.log(
                                                                "Transaction failed:",
                                                                data
                                                            );
                                                        }
                                                    })
                                                    .catch((error) =>
                                                        console.error(
                                                            "Error processing transaction:",
                                                            error
                                                        )
                                                    );
                                            });
                                    }}
                                    onError={(err) => {
                                        console.error("Payment Error:", err);
                                        alert(
                                            "Đã xảy ra lỗi với PayPal. Vui lòng thử lại."
                                        );
                                    }}
                                    style={{
                                        layout: "vertical",
                                        color: "blue",
                                        shape: "rect",
                                        label: "paypal",
                                    }}
                                />
                            </div>
                        ) : (
                            <button
                                className={`place-order-button ${!canSubmit || isLoading ? "order-disabled" : ""
                                    }`}
                                onClick={hanldeSubmit}
                                disabled={!canSubmit || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span>Đang xử lý...</span>
                                        <div className="order-loading-spinner"></div>
                                    </>
                                ) : (
                                    <>
                                        <span>🚀 Đặt hàng ngay</span>
                                    </>
                                )}
                            </button>
                        )}

                        {/* Security Note */}
                        <div className="order-security-note">
                            <small>
                                🔒 Thông tin của bạn được bảo mật và mã hóa an
                                toàn
                            </small>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default InfoOrder;