import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";
import NavbarComponents from "../../Componets/NavbarComponents";
import CardProduct from "../../Componets/CardProduct";
import * as ProductService from "../../Services/productService";
import "./ProductCategory.scss";
import { useMutationHook } from "../../Hooks/useMutationHook";
import { useDispatch, useSelector } from "react-redux";

function ProductCategory() {
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let product = useSelector((state) => state.product)

    product=product.data

    const mutation = useMutationHook((category) => ProductService.productGet(category));

    useEffect( () => {
        const fetchCategory = async () => {
            try {
                const res = await ProductService.productCategoryGet();
                setCategory(res)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchCategory();
    },[])



    const handleProductCategory = (productCategory) => {
        mutation.mutate(productCategory)
    }

    const handleProductClick = (item) => {
        navigate(`/products/detail/${item._id}`);
    };
    return (
        <div className="container-product">
            <Row className="product-list-title">
                {category.map((item, index) => (
                    <Col span={24 / category.length} key={index}>
                        <div className="product-title" onClick={() =>handleProductCategory(item._id)}>{item.title}</div>
                    </Col>
                ))}
            </Row>
            <Row className="product-main">
                <Col span={4} className="navbar">
                    <NavbarComponents />
                </Col>
                <Col span={20}>
                    <Row gutter={[16, 16]}>
                        {product.map((item, index) => (
                            <Col
                                span={7}
                                key={index}
                                className="product-item"
                                style={{ marginLeft: "50px" }}
                                onClick={() => handleProductClick(item)}
                            >
                                <CardProduct
                                    img={item.thumbnail}
                                    title={item.title}
                                    price={item.price}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default ProductCategory;
