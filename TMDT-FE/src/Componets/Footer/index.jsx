import React from 'react';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import './Footer.scss';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-top-left">
                    <h3>Luxury Jewelry</h3>
                    <p>Nhận ưu đãi 10% cho khách hàng mới</p>
                </div>
                <div className="footer-top-right">
                    <button className="register-button">ĐĂNG KÝ NGAY</button>
                </div>
            </div>
            <div className="footer-middle">
                <div className="footer-column">
                    <h4>Khám phá</h4>
                    <ul>
                        <li>Charms</li>
                        <li>Vòng tay</li>
                        <li>Dây chuyền</li>
                        <li>Hoa tai</li>
                        <li>Nhẫn</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Chăm sóc khách hàng</h4>
                    <ul>
                        <li>Câu hỏi thường gặp</li>
                        <li>Chính sách bảo mật</li>
                        <li>Chính sách thanh toán</li>
                        <li>Chính sách giao nhận</li>
                        <li>Chính sách đổi hàng</li>
                        <li>Cách thức bảo quản</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Dịch vụ giao hàng</h4>
                    <ul>
                        <li>Giao hàng tiết kiệm</li>
                        <li>Ahamove</li>
                        <li>Kiểm tra đơn hàng</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Hệ thống cửa hàng</h4>
                    <ul>
                        <li>Cửa hàng toàn quốc</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Về chúng tôi</h4>
                    <ul>
                        <li>Về Pandora</li>
                        <li>Câu chuyện Pandora</li>
                        <li>Về Tập Đoàn Norbreeze</li>
                        <li>Tuyển dụng</li>
                        <li>Liên hệ</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© Pandora Jewelry, LLC. All rights reserved.</p>
                <div className='contact-icon'>
                    <FacebookOutlined style={{ fontSize: '24px' }} />
                    <InstagramOutlined style={{ fontSize: '24px' }} />
                </div>
            </div>
        </footer>
    );
}

export default Footer;