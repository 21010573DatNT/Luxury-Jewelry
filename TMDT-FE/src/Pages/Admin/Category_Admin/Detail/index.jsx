import { Form, Input } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as ProductService from "../../../../Services/productService";

function Category_Detail() {
    const { category_id } = useParams();
    const [category, setCategory] = useState(null)

    const fetchCategory = async () => {
        const res = await ProductService.productCategoryDetail(category_id)
        setCategory(res.data)
    }

    useEffect(() => {
        fetchCategory();
    }, []);


    if (!category) {
        return <div>Đang tải...</div>;
    }

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            <h2>Xem danh mục sản phẩm</h2>
            <Form
                layout="vertical"
                initialValues={{
                    title: category?.title || "",
                    image: category?.thumbnail || "",
                    position: category?.position || "",
                }}
            >
                {/* Tiêu đề */}
                <Form.Item label="Tiêu đề" name="title">
                    <Input />
                </Form.Item>

                {/* Ảnh */}
                <Form.Item label="Ảnh" name="image">
                    <img
                        src={category.thumbnail}
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
                    <Input disabled placeholder="Tự động tăng" />
                </Form.Item>
            </Form>
        </div>
    );
}

export default Category_Detail;
