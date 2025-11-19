import React, { useState } from "react";
import { Rate } from "antd";
import "./CardProduct.scss";

const CardProducts = (props) => {
    const { img, title, price, rate, originalPrice, discount, isNew, isBestSeller, stock } = props;
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="modern-card-product"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="card-badges">
                {isNew && <span className="badge badge-new">Mới</span>}
                {isBestSeller && <span className="badge badge-bestseller">Bán chạy</span>}
                {discount && <span className="badge badge-discount">-{discount}%</span>}
            </div>

            {/* Image Container */}
            <div className="card-image-container">
                <img
                    alt={title}
                    src={img}
                    className="card-image"
                />
                <div className={`card-overlay ${isHovered ? 'show' : ''}`}>
                    <div className="overlay-actions">
                        <button className="action-btn quick-view">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="card-content">

                <h3 className="card-title">{title}</h3>

                <div className="card-rating">
                    <Rate
                        defaultValue={rate}
                        style={{ fontSize: '14px' }}
                        disabled
                    />
                </div>

                <div className="card-pricing">
                    <div className="current-price">
                        {price ? price.toLocaleString() : "0"}đ
                    </div>
                    {originalPrice && (
                        <div className="original-price">
                            {originalPrice.toLocaleString()}đ
                        </div>
                    )}
                </div>

                {/* Stock Information */}
                {stock !== undefined && (
                    <div className="card-stock" style={{
                        marginTop: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: stock > 0 ? '#c41a1aff' : '#ff4d4f'
                    }}>
                        {stock > 0 ? `Còn ${stock} sản phẩm` : 'Hết hàng'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardProducts;