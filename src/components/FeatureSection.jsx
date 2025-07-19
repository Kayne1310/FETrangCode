import React from 'react';
import { Row, Col, Card, Typography, Space } from 'antd';
import { 
  SafetyOutlined,
  ScanOutlined,
  AlertOutlined,
  ApiOutlined,
  BookOutlined,
  TeamOutlined,
  RobotOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const FeatureSection = () => {
  const communityFeatures = [
    {
      icon: <BookOutlined className="feature-card-icon" />,
      title: 'Giáo dục Cộng đồng',
      description: 'Cung cấp kiến thức và kỹ năng nhận biết email lừa đảo, phishing và các mối đe dọa trực tuyến.',
      color: '#1890ff'
    },
    {
      icon: <ScanOutlined className="feature-card-icon" />,
      title: 'Kiểm tra Tức thì',
      description: 'Nhập email, link, số điện thoại để kiểm tra độ an toàn ngay lập tức với AI tiên tiến.',
      color: '#52c41a'
    },
    {
      icon: <AlertOutlined className="feature-card-icon" />,
      title: 'Cảnh báo Thông minh',
      description: 'Hệ thống cảnh báo tự động các mối đe dọa từ email, website giả mạo và cuộc gọi lạ.',
      color: '#fa541c'
    },
    {
      icon: <TeamOutlined className="feature-card-icon" />,
      title: 'Hỗ trợ Cộng đồng',
      description: 'Xây dựng mạng lưới cộng đồng chia sẻ thông tin và cảnh báo về các mối đe dọa mới.',
      color: '#722ed1'
    }
  ];

  const businessFeatures = [
    {
      icon: <RobotOutlined className="feature-card-icon" />,
      title: 'AI Phân loại Tự động',
      description: 'Phân loại email thành: An toàn, Nghi ngờ, Spam, Phishing với độ chính xác 99.9%',
      color: '#1890ff'
    },
    {
      icon: <ClockCircleOutlined className="feature-card-icon" />,
      title: 'Giám sát 24/7',
      description: 'Hệ thống tự động giám sát và cập nhật trạng thái email theo thời gian thực.',
      color: '#52c41a'
    },
    {
      icon: <ApiOutlined className="feature-card-icon" />,
      title: 'Tích hợp Doanh nghiệp',
      description: 'Kết nối API với hệ thống email doanh nghiệp để bảo vệ toàn diện.',
      color: '#fa541c'
    },
    {
      icon: <SafetyOutlined className="feature-card-icon" />,
      title: 'Báo cáo Chi tiết',
      description: 'Dashboard thống kê và báo cáo chi tiết về tình hình bảo mật email.',
      color: '#722ed1'
    }
  ];

  const FeatureCard = ({ feature }) => (
    <Card 
      className="feature-card"
      hoverable
      bordered={false}
    >
      <div className="feature-card-content">
        <div className="feature-icon-wrapper" style={{ color: feature.color }}>
          {feature.icon}
        </div>
        <Title level={4} className="feature-card-title">
          {feature.title}
        </Title>
        <Paragraph className="feature-card-description">
          {feature.description}
        </Paragraph>
      </div>
    </Card>
  );

  return (
    <div className="feature-section">
      <div className="container">
        {/* Community Features */}
        <div className="feature-group">
          <div className="section-header">
            <Title level={2} className="section-title">
              Dành cho Cộng đồng
            </Title>
            <Paragraph className="section-description">
              Giúp mọi người nhận biết và tránh các mối đe dọa trực tuyến
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]}>
            {communityFeatures.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <FeatureCard feature={feature} />
              </Col>
            ))}
          </Row>
        </div>

        {/* Business Features */}
        <div className="feature-group">
          <div className="section-header">
            <Title level={2} className="section-title">
              Dành cho Doanh nghiệp
            </Title>
            <Paragraph className="section-description">
              Giải pháp bảo mật email toàn diện cho tổ chức và doanh nghiệp
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]}>
            {businessFeatures.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <FeatureCard feature={feature} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection; 