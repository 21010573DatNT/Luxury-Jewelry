import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./CategoryAdmin.scss";
import * as ProductService from "../../../../Services/productService";
import * as CategoryService from "../../../../Services/categoryService";
import { useNavigate } from "react-router-dom";
import { TakePermissions } from "../../../../Componets/TakePermissions";

function CategoryAdmin() {
    const [categories, setCategory] = useState([]);
    const navigate = useNavigate();
    const permissions = TakePermissions();

    const getCategorySearch = async (val) => {
        const res = await CategoryService.categorySearch(val);
        setCategory(res.categories);
    };

    useEffect(() => {
        const categoryGet = async () => {
            const res = await ProductService.productCategoryGet();
            setCategory(res);
        };
        categoryGet();
    }, []);

    const handleDelete = async (id) => {
        const res = await CategoryService.categoryDelete(id);
        if (res.code === 200) {
            setCategory((prevCategory) =>
                prevCategory.filter((category) => category._id !== id)
            );
            message.success("Xóa danh mục thành công!");
        } else {
            message.error("Xóa danh mục thất bại!");
        }
    };

    const onSearchChange = async (e) => {
        const val = e.target.value;
        getCategorySearch(val);
    };

    return (
        <div className="category-admin">
            {permissions.includes("product-category_view") ? (
                <>
                    <div className="category-admin__header">
                        <h2>Quản lý danh mục sản phẩm</h2>
                        {permissions.includes("product-category_create") ? (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() =>
                                    navigate("/admin/category/create")
                                }
                            >
                                Thêm danh mục sản phẩm
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="category-admin__search">
                        <Input
                            placeholder="Tìm kiếm danh mục sản phẩm..."
                            prefix={<SearchOutlined />}
                            onChange={onSearchChange}
                            style={{ width: 300 }}
                        />
                    </div>
                    <div className="category-grid">
                        {/* Header */}
                        <Row className="category-grid-header" gutter={0}>
                            <Col span={2}>
                                <b>STT</b>
                            </Col>
                            <Col span={5}>
                                <b>Ảnh</b>
                            </Col>
                            <Col span={6}>
                                <b>Danh mục sản phẩm</b>
                            </Col>
                            <Col span={5}>
                                <b>Người tạo</b>
                            </Col>
                            <Col span={6}>
                                <b>Hành động</b>
                            </Col>
                        </Row>

                        {categories.length === 0 ? (
                            <Row
                                className="category-grid-row"
                                style={{ textAlign: "center" }}
                            >
                                <Col span={24}>
                                    Không có danh mục sản phẩm nào.
                                </Col>
                            </Row>
                        ) : (
                            categories.map((item) => (
                                <Row
                                    className="category-grid-row"
                                    key={item.key}
                                    gutter={0}
                                    align="middle"
                                >
                                    <Col span={2}>{item.position}</Col>
                                    <Col span={5}>
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt="category"
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 6,
                                                }}
                                            />
                                        ) : (
                                            <span>Không có ảnh</span>
                                        )}
                                    </Col>
                                    <Col span={6}>{item.title}</Col>
                                    <Col span={5}></Col>
                                    <Col span={6}>
                                        <Button
                                            icon={<EyeOutlined />}
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/category/detail/${item._id}`
                                                )
                                            }
                                            style={{ marginRight: 4 }}
                                        >
                                            Xem
                                        </Button>
                                        {permissions.includes(
                                            "product-category_edit"
                                        ) ? (
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/category/edit/${item._id}`
                                                    )
                                                }
                                                style={{ marginRight: 4 }}
                                            >
                                                Sửa
                                            </Button>
                                        ) : (
                                            <></>
                                        )}

                                        {permissions.includes(
                                            "product-category_deleted"
                                        ) ? (
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                danger
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                            >
                                                Xóa
                                            </Button>
                                        ) : (
                                            <></>
                                        )}
                                    </Col>
                                </Row>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <>
                    <p>Không có quyền hạn</p>
                </>
            )}
        </div>
    );
}

export default CategoryAdmin;
