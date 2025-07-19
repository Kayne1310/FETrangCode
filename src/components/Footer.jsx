import React from 'react';
import { Layout, Row, Col, Typography, Space, Button, Divider } from 'antd';
import { 
  SafetyOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  GithubOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Paragraph, Link } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className="footer">
      <div className="container">
        <Row gutter={[48, 32]}>
          {/* Brand Section */}
          <Col xs={24} sm={12} lg={6}>
            <div className="footer-brand">
              <div className="footer-logo">
                <SafetyOutlined className="footer-logo-icon" />
                <span className="footer-logo-text">SafeMail Guard</span>
              </div>
              
              <Paragraph className="footer-description">
                Hệ thống AI tiên tiến bảo vệ bạn khỏi các mối đe dọa email, 
                phishing và spam với độ chính xác 99.9%.
              </Paragraph>
              
              <div className="social-links">
                <Space size="middle">
                  <Button 
                    type="text" 
                    icon={<FacebookOutlined />} 
                    className="social-btn"
                    aria-label="Facebook"
                  />
                  <Button 
                    type="text" 
                    icon={<TwitterOutlined />} 
                    className="social-btn"
                    aria-label="Twitter"
                  />
                  <Button 
                    type="text" 
                    icon={<LinkedinOutlined />} 
                    className="social-btn"
                    aria-label="LinkedIn"
                  />
                  <Button 
                    type="text" 
                    icon={<GithubOutlined />} 
                    className="social-btn"
                    aria-label="GitHub"
                  />
                </Space>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} lg={6}>
            <div className="footer-section">
              <Title level={4} className="footer-title">
                Liên kết nhanh
              </Title>
              <ul className="footer-links">
                <li><Link href="#home">Trang chủ</Link></li>
                <li><Link href="#features">Tính năng</Link></li>
                <li><Link href="#check">Kiểm tra</Link></li>
                <li><Link href="#education">Giáo dục</Link></li>
                <li><Link href="#stats">Thống kê</Link></li>
                <li><Link href="#about">Giới thiệu</Link></li>
              </ul>
            </div>
          </Col>

          {/* Services */}
          <Col xs={24} sm={12} lg={6}>
            <div className="footer-section">
              <Title level={4} className="footer-title">
                Dịch vụ
              </Title>
              <ul className="footer-links">
                <li><Link href="#email-check">Kiểm tra Email</Link></li>
                <li><Link href="#link-scan">Quét Link</Link></li>
                <li><Link href="#phone-verify">Xác minh SĐT</Link></li>
                <li><Link href="#content-analysis">Phân tích Nội dung</Link></li>
                <li><Link href="#enterprise">Doanh nghiệp</Link></li>
                <li><Link href="#api">API Developer</Link></li>
              </ul>
            </div>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={12} lg={6}>
            <div className="footer-section">
              <Title level={4} className="footer-title">
                Liên hệ
              </Title>
              <div className="contact-info">
                <Space direction="vertical" size="middle">
                  <div className="contact-item">
                    <MailOutlined className="contact-icon" />
                    <div className="contact-details">
                      <span className="contact-label">Email</span>
                      <Link href="mailto:support@safemailguard.com">
                         watchersguard@gmail.com
                      </Link>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <PhoneOutlined className="contact-icon" />
                    <div className="contact-details">
                      <span className="contact-label">Hotline</span>
                      <Link href="tel:1900-123-456">1900 123 456</Link>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <EnvironmentOutlined className="contact-icon" />
                    <div className="contact-details">
                      <span className="contact-label">Địa chỉ</span>
                      <span>
                        BTEC<br />
                        TP Hà Nội,Việt Nam
                      </span>
                    </div>
                  </div>
                </Space>
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="footer-divider" />

        {/* Bottom Section */}
        <div className="footer-bottom">
          <Row justify="space-between" align="middle">
            <Col xs={24} lg={12}>
              <div className="copyright">
                <Paragraph className="copyright-text">
                  © {currentYear} Watchers Guard. All rights reserved.
                </Paragraph>
              </div>
            </Col>
            
            <Col xs={24} lg={12}>
              <div className="footer-legal">
                <Space split={<span>•</span>} className="legal-links">
                  <Link href="/privacy">Chính sách Bảo mật</Link>
                  <Link href="/terms">Điều khoản Sử dụng</Link>
                  <Link href="/cookies">Cookie Policy</Link>
                  <Link href="/support">Hỗ trợ</Link>
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 