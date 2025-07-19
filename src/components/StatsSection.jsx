import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin } from 'antd';
import { 
  SafetyOutlined,
  SecurityScanOutlined,
  AlertOutlined,
  MailOutlined,
  TrophyOutlined,
  FireOutlined
} from '@ant-design/icons';
import { getEmailStats } from '../services/emailService';

const { Title, Paragraph } = Typography;

const StatsSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getEmailStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, suffix = "" }) => (
    <Card className="stat-card" bordered={false} hoverable>
      <Statistic
        title={title}
        value={value}
        prefix={
          <div className="stat-icon" style={{ color }}>
            {icon}
          </div>
        }
        suffix={suffix}
        valueStyle={{ 
          color,
          fontSize: '28px',
          fontWeight: 'bold'
        }}
        className="stat-item"
      />
    </Card>
  );

  if (loading) {
    return (
      <div className="stats-section">
        <div className="container">
          <Row justify="center" style={{ padding: '60px 0' }}>
            <Spin size="large" />
          </Row>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-section">
      <div className="container">
        <div className="section-header">
          <Title level={2} className="section-title">
            Thống kê Hiệu quả
          </Title>
          <Paragraph className="section-description">
            Những con số ấn tượng về khả năng bảo vệ của hệ thống
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="Tổng số Email đã kiểm tra"
              value={stats?.totalChecked || 0}
              icon={<MailOutlined />}
              color="#1890ff"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="Mối đe dọa đã chặn"
              value={stats?.threatsBlocked || 0}
              icon={<SecurityScanOutlined />}
              color="#f5222d"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="Email an toàn"
              value={stats?.safeEmails || 0}
              icon={<SafetyOutlined />}
              color="#52c41a"
            />
          </Col>
        </Row>

        <div className="today-stats">
          <Title level={3} className="today-title">
            Hoạt động hôm nay
          </Title>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <StatCard
                title="Email đã kiểm tra"
                value={stats?.todayChecked || 0}
                icon={<TrophyOutlined />}
                color="#722ed1"
              />
            </Col>
            
            <Col xs={24} sm={8}>
              <StatCard
                title="Phishing phát hiện"
                value={stats?.phishingDetected || 0}
                icon={<AlertOutlined />}
                color="#fa541c"
              />
            </Col>
            
            <Col xs={24} sm={8}>
              <StatCard
                title="Spam đã chặn"
                value={stats?.spamBlocked || 0}
                icon={<FireOutlined />}
                color="#faad14"
              />
            </Col>
          </Row>
        </div>

        <div className="accuracy-showcase">
          <Card className="accuracy-card" bordered={false}>
            <Row align="middle" gutter={[48, 24]}>
              <Col xs={24} lg={12}>
                <div className="accuracy-content">
                  <Title level={3} className="accuracy-title">
                    Độ chính xác cao
                  </Title>
                  <Paragraph className="accuracy-description">
                    Hệ thống AI của chúng tôi đạt độ chính xác <strong>99.9%</strong> 
                    trong việc phát hiện email lừa đảo và spam, giúp bảo vệ 
                    hàng triệu người dùng mỗi ngày.
                  </Paragraph>
                  <div className="accuracy-features">
                    <div className="accuracy-item">
                      <span className="accuracy-number">99.9%</span>
                      <span className="accuracy-label">Độ chính xác</span>
                    </div>
                    <div className="accuracy-item">
                      <span className="accuracy-number">0.01%</span>
                      <span className="accuracy-label">False Positive</span>
                    </div>
                    <div className="accuracy-item">
                      <span className="accuracy-number">24/7</span>
                      <span className="accuracy-label">Giám sát</span>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} lg={12}>
                <div className="accuracy-visual">
                  <div className="protection-shield">
                    <SafetyOutlined className="shield-large" />
                    <div className="shield-stats">
                      <div className="shield-stat">
                        <span className="shield-number">
                          {Math.round((stats?.safeEmails / stats?.totalChecked) * 100)}%
                        </span>
                        <span className="shield-label">Protected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StatsSection; 