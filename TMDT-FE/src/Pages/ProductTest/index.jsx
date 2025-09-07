import React, { useState, useEffect } from 'react';
import { Card, Button, Slider, Checkbox, Select, Pagination, Rate, Tag } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
// SCSS Styles
const styles = `
.product-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;

  .category-tabs {
    background: white;
    padding: 16px 24px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    .category-btn {
      margin-right: 12px;
      margin-bottom: 8px;
      border-radius: 20px;
      
      &.ant-btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
      }
    }
  }

  .main-content {
    display: flex;
    gap: 24px;
    
    .filters-sidebar {
      width: 280px;
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      height: fit-content;
      position: sticky;
      top: 20px;
      
      .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;
        
        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
      }
      
      .filter-section {
        margin-bottom: 24px;
        
        h4 {
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          
          .ant-checkbox-wrapper {
            margin: 0;
            padding: 4px 0;
            
            &:hover {
              color: #667eea;
            }
          }
        }
        
        .price-range-text {
          margin-top: 8px;
          text-align: center;
          font-weight: 500;
          color: #667eea;
          font-size: 14px;
        }
        
        .rating-filter {
          .rating-option {
            margin-bottom: 8px;
            
            .ant-checkbox-wrapper {
              display: flex;
              align-items: center;
              
              .ant-rate {
                margin-left: 8px;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
    
    .products-area {
      flex: 1;
      
      .products-header {
        background: white;
        padding: 16px 24px;
        margin-bottom: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .results-info {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }
      }
      
      .products-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 32px;
        
        .product-card {
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          
          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          
          .product-image-container {
            position: relative;
            overflow: hidden;
            
            img {
              width: 100%;
              height: 220px;
              object-fit: cover;
              transition: transform 0.3s ease;
            }
            
            &:hover img {
              transform: scale(1.05);
            }
            
            .discount-tag {
              position: absolute;
              top: 10px;
              left: 10px;
              font-weight: 600;
              border-radius: 12px;
              font-size: 12px;
            }
            
            .product-actions {
              position: absolute;
              bottom: 10px;
              right: 10px;
              display: flex;
              gap: 8px;
              opacity: 0;
              transition: opacity 0.3s ease;
              
              .ant-btn {
                border-radius: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                
                &.ant-btn-primary {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border: none;
                }
              }
              
              .wishlist-btn {
                background: white;
                border: 1px solid #d9d9d9;
                
                &:hover {
                  color: #ff4d4f;
                  border-color: #ff4d4f;
                }
              }
            }
            
            &:hover .product-actions {
              opacity: 1;
            }
          }
          
          .ant-card-body {
            padding: 16px;
          }
          
          .product-info {
            .product-rating {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 8px;
              
              .reviews-count {
                font-size: 12px;
                color: #999;
              }
            }
            
            .product-price {
              margin-bottom: 12px;
              
              .current-price {
                font-size: 16px;
                font-weight: 600;
                color: #667eea;
                margin-right: 8px;
              }
              
              .original-price {
                font-size: 14px;
                color: #999;
                text-decoration: line-through;
              }
            }
            
            .product-colors {
              display: flex;
              gap: 6px;
              margin-bottom: 8px;
              
              .color-dot {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 2px solid #f0f0f0;
                cursor: pointer;
                transition: transform 0.2s ease;
                
                &:hover {
                  transform: scale(1.2);
                }
              }
            }
            
            .out-of-stock {
              font-size: 11px;
              border-radius: 8px;
            }
          }
        }
      }
      
      .pagination-container {
        display: flex;
        justify-content: center;
        padding: 24px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        
        .ant-pagination {
          .ant-pagination-item-active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
            
            a {
              color: white;
            }
          }
          
          .ant-pagination-item {
            border-radius: 6px;
            
            &:hover {
              border-color: #667eea;
              
              a {
                color: #667eea;
              }
            }
          }
          
          .ant-pagination-prev,
          .ant-pagination-next {
            border-radius: 6px;
            
            &:hover {
              border-color: #667eea;
              color: #667eea;
            }
          }
        }
      }
    }
  }
}

// Responsive Design
@media (max-width: 1200px) {
  .product-page .main-content .products-area .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-page {
    padding: 10px;
    
    .main-content {
      flex-direction: column;
      
      .filters-sidebar {
        width: 100%;
        position: static;
      }
      
      .products-area .products-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .category-tabs {
      padding: 12px 16px;
      
      .category-btn {
        margin-right: 8px;
        margin-bottom: 8px;
        font-size: 12px;
        padding: 4px 12px;
        height: auto;
      }
    }
    
    .products-header {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
      
      .results-info {
        text-align: center;
      }
    }
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const { Option } = Select;
const { Meta } = Card;

// Dữ liệu mẫu cho sản phẩm
const generateMockProducts = () => {
  const categories = ['Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện', 'Đồng hồ'];
  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Huawei'];
  const colors = ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Vàng', 'Xám'];
  
  const products = [];
  for (let i = 1; i <= 60; i++) {
    products.push({
      id: i,
      name: `Sản phẩm ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      price: Math.floor(Math.random() * 50000000) + 1000000,
      originalPrice: Math.floor(Math.random() * 60000000) + 10000000,
      rating: Math.floor(Math.random() * 5) + 1,
      reviews: Math.floor(Math.random() * 1000) + 10,
      image: `https://picsum.photos/300/300?random=${i}`,
      colors: colors.slice(0, Math.floor(Math.random() * 3) + 1),
      inStock: Math.random() > 0.1,
      discount: Math.floor(Math.random() * 50) + 5
    });
  }
  return products;
};

