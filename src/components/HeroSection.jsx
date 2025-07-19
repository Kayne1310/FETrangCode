import React from 'react';
import { Row, Col, Typography, Button, Space } from 'antd';
import { 
  SafetyOutlined, 
  SecurityScanOutlined,
  EyeOutlined,
  RightCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-background">
        <div className="hero-overlay">
          <div className="container">
            <Row gutter={[48, 48]} align="middle" justify="center">
              <Col xs={24} lg={12}>
                <div className="hero-content">
                  <Title level={1} className="hero-title">
                    Bảo vệ bạn khỏi 
                    <span className="text-gradient"> Lừa đảo Email</span>
                  </Title>
                  
                  <Paragraph className="hero-description" size="large">
                    Hệ thống AI tiên tiến phát hiện và cảnh báo các email lừa đảo, 
                    phishing và spam. Bảo vệ thông tin cá nhân và doanh nghiệp của bạn 
                    với độ chính xác cao nhất.
                  </Paragraph>
                  
                  <div className="hero-features">
                    <Space direction="vertical" size="small">
                      <div className="feature-item">
                        <SecurityScanOutlined className="feature-icon" />
                        <span>Phát hiện tự động 99.9% email độc hại</span>
                      </div>
                      <div className="feature-item">
                        <SafetyOutlined className="feature-icon" />
                        <span>Phân tích thời gian thực 24/7</span>
                      </div>
                      <div className="feature-item">
                        <EyeOutlined className="feature-icon" />
                        <span>Giáo dục cộng đồng về an toàn mạng</span>
                      </div>
                    </Space>
                  </div>
                  
                  <Space size="large" className="hero-actions">
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<RightCircleOutlined />}
                      className="cta-button"
                    >
                      Kiểm tra ngay
                    </Button>
                    <Button 
                      size="large" 
                      ghost
                      className="secondary-button"
                    >
                      Tìm hiểu thêm
                    </Button>
                  </Space>
                </div>
              </Col>
              
              <Col xs={24} lg={12}>
                <div className="hero-visual">
                  <div className="security-shield">
                    <SafetyOutlined className="shield-icon" />
                  </div>
                  <div className="floating-cards">
                    <div className="status-card safe">
                      <span className="status-dot"></span>
                      <span>Email An toàn</span>
                    </div>
                    <div className="status-card danger">
                      <span className="status-dot"></span>
                      <span>Phishing Detected</span>
                    </div>
                    <div className="status-card warning">
                      <span className="status-dot"></span>
                      <span>Spam Warning</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 