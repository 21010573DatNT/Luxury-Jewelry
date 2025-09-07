import { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { TakeUserID } from "../TakeUserID";
import * as RecommendService from "../../Services/recommendService";
import "./RecommendProducts.scss";
import CardProduct from "../CardProduct";
import { useNavigate } from "react-router-dom";

function RecommendProducts(prop) {
    const [recommendProducts, setRecommendProducts] = useState([]);
    const infoUser = TakeUserID();
    const user_id = infoUser.user_id;
    const product_id = prop.product_id;
    const navigate = useNavigate();

    const getRecommend = async () => {
        const res = await RecommendService.Recommend(user_id, product_id);
        setRecommendProducts(res.products);
    };

    useEffect(() => {
        getRecommend();
    }, [product_id]);

    if (recommendProducts.length === 0) return null;

    return (
        <div style={{ marginTop: 40 }} className="recommend-product">
            <p className="title">Sản phẩm liên quan</p>
            <Row gutter={[24, 24]} className="recommend-product-list">
                {recommendProducts.map((item) => (
                    <Col
                        key={item._id}
                        span={6}
                        onClick={() => {
                            navigate(`/products/detail/${item._id}`);
                            window.scrollTo(0, 0);
                        }}
                    >
                        <CardProduct
                            img={item.thumbnail}
                            title={item.title}
                            price={item.price}
                            rate={item.rate_total}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default RecommendProducts;
