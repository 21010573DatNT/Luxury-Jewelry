import {
    Form,
    Input,
    InputNumber,
    Radio,
    Button,
    message,
    Select,
    Upload,
} from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as ProductService from "../../../../Services/productService";

const { TextArea } = Input;

function Product_Create() {
    const [productCategory, setProductCategory] = useState([]);
    // Lưu duy nhất một ảnh cho sản phẩm
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchProductCategory = async () => {
        const res = await ProductService.productCategoryGet();
        setProductCategory(res);
    };

    useEffect(() => {
        fetchProductCategory();
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                if (key !== "image") {
                    formData.append(key, values[key]);
                }
            });

            if (imageFile) {
                // Nén ảnh nếu kích thước > 1MB
                let fileToUpload = imageFile;
                if (imageFile.size > 1024 * 1024) {
                    fileToUpload = await compressImage(imageFile);
                }
                formData.append("image", fileToUpload);
            }

            const res = await ProductService.productCreate(formData);

            if (res.code === 200) {
                message.success("Tạo sản phẩm thành công!");
                navigate(`/admin/product`);
            } else {
                message.error("Tạo sản phẩm thất bại!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo sản phẩm!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Giảm kích thước nếu ảnh quá lớn
                    const maxSize = 1920;
                    if (width > maxSize || height > maxSize) {
                        if (width > height) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        } else {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        }));
                    }, 'image/jpeg', 0.8);
                };
            };
        });
    };

    const handleImageChange = ({ fileList }) => {
        const file = fileList?.[0]?.originFileObj || null;
        setImageFile(file);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {loading && (
                <div style={{ position: 'relative', minHeight: '100vh' }}>
                    {loading && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            zIndex: 9999,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backdropFilter: 'blur(4px)',
                            transition: 'opacity 0.3s ease-in-out'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #40a9ff, #1890ff)',
                                padding: '24px 32px',
                                borderRadius: 16,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                animation: 'scaleIn 0.3s ease-in-out'
                            }}>
                                <LoadingOutlined style={{ fontSize: 50, color: '#fff', marginBottom: 16 }} spin />
                                <div style={{
                                    fontSize: 18,
                                    color: '#fff',
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}>
                                    Đang tạo sản phẩm...
                                </div>
                            </div>
                            <style>
                                {`
          @keyframes scaleIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
                            </style>
                        </div>
                    )}
                </div>

            )}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
                <h2>Thêm sản phẩm</h2>
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        title: "",
                        description: "",
                        color: "",
                        material: "",
                        stone: "",
                        sex: "",
                        price: 0,
                        discount: 0,
                        stock: 0,
                        position: 0,
                        featured: false,
                        active: true,
                    }}
                >
                    {/* Tiêu đề */}
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề sản phẩm!" }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Danh mục */}
                    <Form.Item label="Danh mục" name="product_category_id">
                        <Select
                            placeholder="Chọn danh mục"
                        >
                            {productCategory?.map((category) => (
                                <Select.Option key={category._id} value={category._id}>
                                    {category.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Mô tả */}
                    <Form.Item label="Mô tả" name="description">
                        <TextArea rows={4} />
                    </Form.Item>

                    {/* Màu sắc */}
                    <Form.Item label="Màu sắc" name="color">
                        <Select placeholder="Chọn màu sắc">
                            <Select.Option value="Trắng">Trắng</Select.Option>
                            <Select.Option value="Hồng">Hồng</Select.Option>
                            <Select.Option value="Vàng">Vàng</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* Chất liệu */}
                    <Form.Item label="Chất liệu" name="material">
                        <Select placeholder="Chọn chất liệu">
                            <Select.Option value="Vàng">Vàng</Select.Option>
                            <Select.Option value="Bạc">Bạc</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* Ảnh (chỉ 1 ảnh) */}
                    {/* Đã chuyển xuống phần có rules bắt buộc bên dưới */}

                    {/* Giá */}
                    <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}>
                        <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            formatter={(value) => {
                                if (!value) return '';
                                return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                            }}
                            parser={(value) => {
                                if (!value) return 0;
                                return value.replace(/\./g, '').replace(/[^\d]/g, '');
                            }}
                            addonAfter="đ"
                        />
                    </Form.Item>

                    {/* Số lượng */}
                    <Form.Item label="Số lượng" name="stock" rules={[{ required: true, message: "Vui lòng nhập số lượng sản phẩm!" }]}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    {/* Ảnh (bắt buộc - chỉ 1 ảnh) */}
                    <Form.Item label="Ảnh" name="image" rules={[{ required: true, message: "Vui lòng chọn ảnh sản phẩm!" }]}>
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false}
                            showUploadList
                            onChange={handleImageChange}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>

                    {/* Vị trí */}
                    <Form.Item label="Vị trí" name="position" initialValue="Tự động tăng">
                        <Input disabled />
                    </Form.Item>

                    {/* Nổi bật */}
                    <Form.Item label="Nổi bật" name="featured">
                        <Radio.Group>
                            <Radio value={true}>Nổi bật</Radio>
                            <Radio value={false}>Không</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {/* Hoạt động */}
                    <Form.Item label="Hoạt động" name="active">
                        <Radio.Group>
                            <Radio value={true}>Hoạt động</Radio>
                            <Radio value={false}>Dừng hoạt động</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Tạo mới sản phẩm'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Product_Create;
