import React, { useState } from "react";
import {
    Form,
    Input,
    Upload,
    Button,
    Card,
    Steps,
    Checkbox,
    message,
    Row,
    Col,
    Radio,
    Typography,
    Divider,
    Space,
    DatePicker,
    Alert,
    Select,
} from "antd";
import {
    ShoppingCartOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import * as OrderService from "../../Services/orderService";
import * as RefundService from "../../Services/refundService";
import "./Refund.scss";

// Giả lập API lấy đơn hàng (bạn thay bằng API thật)
const fetchOrderDetail = async (purchaseDate, email, phone) => {
    // Gọi API thật ở đây, ví dụ:
    // return await axios.get(`/api/orders?purchaseDate=${purchaseDate}&email=${email}&phone=${phone}`);
    // Dưới đây là dữ liệu mẫu:
    return {
        success: true,
        products: [
            { id: "1", name: "Áo thun nam", quantity: 2 },
            { id: "2", name: "Quần jeans nữ", quantity: 1 },
        ],
    };
};

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const ReturnProductPage = () => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [formData, setFormData] = useState({});
    const [orderProducts, setOrderProducts] = useState([]);
    const [loadingOrder, setLoadingOrder] = useState(false);

    const steps = [
        { title: "Thông tin đơn hàng", icon: <ShoppingCartOutlined /> },
        { title: "Chi tiết hoàn trả", icon: <FileTextOutlined /> },
        { title: "Xác nhận và gửi", icon: <CheckCircleOutlined /> },
    ];

    // Bước 1: Nhập thông tin đơn hàng, ấn tiếp tục sẽ gọi API lấy sản phẩm
    const handleNext = async () => {
        if (currentStep === 0) {
            try {
                const values = await form.validateFields();
                setLoadingOrder(true);
                // Gọi API lấy chi tiết đơn hàng
                const res = await OrderService.OrderRefund(
                    values.email,
                    values.phone,
                    values.purchaseDate
                        ? values.purchaseDate.format("YYYY-MM-DD")
                        : ""
                );
                console.log(values.purchaseDate.format("YYYY-MM-DD"));
                setLoadingOrder(false);
                if (res.products.length > 0) {
                    setOrderProducts(res.products);
                    setFormData((prev) => ({ ...prev, ...values }));
                    setCurrentStep(1);
                } else {
                    message.error(
                        "Không tìm thấy đơn hàng hoặc đơn hàng không có sản phẩm."
                    );
                }
            } catch {
                setLoadingOrder(false);
                message.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            }
        } else {
            // Bước 2: Lưu dữ liệu hoàn trả
            try {
                // Chỉ validate các field của bước 2
                const values = await form.validateFields([
                    'returnType',
                    'productIds',
                    'reason',
                    'description'
                ]);
                setFormData((prev) => ({ ...prev, ...values }));
                setCurrentStep(currentStep + 1);
            } catch (error) {
                console.error("Validation error:", error);
                message.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            }
        }
    };

    const handlePrev = () => setCurrentStep(currentStep - 1);

    const handleSubmit = async () => {
        try {
            // Chỉ validate field agreement ở bước 3
            const values = await form.validateFields(['agreement']);
            console.log("Step 3 values:", values);
            console.log("Form data from previous steps:", formData);

            const allValues = { ...formData, ...values };
            console.log("All values combined:", allValues);

            const formDataToSend = new FormData();
            for (let key in allValues) {
                if (key === "productIds" && Array.isArray(allValues[key])) {
                    allValues[key].forEach((id) =>
                        formDataToSend.append("productIds[]", id)
                    );
                } else if (key === "purchaseDate") {
                    // Format purchaseDate nếu là moment object
                    const dateValue = allValues[key];
                    formDataToSend.append(key, dateValue.format ? dateValue.format("YYYY-MM-DD") : dateValue);
                } else if (key !== "agreement") {
                    // Không gửi agreement field lên server
                    formDataToSend.append(key, allValues[key]);
                }
            }
            // Thêm file
            if (fileList.length > 0) {
                fileList.forEach((file) => {
                    formDataToSend.append("image", file.originFileObj);
                });
            }

            // Log FormData để debug
            console.log("FormData entries:");
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            console.log("Sending refund request...");
            const res = await RefundService.RefundPost(formDataToSend);
            console.log("Response:", res);
            message.success("Yêu cầu hoàn trả đã được gửi thành công!");
            form.resetFields();
            setFileList([]);
            setCurrentStep(0);
            setFormData({});
            setOrderProducts([]);
        } catch (error) {
            console.error("Lỗi khi gửi form:", error);
            console.error("Error details:", error.response || error.message);
            message.error("Vui lòng đồng ý với điều khoản trước khi gửi");
        }
    };

    // Hiển thị sản phẩm đã mua để chọn hoàn trả ở bước 2 (multi-select)
    const renderProductSelect = () => (
        <Form.Item
            name="productIds"
            label="Chọn sản phẩm muốn hoàn trả"
            rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
            <Select
                mode="multiple"
                placeholder="Chọn sản phẩm"
                size="large"
                maxTagCount="responsive"
            >
                {orderProducts.map((item) => (
                    <Option key={item.product_id} value={item.product_id}>
                        {item.name} (SL: {item.amount})
                    </Option>
                ))}
            </Select>
        </Form.Item>
    );

    // Lấy tên sản phẩm từ mảng id để hiển thị ở bước xác nhận
    const getProductNames = (ids) => {
        if (!ids) return "";
        return (Array.isArray(ids) ? ids : [ids])
            .map((id) => {
                const found = orderProducts.find((p) => p.product_id === id);
                return found ? `${found.name} (SL: ${found.amount})` : "";
            })
            .join(", ");
    };

    // Render nội dung từng bước
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="step-content">
                        <Title level={4}>Thông tin đơn hàng cần hoàn trả</Title>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="customerName"
                                    label="Họ tên khách hàng"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập họ tên",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Nguyễn Văn A"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label="Email đặt hàng"
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
                                        placeholder="email@example.com"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập số điện thoại",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="0123456789"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="purchaseDate"
                                    label="Ngày mua hàng"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng chọn ngày mua hàng",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        format="DD/MM/YYYY"
                                        placeholder="Chọn ngày mua hàng"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                );
            case 1:
                return (
                    <div className="step-content">
                        <Title level={4}>Chi tiết yêu cầu hoàn trả</Title>
                        <Form.Item
                            name="returnType"
                            label="Hình thức"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn hình thức hoàn trả",
                                },
                            ]}
                            initialValue="return"
                        >
                            <Radio.Group>
                                <Radio.Button value="Trả hàng">
                                    Trả hàng
                                </Radio.Button>
                                <Radio.Button value="Đổi hàng">
                                    Đổi hàng
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {renderProductSelect()}
                        <Form.Item
                            name="reason"
                            label="Lý do hoàn trả"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn lý do hoàn trả",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn lý do hoàn trả"
                                size="large"
                            >
                                <Option value="Sản phẩm bị lỗi/hỏng">
                                    Sản phẩm bị lỗi/hỏng
                                </Option>
                                <Option value="Sai sản phẩm so với mô tả">
                                    Sai sản phẩm so với mô tả
                                </Option>
                                <Option value="Kích thước không phù hợp">
                                    Kích thước không phù hợp
                                </Option>
                                <Option value="Không hài lòng về chất lượng">
                                    Không hài lòng về chất lượng
                                </Option>
                                <Option value="Thay đổi ý định">
                                    Thay đổi ý định
                                </Option>
                                <Option value="Nhận được sản phẩm nhầm">
                                    Nhận được sản phẩm nhầm
                                </Option>
                                <Option value="Khác">Khác</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả chi tiết"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng mô tả chi tiết vấn đề",
                                },
                            ]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Vui lòng mô tả chi tiết tình trạng sản phẩm, lý do hoàn trả..."
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item name="images" label="Hình ảnh minh chứng">
                            <Dragger
                                name="file"
                                multiple
                                fileList={fileList}
                                onChange={(info) => setFileList(info.fileList)}
                                beforeUpload={() => false}
                                style={{ background: "#fafafa" }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined
                                        style={{
                                            fontSize: "48px",
                                            color: "#1890ff",
                                        }}
                                    />
                                </p>
                                <p className="ant-upload-text">
                                    Kéo thả hoặc click để tải ảnh lên
                                </p>
                                <p className="ant-upload-hint">
                                    Hỗ trợ JPG, PNG. Tối đa 5 ảnh, mỗi ảnh không
                                    quá 5MB
                                </p>
                            </Dragger>
                        </Form.Item>
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        <Title level={4}>Xác nhận thông tin hoàn trả</Title>
                        <Alert
                            message="Lưu ý quan trọng"
                            description="Vui lòng kiểm tra kỹ thông tin trước khi gửi. Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận yêu cầu."
                            type="info"
                            showIcon
                            style={{ marginBottom: "24px" }}
                        />
                        <Card className="summary-card">
                            <div className="summary-item">
                                <Text strong>Khách hàng:</Text>
                                <Text> {formData.customerName}</Text>
                            </div>
                            <div className="summary-item">
                                <Text strong>Email:</Text>
                                <Text> {formData.email}</Text>
                            </div>
                            <div className="summary-item">
                                <Text strong>Số điện thoại:</Text>
                                <Text> {formData.phone}</Text>
                            </div>
                            <div className="summary-item">
                                <Text strong>Ngày mua hàng:</Text>
                                <Text>
                                    {formData.purchaseDate
                                        ? formData.purchaseDate.format
                                            ? formData.purchaseDate.format(
                                                "DD/MM/YYYY"
                                            )
                                            : formData.purchaseDate
                                        : ""}
                                </Text>
                            </div>
                            <div className="summary-item">
                                <Text strong>Sản phẩm hoàn trả:</Text>
                                <Text>
                                    {getProductNames(
                                        form.getFieldValue("productIds") ||
                                        formData.productIds
                                    )}
                                </Text>
                            </div>
                            <div className="summary-item">
                                <Text strong>Lý do:</Text>
                                <Text>
                                    {form.getFieldValue("reason") ||
                                        formData.reason}
                                </Text>
                            </div>
                            <div className="summary-item">
                                <Text strong>Mô tả:</Text>
                                <Text>
                                    {form.getFieldValue("description") ||
                                        formData.description}
                                </Text>
                            </div>
                            <div className="summary-item">
                                <Text strong>Hình ảnh:</Text>
                                <Text> {fileList.length} file đính kèm</Text>
                            </div>
                        </Card>
                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                new Error(
                                                    "Vui lòng đồng ý với điều khoản"
                                                )
                                            ),
                                },
                            ]}
                        >
                            <Checkbox>
                                Tôi xác nhận thông tin trên là chính xác và đồng
                                ý với{" "}
                                <a href="#" onClick={(e) => e.preventDefault()}>
                                    điều khoản hoàn trả
                                </a>{" "}
                                của cửa hàng
                            </Checkbox>
                        </Form.Item>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="return-product-container">
            <div className="return-header">
                <Title level={2}>
                    <ShoppingCartOutlined style={{ fontSize: 30 }} />{" "}
                    <p className="title_text">Yêu cầu hoàn trả hàng</p>
                </Title>
                <Paragraph>
                    Chúng tôi cam kết xử lý yêu cầu hoàn trả một cách nhanh
                    chóng và minh bạch. Vui lòng điền đầy đủ thông tin để chúng
                    tôi hỗ trợ bạn tốt nhất.
                </Paragraph>
            </div>
            <Card className="return-form-card">
                <Steps
                    current={currentStep}
                    items={steps}
                    className="return-steps"
                />
                <Divider />
                <Form form={form} layout="vertical" className="return-form">
                    {renderStepContent()}
                    <div className="form-actions">
                        <Space>
                            {currentStep > 0 && (
                                <Button size="large" onClick={handlePrev}>
                                    Quay lại
                                </Button>
                            )}
                            {currentStep < steps.length - 1 && (
                                <Button
                                    type="primary"
                                    size="large"
                                    loading={loadingOrder}
                                    onClick={handleNext}
                                >
                                    Tiếp tục
                                </Button>
                            )}
                            {currentStep === steps.length - 1 && (
                                <Button
                                    type="primary"
                                    size="large"
                                    className="submit-btn"
                                    onClick={handleSubmit}
                                >
                                    Gửi yêu cầu hoàn trả
                                </Button>
                            )}
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ReturnProductPage;
