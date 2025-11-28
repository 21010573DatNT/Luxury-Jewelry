import {
    Form,
    Input,
    Button,
    message,
    Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as CategoryService from "../../../../Services/categoryService";

function Category_Create() {
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

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
                formData.append("image", imageFile);
            } else {
                formData.append(key, values[key]);
            }
        });

        const res = await CategoryService.categoryCreate(formData);

        if (res.code === 200) {
            message.success("Tạo danh mục sản phẩm thành công!");
            navigate(`/admin/category`);
        } else {
            message.error("Tạo danh mục sản phẩm thất bại!");
        }
    };

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            <h2>Thêm danh mục sản phẩm</h2>
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    title: "",
                    image: [],
                    position: 1,
                }}
            >
                {/* Tiêu đề */}
                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tiêu đề sản phẩm!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* Ảnh */}
                <Form.Item
                    label="Ảnh"
                    name="image"
                    rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
                >
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
                <Form.Item label="Vị trí" name="position">
                    <Input disabled placeholder="Tự động tăng" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Tạo mới
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Category_Create;