const ProductTest = () => {
  const [products] = useState(generateMockProducts());
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    brands: [],
    priceRange: [0, 50000000],
    colors: [],
    inStock: false,
    minRating: 0
  });
  const [sortBy, setSortBy] = useState('default');

  const productsPerPage = 12;
  const categories = ['Tất cả', 'Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện', 'Đồng hồ'];
  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Huawei'];
  const colors = ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Vàng', 'Xám'];

  // Lọc sản phẩm
  useEffect(() => {
    let filtered = products.filter(product => {
      const categoryMatch = !filters.category || filters.category === 'Tất cả' || product.category === filters.category;
      const brandMatch = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const colorMatch = filters.colors.length === 0 || filters.colors.some(color => product.colors.includes(color));
      const stockMatch = !filters.inStock || product.inStock;
      const ratingMatch = product.rating >= filters.minRating;

      return categoryMatch && brandMatch && priceMatch && colorMatch && stockMatch && ratingMatch;
    });

    // Sắp xếp
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters, sortBy, products]);

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleBrandChange = (checkedValues) => {
    setFilters(prev => ({ ...prev, brands: checkedValues }));
  };

  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  const handleColorChange = (checkedValues) => {
    setFilters(prev => ({ ...prev, colors: checkedValues }));
  };

  const handleStockChange = (e) => {
    setFilters(prev => ({ ...prev, inStock: e.target.checked }));
  };

  const handleRatingChange = (value) => {
    setFilters(prev => ({ ...prev, minRating: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brands: [],
      priceRange: [0, 50000000],
      colors: [],
      inStock: false,
      minRating: 0
    });
    setSortBy('default');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  return (
    <div className="product-page">
      {/* Header với categories */}
      <div className="category-tabs">
        {categories.map(category => (
          <Button
            key={category}
            type={filters.category === category || (category === 'Tất cả' && !filters.category) ? 'primary' : 'default'}
            onClick={() => handleCategoryChange(category === 'Tất cả' ? '' : category)}
            className="category-btn"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="main-content">
        {/* Sidebar Filters */}
        <div className="filters-sidebar">
          <div className="filter-header">
            <h3>Bộ lọc</h3>
            <Button type="link" onClick={clearFilters}>Xóa tất cả</Button>
          </div>

          {/* Thương hiệu */}
          <div className="filter-section">
            <h4>Thương hiệu</h4>
            <Checkbox.Group
              options={brands}
              value={filters.brands}
              onChange={handleBrandChange}
              className="checkbox-group"
            />
          </div>

          {/* Khoảng giá */}
          <div className="filter-section">
            <h4>Khoảng giá</h4>
            <Slider
              range
              min={0}
              max={50000000}
              step={1000000}
              value={filters.priceRange}
              onChange={handlePriceChange}
              tipFormatter={value => formatPrice(value)}
            />
            <div className="price-range-text">
              {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
            </div>
          </div>

          {/* Màu sắc */}
          <div className="filter-section">
            <h4>Màu sắc</h4>
            <Checkbox.Group
              options={colors}
              value={filters.colors}
              onChange={handleColorChange}
              className="checkbox-group"
            />
          </div>

          {/* Đánh giá */}
          <div className="filter-section">
            <h4>Đánh giá từ</h4>
            <div className="rating-filter">
              {[1, 2, 3, 4, 5].map(rating => (
                <div key={rating} className="rating-option">
                  <Checkbox
                    checked={filters.minRating === rating}
                    onChange={() => handleRatingChange(filters.minRating === rating ? 0 : rating)}
                  >
                    <Rate disabled defaultValue={rating} />
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>

          {/* Tình trạng kho */}
          <div className="filter-section">
            <Checkbox
              checked={filters.inStock}
              onChange={handleStockChange}
            >
              Chỉ hiển thị sản phẩm còn hàng
            </Checkbox>
          </div>
        </div>

        {/* Products Area */}
        <div className="products-area">
          {/* Sort and Results Info */}
          <div className="products-header">
            <div className="results-info">
              Hiển thị {getCurrentPageProducts().length} trên {filteredProducts.length} sản phẩm
            </div>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 200 }}
              placeholder="Sắp xếp theo"
            >
              <Option value="default">Mặc định</Option>
              <Option value="price-asc">Giá tăng dần</Option>
              <Option value="price-desc">Giá giảm dần</Option>
              <Option value="rating">Đánh giá cao nhất</Option>
              <Option value="newest">Mới nhất</Option>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {getCurrentPageProducts().map(product => (
              <Card
                key={product.id}
                hoverable
                className="product-card"
                cover={
                  <div className="product-image-container">
                    <img alt={product.name} src={product.image} />
                    {product.discount && (
                      <Tag color="red" className="discount-tag">
                        -{product.discount}%
                      </Tag>
                    )}
                    <div className="product-actions">
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        size="small"
                        disabled={!product.inStock}
                      >
                        Thêm vào giỏ
                      </Button>
                      <Button
                        icon={<HeartOutlined />}
                        size="small"
                        className="wishlist-btn"
                      />
                    </div>
                  </div>
                }
              >
                <Meta
                  title={product.name}
                  description={
                    <div className="product-info">
                      <div className="product-rating">
                        <Rate disabled defaultValue={product.rating} size="small" />
                        <span className="reviews-count">({product.reviews})</span>
                      </div>
                      <div className="product-price">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="original-price">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <div className="product-colors">
                        {product.colors.map(color => (
                          <span key={color} className="color-dot" style={{
                            backgroundColor: color === 'Đen' ? '#000' : 
                                           color === 'Trắng' ? '#fff' :
                                           color === 'Xanh' ? '#0066cc' :
                                           color === 'Đỏ' ? '#cc0000' :
                                           color === 'Vàng' ? '#ffcc00' : '#999'
                          }} />
                        ))}
                      </div>
                      {!product.inStock && (
                        <Tag color="red" className="out-of-stock">Hết hàng</Tag>
                      )}
                    </div>
                  }
                />
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              total={filteredProducts.length}
              pageSize={productsPerPage}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} trên ${total} sản phẩm`
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTest;