import { Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as CategoryService from "../../../../Services/categoryService";
import * as ProductService from "../../../../Services/productService";

function Category_Edit() {
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();
    const { category_id } = useParams();
    const [category, setCategory] = useState(null);

    const fetchCategory = async () => {
        const res = await ProductService.productCategoryDetail(category_id);
        setCategory(res.data);
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleImageChange = (info) => {
        if (info.file) {
            setImageFile(info.file.originFileObj);
        } else if (info.file.status === "error") {
            message.error("Lỗi khi tải ảnh!");
        }
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
            if (key === "image" && imageFile) {
                console.log(imageFile)
                formData.append("image", imageFile);
            } else {
                formData.append(key, values[key]);
            }
        });

        for (let [key, value] of formData.entries()) {
        console.log(key, value);  // Xem các giá trị trong FormData
    }

        const res = await CategoryService.categoryUpdate(category_id,formData);

        if (res.code === 200) {
            message.success("Cập nhật danh mục thành công!");
            navigate(`/admin/category`);
        } else {
            message.error("Cập nhật danh mục thất bại!");
        }
    };

    if (!category) {
        return <div>Đang tải...</div>;
    }

    return (
        <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                title: category?.title,
                image: [],
                position: category?.position,
            }}
        >
            {/* Tiêu đề */}
            <Form.Item label="Tiêu đề" name="title">
                <Input />
            </Form.Item>

            {/* Ảnh */}
            <Form.Item label="Ảnh" name="image">
                <Upload
                    listType="picture-card"
                    maxCount={1}
                    showUploadList={false}
                    onChange={handleImageChange}
                >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
                <img
                    src={category?.thumbnail}
                    alt="category"
                    style={{
                        width: 150,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 6,
                    }}
                />
            </Form.Item>

            {/* Vị trí */}
            <Form.Item label="Vị trí" name="position">
                <Input placeholder="Tự động tăng" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Cập nhật
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Category_Edit;
