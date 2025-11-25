import { Form, Input, InputNumber, Radio, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as ProductService from "../../../../Services/productService";

const { TextArea } = Input;

function Product_Edit() {
    const { product_id } = useParams();
    const [product, setProduct] = useState(null);
    const [productCategory, setProductCategory] = useState(null);
    const navigate = useNavigate();

    const fetchProductDetail = async () => {
        const res = await ProductService.productDetail(product_id);
        setProduct(res);
    };

    const fetchProductCategory = async () => {
        const res = await ProductService.productCategoryDetail(
            product?.product_category_id
        );
        setProductCategory(res.data);
    };

    useEffect(() => {
        fetchProductDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product_id]);

    useEffect(() => {
        if (product && product.product_category_id) {
            fetchProductCategory();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    const handleSubmit = async (values) => {
        const res = await ProductService.productEdit(product_id, values);

        if (res.code === 200) {
            message.success("Cập nhật sản phẩm thành công!");
            navigate(`/admin/product`);
        } else {
            message.error("Cập nhật sản phẩm thất bại!");
        }
    };

    if (!product || !productCategory) {
        return <div>Đang tải...</div>;
    }

    return (
        <Form
            layout="vertical"
            initialValues={{
                title: product?.title || "",
                description: product?.description || "",
                category: productCategory?.title || "",
                color: product?.color || "",
                material: product?.material || "",
                price: product?.price || 0,
                discount: product?.discount || 0,
                stock: product?.stock || 0,
                image: product?.thumbnail || [],
                position: product?.position || "",
                featured: product?.featured || "0",
                active: product?.active || true,
            }}
            onFinish={handleSubmit}
        >
            {/* Tiêu đề */}
            <Form.Item label="Tiêu đề" name="title">
                <Input />
            </Form.Item>

            {/* Danh mục */}
            <Form.Item label="Danh mục" name="category">
                <Input />
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

            {/* Đã bỏ các thuộc tính Đá và Giới tính theo yêu cầu */}

            {/* Giá */}
            <Form.Item label="Giá" name="price">
                <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value) => value.replace(/\./g, '')}
                />
            </Form.Item>

            {/* Số lượng */}
            <Form.Item label="Số lượng" name="stock">
                <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            {/* Ảnh */}
            <Form.Item label="Ảnh" name="image">
                <img
                    src={product.thumbnail}
                    alt="product"
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

            {/* Nổi bật */}
            <Form.Item label="Nổi bật" name="featured">
                <Radio.Group>
                    <Radio value={"1"}>Nổi bật</Radio>
                    <Radio value={"0"}>Không</Radio>
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
                    Cập nhật sản phẩm
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Product_Edit;
