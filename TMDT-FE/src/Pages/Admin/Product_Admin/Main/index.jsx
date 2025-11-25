import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message, Pagination } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./ProductAdmin.scss";
import * as ProductService from "../../../../Services/productService";
import { useNavigate } from "react-router-dom";
import { TakePermissions } from "../../../../Componets/TakePermissions";

function ProductAdmin() {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(9);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const permissions = TakePermissions();

    const getProductSearch = async (val) => {
        const res = await ProductService.productSearch(val);
        setProducts(res.products);
        setAllProducts(res.products);
    };

    useEffect(() => {
        const productGet = async () => {
            const res = await ProductService.productGet();
            setProducts(res.products);
            setAllProducts(res.products);
        };
        productGet();
    }, []);

    const handleChangePagination = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = async (id) => {
        const res = await ProductService.productDelete(id);
        if (res.code === 200) {
            const updatedProducts = products.filter((product) => product._id !== id);
            setProducts(updatedProducts);
            setAllProducts(updatedProducts);
            message.success("Xóa sản phẩm thành công!");
        } else {
            message.error("Xóa sản phẩm thất bại!");
        }
    };

    const onSearchChange = async (e) => {
        const val = e.target.value;
        setSearch(val);
        setCurrentPage(1);

        if (val.trim() === "") {
            setProducts(allProducts);
        } else {
            getProductSearch(val);
        }
    };

    // Lọc và phân trang
    const filteredProducts = search.trim() === "" ? allProducts : products;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    return (
        <div className="product-admin">
            {permissions.includes("product_view") ? (
                <>
                    <div className="product-admin__header">
                        <h2>Quản lý sản phẩm</h2>
                        {permissions.includes("product_create") ? (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() =>
                                    navigate("/admin/product/create")
                                }
                            >
                                Thêm sản phẩm
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="product-admin__search">
                        <Input
                            placeholder="Tìm kiếm sản phẩm..."
                            prefix={<SearchOutlined />}
                            onChange={onSearchChange}
                            style={{ width: 300 }}
                        />
                    </div>
                    <div className="product-grid">
                        {/* Header */}
                        <Row className="product-grid-header" gutter={0}>
                            <Col span={1}>
                                <b>STT</b>
                            </Col>
                            <Col span={3}>
                                <b>Ảnh</b>
                            </Col>
                            <Col span={6}>
                                <b>Tên sản phẩm</b>
                            </Col>
                            <Col span={3} style={{ textAlign: 'center' }}>
                                <b>Giá</b>
                            </Col>
                            <Col span={2}>
                                <b>Tồn kho</b>
                            </Col>
                            <Col span={4}>
                                <b>Người tạo</b>
                            </Col>
                            <Col span={4}>
                                <b>Hành động</b>
                            </Col>
                        </Row>

                        {products.length === 0 ? (
                            <Row
                                className="product-grid-row"
                                style={{ textAlign: "center" }}
                            >
                                <Col span={24}>Không có sản phẩm nào.</Col>
                            </Row>
                        ) : (
                            currentProducts.map((item, index) => (
                                <Row
                                    className="product-grid-row"
                                    key={item._id || item.key}
                                    gutter={0}
                                    align="middle"
                                >
                                    <Col span={1}>{startIndex + index + 1}</Col>
                                    <Col span={3}>
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt="product"
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
                                    <Col span={3} style={{ textAlign: 'center' }}>
                                        {item.price?.toLocaleString()}
                                    </Col>
                                    <Col span={2}>{item.stock}</Col>
                                    <Col span={4}>{item.create}</Col>
                                    <Col span={4}>
                                        <Button
                                            icon={<EyeOutlined />}
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/product/detail/${item._id}`
                                                )
                                            }
                                            style={{ marginRight: 4 }}
                                        >
                                            Xem
                                        </Button>
                                        {permissions.includes(
                                            "product_edit"
                                        ) ? (
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/product/edit/${item._id}`
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
                                            "product_deleted"
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

                    {/* Pagination */}
                    {filteredProducts.length > 0 && (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredProducts.length}
                                onChange={handleChangePagination}
                                showSizeChanger={false}
                                showTotal={(total, range) =>
                                    `${range[0]}-${range[1]} của ${total} sản phẩm`
                                }
                            />
                        </div>
                    )}
                </>
            ) : (
                <>
                    <p>Không có quyền hạn</p>
                </>
            )}
        </div>
    );
}

export default ProductAdmin;
