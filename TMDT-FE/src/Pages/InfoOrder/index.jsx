import "./InfoOrder.scss";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Input, Radio, Select, Checkbox } from "antd";
import { Form, message } from "antd";
import { useEffect, useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { deleteAllCart } from "../../Redux/reducers/cartUserReducer";
import { deleteAllOrder } from "../../Redux/reducers/orderReducer";
import * as CartService from "../../Services/cartService";
import * as OrderService from "../../Services/orderService";
import * as ProductService from "../../Services/productService";
import * as ActionUserService from "../../Services/actionUserService";
import * as VnpayService from "../../Services/vnpayService";
import * as UserService from "../../Services/userService";
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

    // Address selection states
    const [addressApi, setAddressApi] = useState();
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedCommune, setSelectedCommune] = useState("");
    const [street, setStreet] = useState("");
    const [fullAddress, setFullAddress] = useState("");
    // Agreement states
    const [agreePolicy, setAgreePolicy] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);

    useEffect(() => {
        if (user.token) {
            setUserId(jwtDecode(user.token).id);
            setItemOrder(cartUser.cartItems);

            // Fetch latest user profile to get updated address
            const fetchUserProfile = async () => {
                try {
                    const decoded = jwtDecode(user.token);
                    const res = await UserService.ProfileUser(decoded.id, user.token);
                    console.log("Fetched user profile:", res);
                    if (res && res.address) {
                        setFullAddress(res.address);
                        form.setFieldsValue({ address: res.address });
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            };
            fetchUserProfile();
        } else {
            setUserId("");
            setItemOrder(order.orderItems);
        }

        // Debug: kiểm tra user object
        console.log("User object:", user);
        console.log("User address:", user.address);
    }, [user, cartUser.cartItems, order.orderItems, form]); // Thêm dependencies

    // Load địa chỉ cũ từ user profile khi component mount hoặc user.address thay đổi
    useEffect(() => {
        console.log("UseEffect triggered, user.address:", user.address);
        if (user.address) {
            console.log("Setting address from user:", user.address);
            setFullAddress(user.address);
            form.setFieldsValue({ address: user.address });
        } else {
            console.log("No address found in user object");
        }
    }, [user.address, form]);

    // Fetch address data
    useEffect(() => {
        const fetchDataAddress = async () => {
            const res = await axios.get(
                "https://provinces.open-api.vn/api/?depth=3"
            );
            setAddressApi(res.data);
        };
        fetchDataAddress();
    }, []);

    const totalPrice =
        itemOrder?.reduce(
            (total, item) => total + item.price * item.amount,
            0
        ) || 0;

    // Compose full address from parts với giá trị mới
    const composeAddress = (newStreet, newCommune, newDistrict, newProvince) => {
        const parts = [];
        const st = newStreet !== undefined ? newStreet : street;
        const co = newCommune !== undefined ? newCommune : selectedCommune;
        const di = newDistrict !== undefined ? newDistrict : selectedDistrict;
        const pr = newProvince !== undefined ? newProvince : selectedProvince;

        if (st) parts.push(st);
        if (co) parts.push(co);
        if (di) parts.push(di);
        if (pr) parts.push(pr);
        const address = parts.join(", ");
        setFullAddress(address);
        return address;
    };

    // Handle province selection
    const handleChangeProvince = (value) => {
        setSelectedProvince(value);
        const result = addressApi.filter((item) => item.name === value);
        setProvince(result[0]);
        setSelectedDistrict("");
        setSelectedCommune("");
        setDistrict(undefined);
        // Tính địa chỉ mới với province vừa chọn, reset district và commune
        const fullAddress = composeAddress(street, "", "", value);
        form.setFieldsValue({ address: fullAddress });
    };

    // Handle district selection
    const handleChangeDistrict = (value) => {
        setSelectedDistrict(value);
        const result = province.districts.filter((item) => item.name === value);
        setDistrict(result[0]);
        setSelectedCommune("");
        // Tính địa chỉ mới với district vừa chọn, reset commune
        const fullAddress = composeAddress(street, "", value, selectedProvince);
        form.setFieldsValue({ address: fullAddress });
    };

    // Handle commune selection
    const handleChangeCommune = (value) => {
        setSelectedCommune(value);
        // Tính địa chỉ mới với commune vừa chọn
        const fullAddress = composeAddress(street, value, selectedDistrict, selectedProvince);
        form.setFieldsValue({ address: fullAddress });
    };

    // Handle street input
    const handleChangeStreet = (e) => {
        const value = e.target.value;
        setStreet(value);
        // Tính địa chỉ mới với street vừa nhập
        const fullAddress = composeAddress(value, selectedCommune, selectedDistrict, selectedProvince);
        form.setFieldsValue({ address: fullAddress });
    };


    const recomputeSubmitState = (nextPayment) => {
        const values = form.getFieldsValue();
        const requiredOK = Boolean(values?.name && values?.address && values?.phone && values?.email);
        const noErrors = form.getFieldsError().every((f) => f.errors.length === 0);
        const chosenInput = typeof nextPayment === "string" ? nextPayment : undefined;
        const chosen = chosenInput !== undefined ? chosenInput : payment;
        // yêu cầu phải tick đồng ý chính sách
        const newCanSubmit = Boolean(requiredOK && noErrors && chosen && agreePolicy);
        setCanSubmit(newCanSubmit);
        return newCanSubmit;
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
    }, [payment, agreePolicy]);

    // Thêm useEffect để recompute khi form values thay đổi
    useEffect(() => {
        const fields = form.getFieldsValue();
        if (fields) {
            recomputeSubmitState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

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
            agreeMarketing: agreeMarketing,
        };

        const res = await VnpayService.VnPayCreate(data);
        if (res.code === 200) {
            await ActionUserService.UserAction(data);
            await ProductService.updateStock(itemOrder);

            // Save address and phone to user profile if logged in
            if (userId) {
                await UserService.updateUser(userId, {
                    address: infoUser.address,
                    phone: infoUser.phone,
                    name: infoUser.name,
                    email: infoUser.email
                });
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
        if (!agreePolicy) {
            message.error("Vui lòng đồng ý với chính sách và điều khoản");
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
                    agreeMarketing: agreeMarketing,
                };
                const res = await OrderService.CashOnDelivery(data);
                if (res.code === 200) {
                    await ActionUserService.UserAction(data);
                    await ProductService.updateStock(itemOrder);

                    // Save address and phone to user profile if logged in
                    if (userId) {
                        await UserService.updateUser(userId, {
                            address: infoUser.address,
                            phone: infoUser.phone,
                            name: infoUser.name,
                            email: infoUser.email
                        });
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

            // Save address and phone to user profile if logged in
            const infoUser = form.getFieldsValue();
            if (user.fullName && userId) {
                await UserService.updateUser(userId, {
                    address: infoUser.address,
                    phone: infoUser.phone,
                    name: infoUser.name,
                    email: infoUser.email
                });
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
                            onValuesChange={() => {
                                // Delay để đảm bảo form đã cập nhật values
                                setTimeout(() => recomputeSubmitState(), 0);
                            }}
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập địa chỉ giao hàng",
                                        },
                                    ]}
                                >
                                    <div style={{ marginBottom: 12 }}>
                                        <Select
                                            showSearch
                                            placeholder="Chọn Tỉnh/Thành phố"
                                            style={{ width: "100%", marginBottom: 8 }}
                                            onChange={handleChangeProvince}
                                            value={selectedProvince || undefined}
                                            options={addressApi?.map((address) => ({
                                                value: address.name,
                                                label: address.name,
                                            }))}
                                        />
                                        <Select
                                            showSearch
                                            placeholder="Chọn Quận/Huyện"
                                            style={{ width: "100%", marginBottom: 8 }}
                                            onChange={handleChangeDistrict}
                                            value={selectedDistrict || undefined}
                                            disabled={!selectedProvince}
                                            options={province?.districts?.map(
                                                (address) => ({
                                                    value: address.name,
                                                    label: address.name,
                                                })
                                            )}
                                        />
                                        <Select
                                            showSearch
                                            placeholder="Chọn Xã/Phường"
                                            style={{ width: "100%", marginBottom: 8 }}
                                            onChange={handleChangeCommune}
                                            value={selectedCommune || undefined}
                                            disabled={!selectedDistrict}
                                            options={district?.wards?.map((address) => ({
                                                value: address.name,
                                                label: address.name,
                                            }))}
                                        />
                                        <Input
                                            placeholder="Số nhà, tên đường"
                                            style={{ width: "100%" }}
                                            onChange={handleChangeStreet}
                                            value={street}
                                        />
                                    </div>
                                    <Input.TextArea
                                        className="order-form-input"
                                        placeholder="Địa chỉ đầy đủ (tự động tạo hoặc nhập thủ công)"
                                        size="large"
                                        rows={2}
                                        value={fullAddress}
                                        onChange={(e) => {
                                            setFullAddress(e.target.value);
                                            form.setFieldsValue({ address: e.target.value });
                                        }}
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

                        {/* Agreement Checkboxes */}
                        <div className="agreement-section">
                            <h5 className="agreement-heading">Điều khoản & Đồng ý</h5>

                            <label className="agreement-item">
                                <Checkbox
                                    checked={agreePolicy}
                                    onChange={(e) => {
                                        setAgreePolicy(e.target.checked);
                                        recomputeSubmitState();
                                    }}
                                />
                                <span className="agreement-text">
                                    Tôi đồng ý cho Luxury Jewelry thu thập và xử lý dữ liệu cá nhân theo quy định của pháp luật.
                                </span>
                            </label>

                            <label className="agreement-item optional">
                                <Checkbox
                                    checked={agreeMarketing}
                                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                                />
                                <span className="agreement-text">
                                    Tôi đồng ý nhận email / SMS về ưu đãi và khuyến mãi của Luxury Jewelry
                                    <span className="agreement-detail">(Không bắt buộc)</span>
                                </span>
                            </label>
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
                                                            agreeMarketing: agreeMarketing,
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