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
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as ProductService from "../../../../Services/productService";

const { TextArea } = Input;

function Product_Create() {
    const [productCategory, setProductCategory] = useState([]);
    const [imageFile, setImageFile] = useState(null);  
    const navigate = useNavigate();

    const fetchProductCategory = async () => {
        const res = await ProductService.productCategoryGet();
        setProductCategory(res);
    };

    useEffect(() => {
        fetchProductCategory();
    }, []);

    const handleSubmit = async (values) => {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
            if (key === "image" && imageFile) {
                formData.append("image", imageFile); 
            } else {
                formData.append(key, values[key]);
            }
        });

        const res = await ProductService.productCreate(formData);

        if (res.code === 200) {
            message.success("Tạo sản phẩm thành công!");
            navigate(`/admin/product`);
        } else {
            message.error("Tạo sản phẩm thất bại!");
        }
    };


    const handleImageChange = (info) => {
        if (info.file) {
            setImageFile(info.file.originFileObj);  // Lưu file ảnh vào state khi upload thành công
        } else if (info.file.status === 'error') {
            message.error('Lỗi khi tải ảnh!');
        }
    };

    return (
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
                <Input />
            </Form.Item>

            {/* Chất liệu */}
            <Form.Item label="Chất liệu" name="material">
                <Input />
            </Form.Item>

            {/* Đá */}
            <Form.Item label="Đá" name="stone">
                <Input />
            </Form.Item>

            {/* Giới tính */}
            <Form.Item label="Giới tính" name="sex">
                <Input />
            </Form.Item>

            {/* Giá */}
            <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}>
                <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            {/* Số lượng */}
            <Form.Item label="Số lượng" name="stock" rules={[{ required: true, message: "Vui lòng nhập số lượng sản phẩm!" }]}>
                <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            {/* Ảnh */}
            <Form.Item label="Ảnh" name="image" rules={[{ required: true, message: "Vui lòng chọn ảnh sản phẩm!" }]}>
                <Upload
                    listType="picture-card"
                    maxCount={1}
                    showUploadList={false}
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
                <Button type="primary" htmlType="submit">
                    Tạo mới sản phẩm
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Product_Create;
