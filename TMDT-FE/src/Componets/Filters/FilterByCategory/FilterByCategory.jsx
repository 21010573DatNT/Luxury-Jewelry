import * as ProductService from "../../../Services/productService";
import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import "./FilterByCategory.scss";

function FilterByCategory({ onChange, activeCategoryId }) {
    const [categories, setCategory] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await ProductService.productCategoryGet();
                setCategory(res);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchProduct();
    }, []);

    const handleClick = (category) => {
        if (onChange) {
            onChange(category._id);
        }
    };

    return (
        <div className="filter-category-wrapper">
            <Row className="category-filter">
                {categories.map((category) => (
                    <Col 
                        xs={12} 
                        sm={8} 
                        md={6} 
                        lg={6} 
                        key={category.id}
                    >
                        <div
                            className={`category-item ${
                                activeCategoryId === category._id ? "active" : ""
                            }`}
                            onClick={() => handleClick(category)}
                        >
                            <div className="category-image-wrapper">
                                <img
                                    src={category.thumbnail}
                                    alt={category.title}
                                    className="category-image"
                                />
                            </div>
                            <div className="category-title">
                                {category.title}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default FilterByCategory;